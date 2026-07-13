const express = require('express');
const router = express.Router();
const Search = require('../models/Search');
const medicineMapping = require('../utils/medicineMapping.json');
const remediesData = require('../utils/remediesData.json');

const SYSTEM_PROMPTS = {
  medicine: `You are HealthMate, a careful medical-information assistant. The user gives a medicine name. Reply in clean Markdown with these sections (use ## headings):
## Uses
## Common Side Effects
## Precautions
## Overdose Warning
End with a short italic disclaimer: *Educational info only — consult a doctor.*`,
  interaction: `You are HealthMate. The user gives two medicines separated by " + ". Reply in Markdown:
## Verdict
One of: **Safe**, **Use with caution**, or **Unsafe**.
## Why
## Possible Side Effects of Combining
## What to do
End with: *Educational info only — consult a doctor or pharmacist.*`,
  symptoms: `You are HealthMate, a highly accurate medical diagnostic assistant. The user lists symptoms, and may provide their age and duration of symptoms. Use this demographic and temporal data to provide a highly accurate assessment. Reply in Markdown:
## Possible Conditions
A short list (3–5) with a one-line explanation each, ranked by likelihood based on the provided symptoms, age, and duration.
## Seriousness Level
One of: **Mild**, **Moderate**, **Serious — see a doctor soon**, **Emergency — seek care now**.
## Precautions & Recommendations
Specific next steps to take.
End with: *Educational info only — not a medical diagnosis.*`,
  remedies: `You are HealthMate. The user names a common problem (cold, acidity, headache, etc.). Reply in Markdown:
## Home Remedies
Bullet list of 4–6 safe, traditional remedies. Format each bullet EXACTLY like this:
- **Remedy Name**: How to use it.
## When to See a Doctor
End with exactly: *Try gentle remedies first; seek care if symptoms persist.*`,
  diet: `You are HealthMate, a friendly dietician. Input is JSON with age, weight (kg), and condition. Reply in Markdown:
## Foods to Eat
## Foods to Avoid
## Sample Daily Meal Plan
Breakfast / Lunch / Snack / Dinner.
End with: *General guidance — consult a registered dietician for a personal plan.*`,
  symptom_checker: `You are HealthMate, a careful medical-information assistant. The user provides their selected symptoms and the most likely condition calculated by our local algorithm.
Reply in clean Markdown with these sections (use ## headings):
## Condition Overview
## Home Remedies
## Recommended Diet
## Foods to Avoid
## When to Consult a Doctor
Keep the response concise, medically safe, and easy to understand.
End with a short italic disclaimer: *This is not a medical diagnosis. Please consult a healthcare professional.*`,
};

