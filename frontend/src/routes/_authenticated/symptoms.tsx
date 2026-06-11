import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { FeatureForm } from "@/components/feature-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Symptoms() {
    const [s, setS] = useState("");
    const [age, setAge] = useState("");
    const [duration, setDuration] = useState("");

    const handleBuildQuery = () => {
      if (!s.trim()) return null;
      let query = `Symptoms: ${s.trim()}`;
      if (age.trim()) query += `\nAge: ${age.trim()}`;
      if (duration.trim()) query += `\nDuration: ${duration.trim()}`;
      return query;
    };

    return (
      <FeatureForm
        feature="symptoms"
        title="Symptom Checker"
        subtitle="List your symptoms — get possible conditions, seriousness, and what to do."
        icon={<Stethoscope className="h-5 w-5" />}
        buildQuery={handleBuildQuery}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="symptoms">Your symptoms</Label>
            <Textarea
              id="symptoms"
              placeholder="e.g. fever, dry cough, body ache"
              rows={3}
              value={s}
              onChange={(e) => setS(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="age">Age (optional)</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g. 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="duration">How long? (optional)</Label>
              <Input
                id="duration"
                placeholder="e.g. 2 days"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
        </div>
      </FeatureForm>
    );
  }
