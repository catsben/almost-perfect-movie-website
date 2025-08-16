import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Placeholder } from "./pages/Placeholder";
import { queryClient } from "./lib/query-client";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="search" element={<Placeholder title="Search" />} />
            <Route path="movies" element={<Placeholder title="Movies" />} />
            <Route path="tv" element={<Placeholder title="TV Shows" />} />
            <Route path="anime" element={<Placeholder title="Anime" />} />
            <Route path="k-drama" element={<Placeholder title="K-Drama" />} />
            <Route path="live-tv" element={<Placeholder title="Live TV" />} />
            <Route path="watchlist" element={<Placeholder title="Watchlist" />} />
            <Route path="history" element={<Placeholder title="History" />} />
            <Route path="movie/:id" element={<Placeholder title="Movie Details" />} />
            <Route path="tv/:id" element={<Placeholder title="TV Show Details" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
