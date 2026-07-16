import { useState } from "react";
import { Salad } from "lucide-react";
import { FeatureForm } from "@/components/feature-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Diet() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [condition, setCondition] = useState("");
  return (
    <FeatureForm
      feature="diet"
      title="Diet Planner"
      subtitle="Personal food guidance based on your age, weight, and condition."
      icon={<Salad className="h-5 w-5" />}
      buildQuery={() => {
        if (!age || !weight) return null;
        return JSON.stringify({
          age: Number(age),
          weight_kg: Number(weight),
          condition: condition || "general wellness",
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min={1}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wt">Weight (kg)</Label>
          <Input
            id="wt"
            type="number"
            min={1}
            max={400}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cond">Condition</Label>
          <Input
            id="cond"
            placeholder="e.g. diabetes"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
        </div>
      </div>
    </FeatureForm>
  );
}
