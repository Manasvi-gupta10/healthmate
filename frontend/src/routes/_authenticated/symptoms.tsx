import { Stethoscope } from "lucide-react";
import { SymptomChecker } from "@/components/symptom-checker/SymptomChecker";

export default function Symptoms() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Symptom Checker</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Select your symptoms to see possible conditions and get AI-powered health guidance.
        </p>
      </div>

      <SymptomChecker />
    </div>
  );
}
