import { MatchResult } from "@/utils/symptomMatcher";
import { AlertCircle } from "lucide-react";

interface ConditionResultsProps {
  results: MatchResult[];
}

export function ConditionResults({ results }: ConditionResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Possible Conditions</h3>
      <ol className="space-y-3">
        {results.map((result, index) => (
          <li key={result.disease} className="flex items-center justify-between p-3 bg-muted/20 rounded-md border">
            <span className="font-medium text-base">
              {index + 1}. {result.disease}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              index === 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {result.confidence}% Match
            </span>
          </li>
        ))}
      </ol>
      <div className="flex items-start gap-2 p-3 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-md border border-amber-500/20 text-sm">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p>This is not a medical diagnosis. Please consult a healthcare professional.</p>
      </div>
    </div>
  );
}