router.post('/', async (req, res) => {
  try {
    const { feature, query } = req.body;
    
    if (!feature || !query) {
      return res.status(400).json({ message: 'Feature and query are required' });
    }

    const apiKey = process.env.LOVABLE_API_KEY || process.env.GROQ_API_KEY || 'fake-key-for-dev';
    
    // Call the Lovable AI gateway (or any other OpenAI compatible API like Google Gemini)
    // We will use a mock response for demonstration if no key is provided, 
    // but the code handles actual fetch if a valid key is provided in .env
    
    let content = null;

    if (feature === 'interaction') {
      try {
        const parts = query.split(' + ');
        if (parts.length !== 2) {
          return res.status(400).json({ message: "Please provide exactly two medicines separated by ' + '." });
        }
        
        let med1 = parts[0].trim().toLowerCase();
        let med2 = parts[1].trim().toLowerCase();
        
        med1 = medicineMapping[med1] || med1;
        med2 = medicineMapping[med2] || med2;

        const rxcui1Res = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(med1)}`);
        const rxcui1Data = await rxcui1Res.json();
        const id1 = rxcui1Data.idGroup?.rxnormId?.[0];

        const rxcui2Res = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(med2)}`);
        const rxcui2Data = await rxcui2Res.json();
        const id2 = rxcui2Data.idGroup?.rxnormId?.[0];

        if (!id1 || !id2) {
          const missing = [];
          if (!id1) missing.push(parts[0]);
          if (!id2) missing.push(parts[1]);
          return res.status(404).json({ message: `Could not find medicine in database: ${missing.join(', ')}` });
        }

        const interactionRes = await fetch(`https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${id1}+${id2}`);
        const interactionData = await interactionRes.json();

        if (interactionData.fullInteractionTypeGroup && interactionData.fullInteractionTypeGroup.length > 0) {
          const group = interactionData.fullInteractionTypeGroup[0];
          const interactionType = group.fullInteractionType[0];
          const interactionPair = interactionType.interactionPair[0];
          
          const severity = interactionPair.severity || 'Moderate';
          const description = interactionPair.description || 'These medicines interact with each other.';
          
          let status = 'Moderate';
          if (severity.toLowerCase() === 'high') status = 'Dangerous';
          
          content = `## Verdict\n**${status}**\n\n## Severity\n${severity}\n\n## Precautions\n${description}\n\n*Educational info only — consult a doctor or pharmacist.*`;
        } else {
          content = `## Verdict\n**Safe**\n\n## Severity\nNone\n\n## Precautions\nNo known significant drug interactions were found between these medications.\n\n*Educational info only — consult a doctor or pharmacist.*`;
        }
      } catch (err) {
        console.error("RxNav API Error:", err);
        return res.status(500).json({ message: "Failed to fetch interaction data. Please try again later." });
      }
    }

    if (feature === 'remedies') {
      const normalizedQuery = query.toLowerCase().trim();
      const parts = normalizedQuery.split(',').map(s => s.trim()).filter(Boolean);
      const matchedKeys = [];
      let allMatched = true;

      parts.forEach(part => {
        let matchedKey = null;
        if (remediesData[part]) {
          matchedKey = part;
        } else {
          if (part.includes('cold')) matchedKey = 'cold';
          else if (part.includes('cough')) matchedKey = 'cough';
          else if (part.includes('fever') || part.includes('temperature')) matchedKey = 'fever';
          else if (part.includes('migraine')) matchedKey = 'migraine';
          else if (part.includes('headache') || part.includes('head pain')) matchedKey = 'headache';
          else if (part.includes('acid')) matchedKey = 'acidity';
          else if (part.includes('constip')) matchedKey = 'constipation';
          else if (part.includes('diarrhea') || part.includes('loose motion')) matchedKey = 'diarrhea';
          else if (part.includes('throat')) matchedKey = 'sore throat';
          else if (part.includes('stomach pain') || part.includes('belly pain') || part.includes('stomach ache')) matchedKey = 'stomach pain';
          else if (part.includes('indigest') || part.includes('upset stomach')) matchedKey = 'indigestion';
          else if (part.includes('nausea')) matchedKey = 'nausea';
          else if (part.includes('vomit')) matchedKey = 'vomiting';
          else if (part.includes('body pain') || part.includes('body ache')) matchedKey = 'body pain';
          else if (part.includes('back pain') || part.includes('back ache')) matchedKey = 'back pain';
          else if (part.includes('toothache') || part.includes('tooth pain')) matchedKey = 'toothache';
          else if (part.includes('ear pain') || part.includes('ear ache')) matchedKey = 'ear pain';
          else if (part.includes('allergy') || part.includes('allergies')) matchedKey = 'allergy';
          else if (part.includes('insomnia') || part.includes('sleep')) matchedKey = 'insomnia';
          else if (part.includes('stress') || part.includes('anxiety')) matchedKey = 'stress';
        }
        if (matchedKey && !matchedKeys.includes(matchedKey)) {
          matchedKeys.push(matchedKey);
        }
        if (!matchedKey) {
          allMatched = false;
        }
      });

      if (matchedKeys.length > 0 && allMatched) {
        if (matchedKeys.length === 1) {
          content = remediesData[matchedKeys[0]];
        } else {
          content = matchedKeys.map(k => `### ${k.charAt(0).toUpperCase() + k.slice(1)} Remedies\n${remediesData[k].replace('## Home Remedies\n', '')}`).join('\n\n---\n\n');
        }
      }
    }

    if (!content) {
      if (process.env.GROQ_API_KEY) {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", "content": SYSTEM_PROMPTS[feature] },
              { role: "user", "content": query }
            ]
          })
        });

        if (response.ok) {
          const json = await response.json();
          content = json.choices?.[0]?.message?.content ?? null;
        } else {
          console.error("Groq API error status:", response.status);
          const errText = await response.text();
          console.error("Groq API error details:", errText);
          throw new Error("Groq AI service unavailable");
        }
      } else if (process.env.LOVABLE_API_KEY) {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: SYSTEM_PROMPTS[feature] },
              { role: "user", content: query },
            ],
          }),
        });

        if (response.ok) {
          const json = await response.json();
          content = json.choices?.[0]?.message?.content ?? null;
        } else {
          throw new Error("AI service unavailable");
        }
      }

      if (!content) {
        const availableRemedies = Object.keys(remediesData).map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(', ');
        content = `## Feature Offline / API Key Required

To query custom symptoms, conditions, or remedies, you need to configure an API key. 

### How to configure:
1. Open the \`.env\` file in the project root directory.
2. Add your Groq API key:
   \`\`\`env
   GROQ_API_KEY="your_actual_groq_api_key"
   \`\`\`
3. Save the file and restart the server.

---

### 💡 Offline Mode Available Remedies
We have high-quality, pre-configured home remedies available for:
- ${availableRemedies}

Try selecting or searching for one of the above!`;
      }
    }

    // Save to history
    const search = new Search({
      user_id: req.user.id,
      feature,
      query: query.substring(0, 500),
      result: content.substring(0, 4000)
    });
    await search.save();

    res.json({ content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error processing AI request' });
  }
});

module.exports = router;
