import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/lib/use-auth";
import { AppSidebar, MobileNav } from "@/components/app-sidebar";
import { Loader2, LogOut, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthedLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
        {/* Mobile Header with Sign out */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-blue-500 text-white shadow-sm">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold">HealthMate</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
