import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf } from "lucide-react";
import { FeatureForm } from "@/components/feature-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/remedies")({
  component: () => {
    const [p, setP] = useState("");
    const chips = [
      "Cold",
      "Acidity",
      "Headache",
      "Sore throat",
      "Constipation",
    ];
    return (
      <FeatureForm
        feature="remedies"
        title="Home Remedies"
        subtitle="Gentle, traditional remedies for common everyday issues."
        icon={<Leaf className="h-5 w-5" />}
        buildQuery={() => p.trim() || null}
      >
        <div className="space-y-1.5">
          <Label htmlFor="prob">Health problem</Label>
          <Input
            id="prob"
            placeholder="e.g. cold, acidity"
            value={p}
            onChange={(e) => setP(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 pt-2">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setP(c)}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:border-primary"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </FeatureForm>
    );
  },
});
