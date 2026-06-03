const express = require('express');
const router = express.Router();
const Search = require('../models/Search');
const medicineMapping = require('../utils/medicineMapping.json');

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
  symptoms: `You are HealthMate. The user lists symptoms. Reply in Markdown:
## Possible Conditions
A short list (3–5) with a one-line explanation each.
## Seriousness Level
One of: **Mild**, **Moderate**, **Serious — see a doctor soon**, **Emergency — seek care now**.
## Precautions
End with: *Educational info only — not a diagnosis.*`,
  remedies: `You are HealthMate. The user names a common problem (cold, acidity, headache, etc.). Reply in Markdown:
## Home Remedies
Bullet list of 4–6 safe, traditional remedies with how to use them.
## When to See a Doctor
End with: *Try gentle remedies first; seek care if symptoms persist.*`,
  diet: `You are HealthMate, a friendly dietician. Input is JSON with age, weight (kg), and condition. Reply in Markdown:
## Foods to Eat
## Foods to Avoid
## Sample Daily Meal Plan
Breakfast / Lunch / Snack / Dinner.
End with: *General guidance — consult a registered dietician for a personal plan.*`,
};

router.post('/', async (req, res) => {
  try {
    const { feature, query } = req.body;
    
    if (!feature || !query) {
      return res.status(400).json({ message: 'Feature and query are required' });
    }

    const apiKey = process.env.LOVABLE_API_KEY || process.env.GEMINI_API_KEY || 'fake-key-for-dev';
    
    // Call the Lovable AI gateway (or any other OpenAI compatible API like Google Gemini)
    // We will use a mock response for demonstration if no key is provided, 
    // but the code handles actual fetch if a valid key is provided in .env
    
    let content = null;

    if (feature === 'medicine') {
      try {
        const normalizedQuery = query.toLowerCase().trim();
        const genericMedicine = medicineMapping[normalizedQuery] || normalizedQuery;
        
        const fdaResponse = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(genericMedicine)}"&limit=1`);
        
        if (fdaResponse.ok) {
          const data = await fdaResponse.json();
          if (data.results && data.results.length > 0) {
            const drug = data.results[0];
            const uses = drug.indications_and_usage ? drug.indications_and_usage[0] : 'Information not available.';
            const sideEffects = drug.adverse_reactions ? drug.adverse_reactions[0] : (drug.warnings ? drug.warnings[0] : 'Information not available.');
            const precautions = drug.precautions ? drug.precautions[0] : (drug.warnings ? drug.warnings[0] : 'Information not available.');
            const overdose = drug.overdosage ? drug.overdosage[0] : (drug.warnings ? drug.warnings[0] : 'Information not available.');
            const dosage = drug.dosage_and_administration ? drug.dosage_and_administration[0] : 'Information not available.';
            const manufacturer = drug.openfda && drug.openfda.manufacturer_name ? drug.openfda.manufacturer_name[0] : 'Unknown Manufacturer';
            
            content = `## Uses\n${uses}\n\n## Dosage\n${dosage}\n\n## Common Side Effects\n${sideEffects}\n\n## Precautions\n${precautions}\n\n## Overdose Warning\n${overdose}\n\n## Manufacturer\n${manufacturer}\n\n*Educational info only — consult a doctor.*`;
          } else {
            return res.status(404).json({ message: "Medicine not found. Please check the spelling or try a valid medicine name." });
          }
        } else {
           return res.status(404).json({ message: "Medicine not found. Please check the spelling or try a valid medicine name." });
        }
      } catch (fdaError) {
        console.error("FDA API Error:", fdaError);
        return res.status(500).json({ message: "Failed to fetch medicine data. Please try again later." });
      }
    } else if (feature === 'interaction') {
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

    if (!content) {
      content = "AI response placeholder. Please add LOVABLE_API_KEY to backend/.env";

    if (apiKey && apiKey !== 'fake-key-for-dev') {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
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

      if (!response.ok) {
        throw new Error("AI service unavailable");
      }
      
      const json = await response.json();
      content = json.choices?.[0]?.message?.content ?? content;
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
