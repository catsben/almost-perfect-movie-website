import { useState } from "react";
import { Tv, Filter } from "lucide-react";
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
import { usePopularTVShows, useTopRatedTVShows } from "@/hooks/useTMDb";

type TVCategory = "popular" | "top_rated";

const CATEGORIES = {
  popular: { label: "Popular TV Shows", hook: usePopularTVShows },
  top_rated: { label: "Top Rated TV Shows", hook: useTopRatedTVShows },
};

export default function TVShows() {
  const [selectedCategory, setSelectedCategory] =
    useState<TVCategory>("popular");
  const [page, setPage] = useState(1);

  const currentCategory = CATEGORIES[selectedCategory];
  const { data, isLoading, error } = currentCategory.hook(page);

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

  const changeCategory = (category: TVCategory) => {
    setSelectedCategory(category);
    setPage(1);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <Tv className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Error loading TV shows
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
          <h1 className="text-3xl font-bold text-foreground">TV Shows</h1>
          <p className="text-muted-foreground mt-1">
            Explore popular and top-rated TV series
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Category:</span>
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value: TVCategory) => changeCategory(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="top_rated">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary">{currentCategory.label}</Badge>
        {data?.total_results && (
          <p className="text-sm text-muted-foreground">
            Showing {data.results?.length || 0} of {data.total_results} TV shows
          </p>
        )}
      </div>

      {/* TV Shows Grid */}
      {isLoading && page === 1 ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {data?.results?.map((show: any) => (
              <MovieCard key={show.id} item={show} type="tv" />
            ))}
          </div>

          {/* Load More */}
          {data?.total_pages && page < data.total_pages && (
            <div className="text-center">
              <Button onClick={loadMore} disabled={isLoading} size="lg">
                {isLoading ? "Loading..." : "Load More TV Shows"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
