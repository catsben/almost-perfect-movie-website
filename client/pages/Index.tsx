import { Section } from "@/components/Section";
import { ScrollableRow } from "@/components/ScrollableRow";
import { MovieCard } from "@/components/MovieCard";
import {
  useTrendingMovies,
  useTrendingTVShows,
  usePopularMovies,
  usePopularTVShows,
} from "@/hooks/useTMDb";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingSkeleton() {
  return (
    <div className="flex space-x-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="min-w-[200px]">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const { data: trendingMovies, isLoading: loadingTrendingMovies } =
    useTrendingMovies();
  const { data: trendingTV, isLoading: loadingTrendingTV } =
    useTrendingTVShows();
  const { data: popularMovies, isLoading: loadingPopularMovies } =
    usePopularMovies();
  const { data: popularTV, isLoading: loadingPopularTV } = usePopularTVShows();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative mb-12">
        <div className="text-center py-12 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            StreamFlix
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover and stream your favorite movies and TV shows
          </p>
        </div>
      </div>

      {/* Trending Movies */}
      <Section title="Trending Movies" viewAllLink="/movies">
        {loadingTrendingMovies ? (
          <LoadingSkeleton />
        ) : (
          <ScrollableRow>
            {trendingMovies?.results?.map((movie: any) => (
              <div key={movie.id} className="min-w-[200px]">
                <MovieCard item={movie} type="movie" />
              </div>
            ))}
          </ScrollableRow>
        )}
      </Section>

      {/* Trending TV Shows */}
      <Section title="Trending TV Shows" viewAllLink="/tv">
        {loadingTrendingTV ? (
          <LoadingSkeleton />
        ) : (
          <ScrollableRow>
            {trendingTV?.results?.map((show: any) => (
              <div key={show.id} className="min-w-[200px]">
                <MovieCard item={show} type="tv" />
              </div>
            ))}
          </ScrollableRow>
        )}
      </Section>

      {/* Popular Movies */}
      <Section title="Popular Movies" viewAllLink="/movies">
        {loadingPopularMovies ? (
          <LoadingSkeleton />
        ) : (
          <ScrollableRow>
            {popularMovies?.results?.map((movie: any) => (
              <div key={movie.id} className="min-w-[200px]">
                <MovieCard item={movie} type="movie" />
              </div>
            ))}
          </ScrollableRow>
        )}
      </Section>

      {/* Popular TV Shows */}
      <Section title="Popular TV Shows" viewAllLink="/tv">
        {loadingPopularTV ? (
          <LoadingSkeleton />
        ) : (
          <ScrollableRow>
            {popularTV?.results?.map((show: any) => (
              <div key={show.id} className="min-w-[200px]">
                <MovieCard item={show} type="tv" />
              </div>
            ))}
          </ScrollableRow>
        )}
      </Section>
    </div>
  );
}
