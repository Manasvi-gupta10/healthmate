import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/medicine", label: "Medicine Info", icon: Pill },
  { to: "/interactions", label: "Drug Interaction", icon: GitMerge },
  { to: "/symptoms", label: "Symptom Checker", icon: Stethoscope },
  { to: "/remedies", label: "Home Remedies", icon: Leaf },
] as const;

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  
  const onLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <aside className="hidden md:flex md:w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl shadow-lg shadow-black/5">
      <div className="flex items-center gap-3 px-8 py-8 mb-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-blue-500 text-white shadow-md shadow-primary/20">
          <HeartPulse className="h-5 w-5" />
        </div>
        <span className="font-display text-2xl font-bold tracking-tight text-foreground">
          HealthMate
        </span>
      </div>
      
      <nav className="flex-1 space-y-1.5 px-4 overflow-y-auto">
        <p className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3 mt-2">Menu</p>
        {items.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 rounded-r-full" />}
              <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110 text-muted-foreground group-hover:text-primary'}`} />
              {label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto border-t border-border/50 bg-sidebar/50">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl py-6 text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-5 w-5" /> Sign out
        </Button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const location = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 grid grid-cols-5 border-t border-border/40 glass shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
      {items.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`grid h-8 w-8 place-items-center rounded-full transition-all ${isActive ? 'bg-primary/10' : ''}`}>
              <Icon className={`h-4 w-4 ${isActive ? 'scale-110' : ''}`} />
            </div>
            <span className="truncate w-full text-center px-1">{label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
