import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pill,
  GitMerge,
  Stethoscope,
  Leaf,
  Salad,
  Plus,
  Bell,
  Sparkles,
  Trash2,
  Clock,
  Activity,
  Search,
  ArrowRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const tips = [
  "Drink a glass of water as soon as you wake up — your body has been fasting for hours.",
  "A 10-minute walk after meals helps regulate blood sugar.",
  "Aim for 7–8 hours of sleep — it's the most under-rated medicine.",
  "Add one extra vegetable to your lunch plate today.",
  "Deep breathe for 2 minutes — it lowers cortisol almost instantly.",
  "Stretch for 5 minutes every hour if you sit at a desk.",
  "Replace one sugary drink with water or herbal tea today.",
];

const quickCards = [
  {
    to: "/medicine",
    icon: Pill,
    label: "Medicine Info",
    desc: "Check uses, side effects & warnings",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    to: "/interactions",
    icon: GitMerge,
    label: "Drug Interactions",
    desc: "See if two medicines are safe together",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    to: "/symptoms",
    icon: Stethoscope,
    label: "Symptom Checker",
    desc: "Find possible causes for symptoms",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    to: "/remedies",
    icon: Leaf,
    label: "Home Remedies",
    desc: "Natural relief for common problems",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    to: "/diet",
    icon: Salad,
    label: "Diet Planner",
    desc: "Personalized meal suggestions",
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
] as const;

interface Recent {
  id: string;
  feature: string;
  query: string;
  created_at: string;
}
interface Reminder {
  id: string;
  title: string;
  remind_at: string;
  done: boolean;
}

function Dashboard() {
  const { user } = useAuth();
  const [name, setName] = useState<string>("");
  const [recent, setRecent] = useState<Recent[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);
  const [newRem, setNewRem] = useState("");
  const [newWhen, setNewWhen] = useState("");

  const load = async () => {
    if (!user) return;
    const [{ data: profile }, { data: rs }, { data: rm }] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("recent_searches")
        .select("id,feature,query,created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("reminders")
        .select("id,title,remind_at,done")
        .order("remind_at", { ascending: true })
        .limit(8),
    ]);
    setName(profile?.display_name ?? user.email?.split("@")[0] ?? "there");
    setRecent(rs ?? []);
    setReminders(rm ?? []);
  };

  useEffect(() => {
    load();
  }, [user]);

  const addReminder = async () => {
    if (!newRem || !newWhen || !user) return;
    const { error } = await supabase.from("reminders").insert({
      user_id: user.id,
      title: newRem,
      remind_at: new Date(newWhen).toISOString(),
    });
    if (error) toast.error(error.message);
    else {
      setNewRem("");
      setNewWhen("");
      load();
    }
  };

  const toggleDone = async (r: Reminder) => {
    await supabase.from("reminders").update({ done: !r.done }).eq("id", r.id);
    load();
  };

  const delReminder = async (id: string) => {
    await supabase.from("reminders").delete().eq("id", id);
    load();
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-8">
      {/* Hero greeting */}
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {greeting}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight mt-0.5">
            Welcome back, {name} 👋
          </h1>
          <p className="mt-1.5 text-muted-foreground text-sm max-w-md">
            Your personal health companion. Check medicine info, find remedies,
            or plan your diet.
          </p>
        </div>
        <div className="hidden sm:grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Activity className="h-6 w-6" />
        </div>
      </header>

      {/* Tip card */}
      <Card className="relative overflow-hidden border-none bg-gradient-to-r from-emerald-50/80 to-teal-50/80 p-5 dark:from-emerald-950/30 dark:to-teal-950/30">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 h-16 w-16 rounded-full bg-emerald-100/50 blur-2xl dark:bg-emerald-900/30" />
        <div className="relative flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/70 shadow-sm dark:bg-white/10">
            <Sparkles className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
              Health Tip
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/90">
              {tip}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick access */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Quick access</h2>
          <span className="text-xs text-muted-foreground">
            {quickCards.length} tools
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickCards.map(({ to, icon: Icon, label, desc, color, bg }) => (
            <Link
              key={to}
              to={to}
              className="group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[var(--shadow-soft)]"
            >
              <div
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${bg} ${color} transition-transform group-hover:scale-105`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {desc}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent searches */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <h2 className="font-display text-xl">Recent searches</h2>
            </div>
          </div>
          {recent.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center py-6 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                No searches yet
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground/70">
                Try a feature above to see history here.
              </p>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm transition-colors hover:bg-background"
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {r.query}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {r.feature} ·{" "}
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Reminders */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <h2 className="font-display text-xl">Reminders</h2>
            </div>
            {reminders.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {reminders.filter((r) => r.done).length}/{reminders.length} done
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Take vitamin D..."
              value={newRem}
              onChange={(e) => setNewRem(e.target.value)}
              className="h-10"
            />
            <Input
              type="datetime-local"
              value={newWhen}
              onChange={(e) => setNewWhen(e.target.value)}
              className="h-10 sm:w-52"
            />
            <Button
              onClick={addReminder}
              size="sm"
              className="h-10 px-4 shrink-0"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Add
            </Button>
          </div>

          <ul className="mt-3 space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {reminders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  No reminders yet
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground/70">
                  Add one above to get started.
                </p>
              </div>
            )}
            {reminders.map((r) => (
              <li
                key={r.id}
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-all ${
                  r.done
                    ? "border-transparent bg-muted/40"
                    : "border-border bg-background/60 hover:bg-background"
                }`}
              >
                <button
                  onClick={() => toggleDone(r)}
                  className="shrink-0 text-primary transition-transform active:scale-90"
                >
                  {r.done ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <span
                  className={`min-w-0 flex-1 truncate ${r.done ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {r.title}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {new Date(r.remind_at).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <button
                  onClick={() => delReminder(r.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
