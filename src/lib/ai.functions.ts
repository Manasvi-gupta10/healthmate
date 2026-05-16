import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Feature =
  | "medicine"
  | "interaction"
  | "symptoms"
  | "remedies"
  | "diet";

const SYSTEM_PROMPTS: Record<Feature, string> = {
  medicine: `You are HealthMate, a careful medical-information assistant. The user gives a medicine name. Reply in clean Markdown with these sections (use ## headings):
## Uses
## Common Side Effects
## Precautions
## Overdose Warning
End with a short italic disclaimer: *Educational info only — consult a doctor.*`,
  interaction: `You are HealthMate. The user gives two medicines separated by " + ". Reply in Markdown:
## Verdict
One of: **Safe**, **Use with caution**, or **Unsafe**.
## Why
## Possible Side Effects of Combining
## What to do
End with: *Educational info only — consult a doctor or pharmacist.*`,
  symptoms: `You are HealthMate. The user lists symptoms. Reply in Markdown:
## Possible Conditions
A short list (3–5) with a one-line explanation each.
## Seriousness Level
One of: **Mild**, **Moderate**, **Serious — see a doctor soon**, **Emergency — seek care now**.
## Precautions
End with: *Educational info only — not a diagnosis.*`,
  remedies: `You are HealthMate. The user names a common problem (cold, acidity, headache, etc.). Reply in Markdown:
## Home Remedies
Bullet list of 4–6 safe, traditional remedies with how to use them.
## When to See a Doctor
End with: *Try gentle remedies first; seek care if symptoms persist.*`,
  diet: `You are HealthMate, a friendly dietician. Input is JSON with age, weight (kg), and condition. Reply in Markdown:
## Foods to Eat
## Foods to Avoid
## Sample Daily Meal Plan
Breakfast / Lunch / Snack / Dinner.
End with: *General guidance — consult a registered dietician for a personal plan.*`,
};

const inputSchema = z.object({
  feature: z.enum(["medicine", "interaction", "symptoms", "remedies", "diet"]),
  query: z.string().min(1).max(2000),
});

export const askHealthMate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI gateway not configured." };
    }

    const res = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS[data.feature] },
            { role: "user", content: data.query },
          ],
        }),
      },
    );

    if (!res.ok) {
      if (res.status === 429)
        return {
          ok: false as const,
          error: "Rate limit hit. Try again in a moment.",
        };
      if (res.status === 402)
        return {
          ok: false as const,
          error: "AI credits exhausted. Add credits in Settings.",
        };
      const t = await res.text();
      console.error("AI gateway error", res.status, t);
      return { ok: false as const, error: "AI service unavailable." };
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";

    // Save to history (fire and forget — don't fail the call)
    try {
      await context.supabase.from("recent_searches").insert({
        user_id: context.userId,
        feature: data.feature,
        query: data.query.slice(0, 500),
        result: content.slice(0, 4000),
      });
    } catch (e) {
      console.error("history insert failed", e);
    }

    return { ok: true as const, content };
  });
