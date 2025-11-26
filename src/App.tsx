import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import HowItWorksPage from "./pages/HowItWorksPage";
import AddCow from "./pages/AddCow";
import Portfolio from "./pages/Portfolio";
import FarmerDashboard from "./pages/FarmerDashboard";
import AssetDetail from "./pages/AssetDetail";
import NotFound from "./pages/NotFound";

/**
 * App.tsx - The root component of our application
 *
 * COMPONENT TREE:
 * QueryClientProvider → For data fetching (React Query)
 *   └── AppProvider → Our custom context (assets, investments)
 *         └── TooltipProvider → UI tooltips
 *               └── BrowserRouter → URL routing
 *                     └── Routes → Page components
 *
 * WHY THIS ORDER?
 * - Providers wrap the entire app so all children can access their data
 * - AppProvider is inside QueryClient so it could use React Query if needed
 * - BrowserRouter is near the bottom so routes can access all providers above
 */

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/asset/:id" element={<AssetDetail />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/add-cow" element={<AddCow />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/farmer" element={<FarmerDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
