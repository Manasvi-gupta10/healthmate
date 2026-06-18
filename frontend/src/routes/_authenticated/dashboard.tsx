import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
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
  Thermometer,
  Heart
} from "lucide-react";
import { toast } from "sonner";

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
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    to: "/interactions",
    icon: GitMerge,
    label: "Drug Interactions",
    desc: "See if two medicines are safe together",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    to: "/symptoms",
    icon: Stethoscope,
    label: "Symptom Checker",
    desc: "Find possible causes for symptoms",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    to: "/remedies",
    icon: Leaf,
    label: "Home Remedies",
    desc: "Natural relief for common problems",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
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

export default function Dashboard() {
  const { user } = useAuth();
  const [name, setName] = useState<string>("");
  const [recent, setRecent] = useState<Recent[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);
  const [newRem, setNewRem] = useState("");
  const [newWhen, setNewWhen] = useState("");

  const load = async () => {
    if (!user) return;
    try {
      const [rs, rm] = await Promise.all([
        apiFetch("/searches").catch(() => []),
        apiFetch("/reminders").catch(() => [])
      ]);
      setName(user.display_name ?? user.email?.split("@")[0] ?? "there");
      setRecent(Array.isArray(rs) ? rs : []);
      setReminders(Array.isArray(rm) ? rm : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const addReminder = async () => {
    if (!newRem || !newWhen || !user) return;
    try {
      await apiFetch("/reminders", {
        method: "POST",
        body: JSON.stringify({ title: newRem, remind_at: new Date(newWhen).toISOString() })
      });
      setNewRem("");
      setNewWhen("");
      load();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleDone = async (r: Reminder) => {
    try {
      await apiFetch(`/reminders/${r.id}/toggle`, { method: "PUT" });
      load();
    } catch (e) { console.error(e); }
  };

  const delReminder = async (id: string) => {
    try {
      // await apiFetch(`/reminders/${id}`, { method: "DELETE" });
      load();
    } catch (e) { console.error(e); }
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero greeting */}
      <header className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {greeting}
            </p>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{name}</span> 👋
          </h1>
          <p className="mt-3 text-muted-foreground text-lg max-w-md leading-relaxed">
            Your personal health companion is ready. How are you feeling today?
          </p>
        </div>
        <div className="hidden sm:grid h-16 w-16 shrink-0 place-items-center rounded-[20px] bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary shadow-lg shadow-primary/5">
          <Activity className="h-8 w-8" />
        </div>
      </header>

      {/* Tip card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-blue-500/20">
        <div className="relative flex items-center gap-4 bg-card/95 backdrop-blur-3xl px-6 py-5 rounded-[23px] h-full w-full">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-inner">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-1">
              Daily Health Tip
            </p>
            <p className="text-base font-medium text-foreground/90">
              {tip}
            </p>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Quick Access</h2>
          <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            {quickCards.length} Tools
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quickCards.map(({ to, icon: Icon, label, desc, color, bg }) => (
            <Link
              key={to}
              to={to}
              className="group card-premium flex flex-col justify-between h-full"
            >
              <div className="flex items-start justify-between">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${bg} ${color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="h-7 w-7" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-4 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary" />
              </div>
              <div className="mt-6">
                <p className="font-display font-bold text-lg text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent searches */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Search className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold">Recent Searches</h2>
            </div>
          </div>
          {recent.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center py-10 text-center rounded-2xl border border-dashed border-border bg-muted/30">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary text-muted-foreground mb-4">
                <Search className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-foreground">
                No searches yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground max-w-[200px]">
                Try a feature above to see your history here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 px-4 py-3 transition-colors hover:bg-muted/50 hover:border-primary/20"
                >
                  <div className="p-2 bg-secondary rounded-lg">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {r.query}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md capitalize">
                        {r.feature}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reminders */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Bell className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold">Reminders</h2>
            </div>
            {reminders.length > 0 && (
              <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full">
                {reminders.filter((r) => r.done).length}/{reminders.length} Done
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row mb-6">
            <Input
              placeholder="E.g. Take Vitamin D..."
              value={newRem}
              onChange={(e) => setNewRem(e.target.value)}
              className="h-12 bg-muted/50 border-border/50 focus-visible:ring-amber-500"
            />
            <Input
              type="datetime-local"
              value={newWhen}
              onChange={(e) => setNewWhen(e.target.value)}
              className="h-12 sm:w-56 bg-muted/50 border-border/50 focus-visible:ring-amber-500"
            />
            <Button
              onClick={addReminder}
              className="h-12 px-6 shrink-0 bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25"
            >
              <Plus className="h-5 w-5 mr-1.5" /> Add
            </Button>
          </div>

          <ul className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
            {reminders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center rounded-2xl border border-dashed border-border bg-muted/30">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary text-muted-foreground mb-4">
                  <Bell className="h-6 w-6" />
                </div>
                <p className="text-base font-semibold text-foreground">
                  No reminders yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add one above to get started.
                </p>
              </div>
            )}
            {reminders.map((r) => (
              <li
                key={r.id}
                className={`group flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
                  r.done
                    ? "border-transparent bg-muted/40 opacity-70"
                    : "border-border/50 bg-background/50 hover:bg-muted/50 hover:border-amber-500/30 hover:shadow-md hover:shadow-amber-500/5"
                }`}
              >
                <button
                  onClick={() => toggleDone(r)}
                  className={`shrink-0 transition-transform active:scale-90 ${r.done ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}
                >
                  {r.done ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <span
                    className={`block truncate font-medium text-[15px] ${r.done ? "line-through text-muted-foreground" : "text-foreground"}`}
                  >
                    {r.title}
                  </span>
                  <span className="shrink-0 text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5 block">
                    {new Date(r.remind_at).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <button
                  onClick={() => delReminder(r.id)}
                  className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
