const express = require('express');
const router = express.Router();
const Search = require('../models/Search');
const medicineMapping = require('../utils/medicineMapping.json');
const interactionDB = require('../utils/interactionDB.json');

router.post('/', async (req, res) => {
  try {
    const { drug1, drug2 } = req.body;
    
    if (!drug1 || !drug2) {
      return res.status(400).json({ message: 'Both drug1 and drug2 are required' });
    }

    // Convert to lowercase and trim
    const d1 = drug1.toLowerCase().trim();
    const d2 = drug2.toLowerCase().trim();

    // Map to generic names if exists
    const gen1 = medicineMapping[d1] || d1;
    const gen2 = medicineMapping[d2] || d2;

    // Check local DB
    const localMatch = interactionDB.find(
      (entry) =>
        (entry.drugs.includes(gen1) && entry.drugs.includes(gen2))
    );

    if (localMatch) {
      // Log search history for analytics/history
      const search = new Search({
        user_id: req.user.id,
        feature: 'interaction_check',
        query: `${drug1} + ${drug2}`,
        result: `Level: ${localMatch.level}`
      });
      await search.save();

      return res.json({
        source: 'local',
        level: localMatch.level,
        explanation: localMatch.description,
        precautions: localMatch.precautions || 'Consult a healthcare professional for further advice.'
      });
    }

    // If not found in local DB, query Groq API
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ message: 'Groq API Key not configured and interaction not found in local database.' });
    }

    const prompt = `Analyze the possible interaction between:
Medicine 1: ${gen1}
Medicine 2: ${gen2}

Return:
1. Interaction Level (Low, Moderate, High)
2. Brief Explanation
3. Precautions

Keep the response concise and educational. Do not claim medical certainty.

You MUST return the output ONLY as a valid JSON object with the following keys exactly:
{
  "level": "Low" | "Moderate" | "High",
  "explanation": "...",
  "precautions": "..."
}
Do not include any markdown formatting (like \`\`\`json) or extra text outside the JSON object.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error('Groq API error');
    }

    const jsonRes = await response.json();
    let content = jsonRes.choices?.[0]?.message?.content?.trim() ?? "{}";
    
    // Attempt to clean up if the LLM wrapped it in markdown
    if (content.startsWith("```json")) {
      content = content.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (content.startsWith("```")) {
      content = content.replace(/^```/, "").replace(/```$/, "").trim();
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (parseErr) {
      console.error("Failed to parse Groq response as JSON:", content);
      return res.status(500).json({ message: 'Failed to parse interaction data from AI.' });
    }

    // Log search history
    const search = new Search({
      user_id: req.user.id,
      feature: 'interaction_check',
      query: `${drug1} + ${drug2}`,
      result: `Level: ${parsedContent.level || 'Unknown'}`
    });
    await search.save();

    return res.json({
      source: 'groq',
      level: parsedContent.level || 'Unknown',
      explanation: parsedContent.explanation || 'No explanation provided.',
      precautions: parsedContent.precautions || 'Consult a healthcare professional for further advice.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error processing interaction request' });
  }
});

module.exports = router;
