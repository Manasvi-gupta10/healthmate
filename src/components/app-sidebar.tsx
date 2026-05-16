import { Link, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Pill,
  GitMerge,
  Stethoscope,
  Leaf,
  Salad,
  LogOut,
  HeartPulse,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/medicine", label: "Medicine Info", icon: Pill },
  { to: "/interactions", label: "Drug Interaction", icon: GitMerge },
  { to: "/symptoms", label: "Symptom Checker", icon: Stethoscope },
  { to: "/remedies", label: "Home Remedies", icon: Leaf },
  { to: "/diet", label: "Diet Planner", icon: Salad },
] as const;

export function AppSidebar() {
  const router = useRouter();
  const onLogout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };
  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
          <HeartPulse className="h-5 w-5" />
        </div>
        <span className="font-display text-xl text-sidebar-foreground">
          HealthMate
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className:
                "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
            }}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-6 border-t border-border bg-card">
      {items.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-col items-center gap-0.5 py-2 text-[10px] text-muted-foreground"
          activeProps={{ className: "text-primary" }}
        >
          <Icon className="h-4 w-4" />
          {label.split(" ")[0]}
        </Link>
      ))}
    </nav>
  );
}
