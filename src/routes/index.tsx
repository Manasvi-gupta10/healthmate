import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Pill,
  Stethoscope,
  Leaf,
  Salad,
  GitMerge,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  {
    icon: Pill,
    title: "Medicine Info",
    desc: "Uses, side effects, precautions, overdose warnings.",
  },
  {
    icon: GitMerge,
    title: "Drug Interactions",
    desc: "Check whether two medicines are safe together.",
  },
  {
    icon: Stethoscope,
    title: "Symptom Checker",
    desc: "Possible conditions and seriousness from your symptoms.",
  },
  {
    icon: Leaf,
    title: "Home Remedies",
    desc: "Gentle, traditional remedies for everyday issues.",
  },
  {
    icon: Salad,
    title: "Diet Planner",
    desc: "Personal food guidance based on age, weight, condition.",
  },
  {
    icon: Sparkles,
    title: "Smart Dashboard",
    desc: "Quick access, recent searches, tips and reminders.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span className="font-display text-xl">HealthMate</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link to="/auth">
            <Button>Get started</Button>
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" /> AI-powered health
          companion
        </span>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl">
          Calm, clear answers <br /> for everyday health questions.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Look up medicines, check drug interactions, decode symptoms, and get
          gentle remedies & diet plans — all in one friendly place.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/auth">
            <Button size="lg">Start free</Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline">
              See features
            </Button>
          </a>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          *Educational information only — not a substitute for professional
          medical advice.*
        </p>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} HealthMate · Built with care
      </footer>
    </div>
  );
}
