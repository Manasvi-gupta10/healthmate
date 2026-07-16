export const SYMPTOMS_LIST = [
  "Fever",
  "Cough",
  "Sore Throat",
  "Runny Nose",
  "Body Pain",
  "Headache",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Stomach Pain",
  "Acidity",
  "Fatigue",
  "Dizziness",
  "Teary Eyes",
  "Itchy Eyes",
  "Constipation",
  "Back Pain",
  "Allergy",
  "Insomnia",
  "Stress",
];

export const DISEASE_DATASET = [
  {
    name: "Flu",
    symptoms: {
      Fever: 5,
      Cough: 4,
      "Body Pain": 5,
      Fatigue: 4,
      Headache: 3,
      "Sore Throat": 3,
    },
  },
  {
    name: "Common Cold",
    symptoms: {
      Cough: 4,
      "Sore Throat": 4,
      "Runny Nose": 5,
      Fever: 2,
      Fatigue: 2,
    },
  },
  {
    name: "Migraine",
    symptoms: {
      Headache: 5,
      Nausea: 4,
      Vomiting: 2,
      Dizziness: 3,
      Fatigue: 2,
      Stress: 3,
    },
  },
  {
    name: "Food Poisoning",
    symptoms: {
      Nausea: 5,
      Vomiting: 5,
      Diarrhea: 5,
      "Stomach Pain": 5,
      Fever: 3,
      Fatigue: 4,
    },
  },
  {
    name: "Acid Reflux / GERD",
    symptoms: {
      Acidity: 5,
      "Stomach Pain": 3,
      Nausea: 2,
      "Sore Throat": 2,
    },
  },
  {
    name: "Allergic Rhinitis",
    symptoms: {
      "Runny Nose": 4,
      "Teary Eyes": 5,
      "Itchy Eyes": 5,
      Allergy: 5,
      Cough: 2,
    },
  },
  {
    name: "Gastroenteritis (Stomach Flu)",
    symptoms: {
      Diarrhea: 5,
      Vomiting: 4,
      Nausea: 4,
      "Stomach Pain": 4,
      Fever: 3,
      "Body Pain": 2,
    },
  },
  {
    name: "Tension Headache",
    symptoms: {
      Headache: 4,
      Stress: 5,
      Fatigue: 3,
      Insomnia: 2,
    },
  },
  {
    name: "IBS (Irritable Bowel Syndrome)",
    symptoms: {
      "Stomach Pain": 4,
      Diarrhea: 3,
      Constipation: 3,
      Stress: 3,
    },
  },
  {
    name: "COVID-19 (Typical)",
    symptoms: {
      Fever: 5,
      Cough: 5,
      Fatigue: 5,
      "Body Pain": 4,
      "Sore Throat": 3,
      Headache: 3,
    },
  },
];

export function matchSymptoms(selectedSymptoms) {
  if (selectedSymptoms.length === 0) return [];

  const results = [];

  for (const disease of DISEASE_DATASET) {
    let score = 0;
    let maxPossibleScore = 0;

    // Calculate max possible score for this disease to normalize
    for (const weight of Object.values(disease.symptoms)) {
      maxPossibleScore += weight;
    }

    // Calculate actual score based on selected symptoms
    for (const symptom of selectedSymptoms) {
      if (disease.symptoms[symptom]) {
        score += disease.symptoms[symptom];
      }
    }

    // Calculate confidence percentage based on how much of the disease profile is matched
    // We also could penalize for selected symptoms that are NOT in the disease profile,
    // but a simple ratio works well enough for this scope.
    let confidence = 0;
    if (maxPossibleScore > 0) {
      confidence = Math.round((score / maxPossibleScore) * 100);
    }

    if (confidence > 0) {
      results.push({
        disease: disease.name,
        score,
        confidence,
      });
    }
  }

  // Sort descending by confidence
  results.sort((a, b) => b.confidence - a.confidence);

  // Return top 3
  return results.slice(0, 3);
}
