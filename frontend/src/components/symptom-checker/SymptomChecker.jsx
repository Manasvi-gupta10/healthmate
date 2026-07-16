import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SymptomSelector } from "./SymptomSelector";
import { ConditionResults } from "./ConditionResults";
import { AIHealthGuidance } from "./AIHealthGuidance";
import { matchSymptoms } from "@/utils/symptomMatcher";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [results, setResults] = useState([]);
  const [aiGuidance, setAiGuidance] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleToggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom],
    );
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom.");
      return;
    }

    setIsAnalyzing(true);
    setAiGuidance("");
    setResults([]);

    try {
      // 1. Run local matching algorithm
      const matchedResults = matchSymptoms(selectedSymptoms);
      setResults(matchedResults);

      if (matchedResults.length === 0) {
        toast.error(
          "Could not find a match for those symptoms. Please try selecting more common symptoms.",
        );
        setIsAnalyzing(false);
        return;
      }

      const topCondition = matchedResults[0].disease;

      // 2. Fetch AI Guidance for the top condition
      const query = `Symptoms: ${selectedSymptoms.join(", ")}\nMost Likely Condition: ${topCondition}`;
      const response = await apiFetch("/ask", {
        method: "POST",
        body: JSON.stringify({
          feature: "symptom_checker",
          query: query,
        }),
      });

      setAiGuidance(response.content);
    } catch (error) {
      toast.error(error.message || "Failed to analyze symptoms.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
        <SymptomSelector
          selectedSymptoms={selectedSymptoms}
          onToggleSymptom={handleToggleSymptom}
        />

        <div className="flex justify-end">
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full md:w-auto">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Symptoms"
            )}
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <ConditionResults results={results} />

          {isAnalyzing && !aiGuidance && (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Generating AI health guidance...
            </div>
          )}

          {aiGuidance && <AIHealthGuidance content={aiGuidance} />}
        </div>
      )}
    </div>
  );
}
