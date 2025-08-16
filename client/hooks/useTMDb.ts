import { useQuery } from "@tanstack/react-query";
import { tmdbAPI } from "@/lib/tmdb";

export function useTrendingMovies(timeWindow: "day" | "week" = "week") {
  return useQuery({
    queryKey: ["trending", "movies", timeWindow],
    queryFn: () => tmdbAPI.getTrendingMovies(timeWindow),
  });
}

export function useTrendingTVShows(timeWindow: "day" | "week" = "week") {
  return useQuery({
    queryKey: ["trending", "tv", timeWindow],
    queryFn: () => tmdbAPI.getTrendingTVShows(timeWindow),
  });
}

export function usePopularMovies(page = 1) {
  return useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => tmdbAPI.getPopularMovies(page),
  });
}

export function usePopularTVShows(page = 1) {
  return useQuery({
    queryKey: ["tv", "popular", page],
    queryFn: () => tmdbAPI.getPopularTVShows(page),
  });
}

export function useTopRatedMovies(page = 1) {
  return useQuery({
    queryKey: ["movies", "top-rated", page],
    queryFn: () => tmdbAPI.getTopRatedMovies(page),
  });
}

export function useTopRatedTVShows(page = 1) {
  return useQuery({
    queryKey: ["tv", "top-rated", page],
    queryFn: () => tmdbAPI.getTopRatedTVShows(page),
  });
}

export function useUpcomingMovies(page = 1) {
  return useQuery({
    queryKey: ["movies", "upcoming", page],
    queryFn: () => tmdbAPI.getUpcomingMovies(page),
  });
}

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => tmdbAPI.getMovieDetails(movieId),
    enabled: !!movieId,
  });
}

export function useTVShowDetails(tvId: number) {
  return useQuery({
    queryKey: ["tv", tvId],
    queryFn: () => tmdbAPI.getTVShowDetails(tvId),
    enabled: !!tvId,
  });
}

export function useMovieCredits(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId, "credits"],
    queryFn: () => tmdbAPI.getMovieCredits(movieId),
    enabled: !!movieId,
  });
}

export function useMovieExternalIds(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId, "external_ids"],
    queryFn: () => tmdbAPI.getMovieExternalIds(movieId),
    enabled: !!movieId,
  });
}

export function useTVShowCredits(tvId: number) {
  return useQuery({
    queryKey: ["tv", tvId, "credits"],
    queryFn: () => tmdbAPI.getTVShowCredits(tvId),
    enabled: !!tvId,
  });
}

export function useTVShowExternalIds(tvId: number) {
  return useQuery({
    queryKey: ["tv", tvId, "external_ids"],
    queryFn: () => tmdbAPI.getTVShowExternalIds(tvId),
    enabled: !!tvId,
  });
}

export function useSearchMulti(query: string, page = 1) {
  return useQuery({
    queryKey: ["search", "multi", query, page],
    queryFn: () => tmdbAPI.searchMulti(query, page),
    enabled: !!query.trim(),
  });
}

export function useMovieGenres() {
  return useQuery({
    queryKey: ["genres", "movies"],
    queryFn: () => tmdbAPI.getMovieGenres(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useTVGenres() {
  return useQuery({
    queryKey: ["genres", "tv"],
    queryFn: () => tmdbAPI.getTVGenres(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
