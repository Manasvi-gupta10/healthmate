import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { FeatureForm } from "@/components/feature-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/symptoms")({
  component: () => {
    const [s, setS] = useState("");
    return (
      <FeatureForm
        feature="symptoms"
        title="Symptom Checker"
        subtitle="List your symptoms — get possible conditions, seriousness, and what to do."
        icon={<Stethoscope className="h-5 w-5" />}
        buildQuery={() => s.trim() || null}
      >
        <div className="space-y-1.5">
          <Label htmlFor="symptoms">Your symptoms</Label>
          <Textarea
            id="symptoms"
            placeholder="e.g. fever, dry cough, body ache for 2 days"
            rows={4}
            value={s}
            onChange={(e) => setS(e.target.value)}
          />
        </div>
      </FeatureForm>
    );
  },
});
