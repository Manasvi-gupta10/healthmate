import { useState, type FormEvent, type ReactNode } from "react";
import { type Feature } from "@/lib/api";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  feature: Feature;
  title: string;
  subtitle: string;
  icon: ReactNode;
  buildQuery: () => string | null;
  children: ReactNode;
}

export function FeatureForm({
  feature,
  title,
  subtitle,
  icon,
  buildQuery,
  children,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const q = buildQuery();
    if (!q) {
      toast.error("Please fill in the form.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const r = await apiFetch("/ask", {
        method: "POST",
        body: JSON.stringify({ feature, query: q }),
      });
      setResult(r.content);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          <h1 className="font-display text-3xl text-foreground">{title}</h1>
        </div>
        <p className="text-muted-foreground">{subtitle}</p>
      </header>

      <Card className="p-5 shadow-[var(--shadow-soft)]">
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking…
              </>
            ) : (
              "Get Answer"
            )}
          </Button>
        </form>
      </Card>

      {result && (
        <Card className="p-6 shadow-[var(--shadow-soft)]">
          <Markdown>{result}</Markdown>
        </Card>
      )}
    </div>
  );
}
