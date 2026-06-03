import { useState } from "react";
import { GitMerge } from "lucide-react";
import { FeatureForm } from "@/components/feature-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Interactions() {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    return (
      <FeatureForm
        feature="interaction"
        title="Drug Interaction Checker"
        subtitle="Check whether two medicines are safe to take together."
        icon={<GitMerge className="h-5 w-5" />}
        buildQuery={() =>
          a.trim() && b.trim() ? `${a.trim()} + ${b.trim()}` : null
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="a">Medicine 1</Label>
            <Input
              id="a"
              placeholder="e.g. Aspirin"
              value={a}
              onChange={(e) => setA(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b">Medicine 2</Label>
            <Input
              id="b"
              placeholder="e.g. Ibuprofen"
              value={b}
              onChange={(e) => setB(e.target.value)}
            />
          </div>
        </div>
      </FeatureForm>
    );
  }
