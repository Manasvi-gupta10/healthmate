import { useState, type FormEvent } from "react";
import { GitMerge, Loader2, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InteractionResult {
  level: string;
  explanation: string;
  precautions: string;
}

export default function Interactions() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InteractionResult | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!a.trim() || !b.trim()) {
      toast.error("Please enter both medicines.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await apiFetch("/interactions/check", {
        method: "POST",
        body: JSON.stringify({ drug1: a, drug2: b }),
      });
      setResult(r);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to check interaction.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyles = (level: string) => {
    const l = level.toLowerCase();
    if (l === "high") return "bg-red-500/10 text-red-600 border-red-500/20";
    if (l === "moderate") return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    return "bg-green-500/10 text-green-600 border-green-500/20";
  };

  const getSeverityIcon = (level: string) => {
    const l = level.toLowerCase();
    if (l === "high") return <ShieldAlert className="h-5 w-5" />;
    if (l === "moderate") return <AlertTriangle className="h-5 w-5" />;
    return <Info className="h-5 w-5" />;
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <GitMerge className="h-5 w-5" />
          </div>
          <h1 className="font-display text-3xl text-foreground">Drug Interaction Checker</h1>
        </div>
        <p className="text-muted-foreground">Check whether two medicines are safe to take together.</p>
      </header>

      <Card className="p-5 shadow-[var(--shadow-soft)]">
        <form onSubmit={onSubmit} className="space-y-4">
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
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Interaction"
            )}
          </Button>
        </form>
      </Card>

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className={`overflow-hidden border-2 ${getSeverityStyles(result.level)} shadow-lg`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {getSeverityIcon(result.level)}
                <h2 className="text-xl font-bold uppercase tracking-wide">
                  Interaction Level: {result.level}
                </h2>
              </div>
              
              <div className="space-y-4 text-foreground">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Explanation</h3>
                  <p className="leading-relaxed opacity-90">{result.explanation}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-1">Precautions</h3>
                  <p className="leading-relaxed opacity-90">{result.precautions}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <p className="text-xs text-center text-muted-foreground italic">
            This information is for educational purposes only and should not replace professional medical advice.
          </p>
        </div>
      )}
    </div>
  );
}
