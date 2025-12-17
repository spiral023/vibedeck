import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CommandPalette, useCommandPalette } from "@/components/CommandPalette";
import { HomePage } from "@/pages/HomePage";
import { PromptLibrary } from "@/pages/PromptLibrary";
import { PromptDetail } from "@/pages/PromptDetail";
import { WorkflowsPage, WorkflowDetailPage } from "@/pages/WorkflowsPage";
import { UILibrariesPage } from "@/pages/UILibrariesPage";
import { ToolDirectoryPage } from "@/pages/ToolDirectoryPage";
import { RulesGeneratorPage } from "@/pages/RulesGeneratorPage";
import { HistoryPage, SettingsPage } from "@/pages/HistorySettingsPages";
import { PromptBuilderPage } from "@/pages/PromptBuilderPage";
import { PromptFactoryPage } from "@/pages/PromptFactoryPage";
import { HelpLibraryPage, HelpTemplateDetailPage } from "@/pages/HelpLibraryPage";
import { KnowledgePage } from "@/pages/KnowledgePage";
import { HostingPage } from "@/pages/HostingPage";
import { SuperpowersPage } from "@/pages/SuperpowersPage";
import { IdeaLabPage } from "@/pages/IdeaLabPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { open, setOpen } = useCommandPalette();

  return (
    <>
      <CommandPalette open={open} onOpenChange={setOpen} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/prompt-builder" element={<PromptBuilderPage />} />
          <Route path="/prompt-factory" element={<PromptFactoryPage />} />
          <Route path="/prompt-library" element={<PromptLibrary />} />
          <Route path="/prompt-library/:id" element={<PromptDetail />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/workflows/:id" element={<WorkflowDetailPage />} />
          <Route path="/ui-libraries" element={<UILibrariesPage />} />
          <Route path="/tool-directory" element={<ToolDirectoryPage />} />
          <Route path="/rules-generator" element={<RulesGeneratorPage />} />
          <Route path="/help-library" element={<HelpLibraryPage />} />
          <Route path="/help-library/:id" element={<HelpTemplateDetailPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/hosting" element={<HostingPage />} />
          <Route path="/superpowers" element={<SuperpowersPage />} />
          <Route path="/idea-lab" element={<IdeaLabPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
