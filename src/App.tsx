import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/HomePage";
import { PromptLibrary } from "@/pages/PromptLibrary";
import { PromptDetail } from "@/pages/PromptDetail";
import { WorkflowsPage } from "@/pages/WorkflowsPage";
import { UILibrariesPage } from "@/pages/UILibrariesPage";
import { ToolDirectoryPage } from "@/pages/ToolDirectoryPage";
import { ScaffoldPage } from "@/components/ScaffoldPage";
import NotFound from "./pages/NotFound";
import {
  Wrench,
  Factory,
  BookOpen,
  Server,
  Zap,
  Lightbulb,
  Sparkles,
  History,
  Settings,
} from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/prompt-builder"
              element={
                <ScaffoldPage
                  title="Prompt Builder"
                  description="Erstelle individuelle Prompts mit Variablen und Vorlagen."
                  icon={Wrench}
                />
              }
            />
            <Route
              path="/prompt-factory"
              element={
                <ScaffoldPage
                  title="Prompt Factory"
                  description="Generiere Prompts automatisch basierend auf deinen Anforderungen."
                  icon={Factory}
                />
              }
            />
            <Route path="/prompt-library" element={<PromptLibrary />} />
            <Route path="/prompt-library/:id" element={<PromptDetail />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/workflows/:id" element={<WorkflowsPage />} />
            <Route path="/ui-libraries" element={<UILibrariesPage />} />
            <Route path="/tool-directory" element={<ToolDirectoryPage />} />
            <Route
              path="/knowledge"
              element={
                <ScaffoldPage
                  title="Wissensbasis"
                  description="Dokumentation und Best Practices für AI-gestützte Entwicklung."
                  icon={BookOpen}
                />
              }
            />
            <Route
              path="/hosting"
              element={
                <ScaffoldPage
                  title="Hosting"
                  description="Vergleiche und Empfehlungen für Hosting-Plattformen."
                  icon={Server}
                />
              }
            />
            <Route
              path="/superpowers"
              element={
                <ScaffoldPage
                  title="Superpowers"
                  description="Erweiterte Techniken und Tipps für Power-User."
                  icon={Zap}
                />
              }
            />
            <Route
              path="/idea-lab"
              element={
                <ScaffoldPage
                  title="Ideen Lab"
                  description="Experimentiere mit neuen Ideen und Konzepten."
                  icon={Lightbulb}
                />
              }
            />
            <Route
              path="/rules-generator"
              element={
                <ScaffoldPage
                  title="Rules Generator"
                  description="Erstelle maßgeschneiderte Regeln für AI-Agenten."
                  icon={Sparkles}
                />
              }
            />
            <Route
              path="/history"
              element={
                <ScaffoldPage
                  title="Verlauf"
                  description="Deine kürzlich verwendeten Prompts und Workflows."
                  icon={History}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <ScaffoldPage
                  title="Einstellungen"
                  description="Konfiguriere VibeDeck nach deinen Vorlieben."
                  icon={Settings}
                />
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
