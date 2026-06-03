import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import Landing from "./routes/index";
import AuthPage from "./routes/auth";
import Dashboard from "./routes/_authenticated/dashboard";
import Diet from "./routes/_authenticated/diet";
import Interactions from "./routes/_authenticated/interactions";
import Medicine from "./routes/_authenticated/medicine";
import Remedies from "./routes/_authenticated/remedies";
import Symptoms from "./routes/_authenticated/symptoms";
import AuthedLayout from "./routes/_authenticated";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected routes */}
        <Route element={<AuthedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/interactions" element={<Interactions />} />
          <Route path="/medicine" element={<Medicine />} />
          <Route path="/remedies" element={<Remedies />} />
          <Route path="/symptoms" element={<Symptoms />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
