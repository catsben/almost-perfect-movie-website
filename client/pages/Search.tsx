import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MovieCard } from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchMulti } from "@/hooks/useTMDb";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  const debouncedQuery = useDebounce(query, 500);
  const { data: searchResults, isLoading } = useSearchMulti(debouncedQuery);

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
    } else {
      setSearchParams({});
    }
  }, [debouncedQuery, setSearchParams]);

  const filteredResults =
    searchResults?.results?.filter((result: SearchResult) => {
      if (filter === "all") return result.media_type !== "person";
      return result.media_type === filter;
    }) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Search</h1>

        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1 max-w-2xl">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for movies, TV shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <Select
            value={filter}
            onValueChange={(value: "all" | "movie" | "tv") => setFilter(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="tv">TV Shows</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Results */}
      {!debouncedQuery ? (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Start searching
          </h2>
          <p className="text-muted-foreground">
            Enter a movie or TV show title to begin searching
          </p>
        </div>
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No results found
          </h2>
          <p className="text-muted-foreground">
            Try different keywords or check your spelling
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Found {filteredResults.length} result
              {filteredResults.length !== 1 ? "s" : ""} for "{debouncedQuery}"
            </p>
            <Badge variant="secondary">
              {filter === "all"
                ? "All Results"
                : filter === "movie"
                  ? "Movies"
                  : "TV Shows"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredResults.map((result: SearchResult) => {
              const item = {
                id: result.id,
                title: result.title || result.name || "",
                name: result.title || result.name || "",
                poster_path: result.poster_path,
                backdrop_path: result.backdrop_path,
                release_date:
                  result.release_date || result.first_air_date || "",
                first_air_date:
                  result.release_date || result.first_air_date || "",
                vote_average: result.vote_average,
                overview: result.overview,
                genre_ids: result.genre_ids,
              };

              return (
                <MovieCard
                  key={`${result.media_type}-${result.id}`}
                  item={item}
                  type={result.media_type as "movie" | "tv"}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
