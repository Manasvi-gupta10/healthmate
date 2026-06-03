import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartPulse } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden selection:bg-primary/20">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-400/10 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      {/* Navbar */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-blue-500 text-white shadow-lg shadow-primary/20">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">HealthMate</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 py-12 md:py-24">
        <div className="max-w-4xl mx-auto animate-in zoom-in-95 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm mb-8 hover:bg-primary/10 transition-colors cursor-default">
            <HeartPulse className="h-4 w-4" /> 
            <span>Welcome to HealthMate</span>
          </div>
          
          <h1 className="font-display text-5xl sm:text-7xl font-bold leading-[1.1] text-foreground tracking-tight">
            Smart Healthcare <br className="hidden sm:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Assistant
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Check medicines, analyze symptoms, explore remedies, and manage your health easily.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="h-14 px-8 rounded-full text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur-md py-8 text-center text-sm font-medium text-muted-foreground relative z-10 mt-auto">
        <p className="flex items-center justify-center gap-1.5">
          © {new Date().getFullYear()} HealthMate <span className="text-border mx-2">|</span> Built for your health
        </p>
      </footer>
    </div>
  );
}
