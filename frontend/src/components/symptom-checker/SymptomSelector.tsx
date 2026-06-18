import { SYMPTOMS_LIST } from "@/utils/symptomMatcher";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onToggleSymptom: (symptom: string) => void;
}

export function SymptomSelector({ selectedSymptoms, onToggleSymptom }: SymptomSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Select your symptoms</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg border">
        {SYMPTOMS_LIST.map((symptom) => (
          <div key={symptom} className="flex items-center space-x-2">
            <Checkbox
              id={`symptom-${symptom}`}
              checked={selectedSymptoms.includes(symptom)}
              onCheckedChange={() => onToggleSymptom(symptom)}
            />
            <label
              htmlFor={`symptom-${symptom}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
            >
              {symptom}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
