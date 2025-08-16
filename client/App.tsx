import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Placeholder } from "./pages/Placeholder";
import MovieDetail from "./pages/MovieDetail";
import TVDetail from "./pages/TVDetail";
import Search from "./pages/Search";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Anime from "./pages/Anime";
import KDrama from "./pages/KDrama";
import Watchlist from "./pages/Watchlist";
import History from "./pages/History";
import { queryClient } from "./lib/query-client";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="search" element={<Search />} />
          <Route path="movies" element={<Movies />} />
          <Route path="tv" element={<TVShows />} />
          <Route path="anime" element={<Anime />} />
          <Route path="k-drama" element={<KDrama />} />
          <Route path="live-tv" element={<Placeholder title="Live TV" />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="history" element={<History />} />
          <Route path="movie/:id" element={<MovieDetail />} />
          <Route path="tv/:id" element={<TVDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
