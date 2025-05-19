
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import Candidates from "./pages/Candidates";
import CandidateDetailsPage from "./pages/CandidateDetailsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { initializeTheme } from "./services/themeService";

const queryClient = new QueryClient();

const App = () => {
  // Inicializar tema al cargar la aplicación
  useEffect(() => {
    initializeTheme();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Redirige la ruta principal a la página de login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/resume-analysis" element={<ResumeAnalysis />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidates/:id" element={<CandidateDetailsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          {/* AÑADIR TODAS LAS RUTAS PERSONALIZADAS ENCIMA DE LA RUTA DE CAPTURA "*" */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
