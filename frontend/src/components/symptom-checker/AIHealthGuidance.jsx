import { Markdown } from "@/components/markdown";
import { Sparkles } from "lucide-react";

export function AIHealthGuidance({ content }) {
  if (!content) return null;

  return (
    <div className="space-y-4 mt-8 pt-6 border-t">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Health Guidance</h3>
      </div>
      <div className="bg-muted/10 p-5 rounded-lg border">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
