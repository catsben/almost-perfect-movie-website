import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Star, Calendar, Tv2, Heart, Play, Plus } from "lucide-react";
import { useTVShowDetails, useTVShowCredits } from "@/hooks/useTMDb";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CastMember } from "@/components/CastMember";
import { ScrollableRow } from "@/components/ScrollableRow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { tmdbAPI } from "@/lib/tmdb";
import { StorageManager } from "@/lib/storage";

export default function TVDetail() {
  const { id } = useParams<{ id: string }>();
  const tvId = parseInt(id!);

  const { data: tvShow, isLoading: tvLoading } = useTVShowDetails(tvId);
  const { data: credits, isLoading: creditsLoading } = useTVShowCredits(tvId);

  const isInWatchlist = tvId ? StorageManager.isInWatchlist(tvId, "tv") : false;

  useEffect(() => {
    if (tvShow) {
      // Add to history when user visits the detail page
      StorageManager.addToHistory({
        id: tvShow.id,
        type: "tv",
        title: tvShow.name,
        poster_path: tvShow.poster_path,
        release_date: tvShow.first_air_date,
        vote_average: tvShow.vote_average,
      });
    }
  }, [tvShow]);

  const handleWatchlistToggle = () => {
    if (!tvShow) return;

    if (isInWatchlist) {
      StorageManager.removeFromWatchlist(tvShow.id, "tv");
    } else {
      StorageManager.addToWatchlist({
        id: tvShow.id,
        type: "tv",
        title: tvShow.name,
        poster_path: tvShow.poster_path,
        release_date: tvShow.first_air_date,
        vote_average: tvShow.vote_average,
      });
    }
    // Force re-render by updating state
    window.location.reload();
  };

  if (tvLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-96 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground">
          TV Show not found
        </h1>
        <p className="text-muted-foreground mt-2">
          The TV show you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const firstAirYear = tvShow.first_air_date
    ? new Date(tvShow.first_air_date).getFullYear()
    : null;

  return (
    <div className="space-y-8">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={tmdbAPI.getBackdropURL(tvShow.backdrop_path, "w1280")}
            alt={tvShow.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="hidden lg:block">
              <img
                src={tmdbAPI.getImageURL(tvShow.poster_path, "w400")}
                alt={tvShow.name}
                className="w-48 rounded-lg shadow-lg"
              />
            </div>

            <div className="flex-1 text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                {tvShow.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {tvShow.vote_average.toFixed(1)}
                  </span>
                </div>

                {firstAirYear && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-5 w-5" />
                    <span>{firstAirYear}</span>
                  </div>
                )}

                {tvShow.number_of_seasons && (
                  <div className="flex items-center space-x-1">
                    <Tv2 className="h-5 w-5" />
                    <span>
                      {tvShow.number_of_seasons} Season
                      {tvShow.number_of_seasons !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {tvShow.genres?.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Watch Now
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2"
                  onClick={handleWatchlistToggle}
                >
                  {isInWatchlist ? (
                    <>
                      <Heart className="h-5 w-5 fill-current" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Video Player */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Watch {tvShow.name}
            </h2>
            <VideoPlayer
              tmdbId={tvShow.id}
              type="tv"
              season={1}
              episode={1}
              title={tvShow.name}
            />
          </section>

          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {tvShow.overview || "No overview available for this TV show."}
            </p>
          </section>

          {/* Cast */}
          {!creditsLoading && credits?.cast && credits.cast.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Cast</h2>
              <ScrollableRow>
                {credits.cast.slice(0, 20).map((castMember) => (
                  <CastMember key={castMember.id} cast={castMember} />
                ))}
              </ScrollableRow>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mobile Poster */}
          <div className="lg:hidden">
            <img
              src={tmdbAPI.getImageURL(tvShow.poster_path, "w500")}
              alt={tvShow.name}
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
            />
          </div>

          {/* TV Show Details */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Show Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">First Air Date:</span>
                <span className="ml-2 text-foreground">
                  {tvShow.first_air_date
                    ? new Date(tvShow.first_air_date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {tvShow.number_of_seasons && (
                <div>
                  <span className="text-muted-foreground">Seasons:</span>
                  <span className="ml-2 text-foreground">
                    {tvShow.number_of_seasons}
                  </span>
                </div>
              )}

              {tvShow.number_of_episodes && (
                <div>
                  <span className="text-muted-foreground">Episodes:</span>
                  <span className="ml-2 text-foreground">
                    {tvShow.number_of_episodes}
                  </span>
                </div>
              )}

              <div>
                <span className="text-muted-foreground">Rating:</span>
                <span className="ml-2 text-foreground">
                  {tvShow.vote_average.toFixed(1)}/10
                </span>
              </div>

              {tvShow.genres && tvShow.genres.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Genres:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {tvShow.genres.map((genre) => (
                      <Badge
                        key={genre.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
