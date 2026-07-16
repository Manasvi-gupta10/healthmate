import { useState } from "react";
import { Pill } from "lucide-react";
import { FeatureForm } from "@/components/feature-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Medicine() {
  const [name, setName] = useState("");
  return (
    <FeatureForm
      feature="medicine"
      title="Medicine Information"
      subtitle="Enter a medicine name to learn its uses, side effects, and precautions."
      icon={<Pill className="h-5 w-5" />}
      buildQuery={() => name.trim() || null}
    >
      <div className="space-y-1.5">
        <Label htmlFor="med">Medicine name</Label>
        <Input
          id="med"
          placeholder="e.g. Paracetamol"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </FeatureForm>
  );
}
