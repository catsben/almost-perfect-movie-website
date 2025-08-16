import { useState, useEffect } from "react";
import { Gamepad2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { tmdbAPI } from "@/lib/tmdb";

type AnimeCategory = "popular" | "top_rated";

export default function Anime() {
  const [selectedCategory, setSelectedCategory] =
    useState<AnimeCategory>("popular");
  const [page, setPage] = useState(1);

  // Discover anime by filtering for Japanese content with animation genre
  const { data, isLoading, error } = useQuery({
    queryKey: ["anime", selectedCategory, page],
    queryFn: async () => {
      // Animation genre ID is 16 for both movies and TV shows
      const params = {
        with_genres: "16",
        with_origin_country: "JP",
        sort_by:
          selectedCategory === "popular"
            ? "popularity.desc"
            : "vote_average.desc",
        page,
      };

      // Get both movies and TV shows
      const [movies, tvShows] = await Promise.all([
        tmdbAPI.discoverMovies(params),
        tmdbAPI.discoverTVShows(params),
      ]);

      // Combine and sort results
      const combinedResults = [
        ...movies.results.map((item: any) => ({
          ...item,
          media_type: "movie",
        })),
        ...tvShows.results.map((item: any) => ({
          ...item,
          media_type: "tv",
          title: item.name,
        })),
      ];

      // Sort by popularity or rating
      combinedResults.sort((a, b) => {
        if (selectedCategory === "popular") {
          return b.popularity - a.popularity;
        } else {
          return b.vote_average - a.vote_average;
        }
      });

      return {
        results: combinedResults,
        total_results: movies.total_results + tvShows.total_results,
        total_pages: Math.max(movies.total_pages, tvShows.total_pages),
      };
    },
  });

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
        </div>
      ))}
    </div>
  );

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const changeCategory = (category: AnimeCategory) => {
    setSelectedCategory(category);
    setPage(1);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <Gamepad2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Error loading anime
        </h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Anime</h1>
          <p className="text-muted-foreground mt-1">
            Discover Japanese animation movies and series
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Category:</span>
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value: AnimeCategory) => changeCategory(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular Anime</SelectItem>
              <SelectItem value="top_rated">Top Rated Anime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          {selectedCategory === "popular" ? "Popular Anime" : "Top Rated Anime"}
        </Badge>
        {data?.total_results && (
          <p className="text-sm text-muted-foreground">
            Showing {data.results?.length || 0} of {data.total_results} anime
          </p>
        )}
      </div>

      {/* Anime Grid */}
      {isLoading && page === 1 ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {data?.results?.map((item: any) => (
              <MovieCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                type={item.media_type === "movie" ? "movie" : "tv"}
              />
            ))}
          </div>

          {/* Load More */}
          {data?.total_pages && page < data.total_pages && (
            <div className="text-center">
              <Button onClick={loadMore} disabled={isLoading} size="lg">
                {isLoading ? "Loading..." : "Load More Anime"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
