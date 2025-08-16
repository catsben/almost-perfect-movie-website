import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Star, Calendar, Clock, Heart, Play, Plus } from 'lucide-react';
import { useMovieDetails, useMovieCredits } from '@/hooks/useTMDb';
import { VideoPlayerSimple as VideoPlayer } from '@/components/VideoPlayerSimple';
import { CastMember } from '@/components/CastMember';
import { ScrollableRow } from '@/components/ScrollableRow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { tmdbAPI } from '@/lib/tmdb';
import { StorageManager } from '@/lib/storage';
import { cn } from '@/lib/utils';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id!);
  
  const { data: movie, isLoading: movieLoading } = useMovieDetails(movieId);
  const { data: credits, isLoading: creditsLoading } = useMovieCredits(movieId);
  
  const isInWatchlist = movieId ? StorageManager.isInWatchlist(movieId, 'movie') : false;

  useEffect(() => {
    if (movie) {
      // Add to history when user visits the detail page
      StorageManager.addToHistory({
        id: movie.id,
        type: 'movie',
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      });
    }
  }, [movie]);

  const handleWatchlistToggle = () => {
    if (!movie) return;
    
    if (isInWatchlist) {
      StorageManager.removeFromWatchlist(movie.id, 'movie');
    } else {
      StorageManager.addToWatchlist({
        id: movie.id,
        type: 'movie',
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      });
    }
    // Force re-render by updating state
    window.location.reload();
  };

  if (movieLoading) {
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

  if (!movie) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground">Movie not found</h1>
        <p className="text-muted-foreground mt-2">
          The movie you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  return (
    <div className="space-y-8">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={tmdbAPI.getBackdropURL(movie.backdrop_path, 'w1280')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="hidden lg:block">
              <img
                src={tmdbAPI.getImageURL(movie.poster_path, 'w400')}
                alt={movie.title}
                className="w-48 rounded-lg shadow-lg"
              />
            </div>
            
            <div className="flex-1 text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-lg text-white/80 mb-4 italic">{movie.tagline}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                </div>
                
                {releaseYear && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-5 w-5" />
                    <span>{releaseYear}</span>
                  </div>
                )}
                
                {runtime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-5 w-5" />
                    <span>{runtime}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre) => (
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Watch {movie.title}</h2>
            <VideoPlayer
              tmdbId={movie.id}
              type="movie"
              title={movie.title}
            />
          </section>

          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {movie.overview || 'No overview available for this movie.'}
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
              src={tmdbAPI.getImageURL(movie.poster_path, 'w500')}
              alt={movie.title}
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Movie Details */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Movie Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Release Date:</span>
                <span className="ml-2 text-foreground">
                  {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              
              {runtime && (
                <div>
                  <span className="text-muted-foreground">Runtime:</span>
                  <span className="ml-2 text-foreground">{runtime}</span>
                </div>
              )}
              
              <div>
                <span className="text-muted-foreground">Rating:</span>
                <span className="ml-2 text-foreground">{movie.vote_average.toFixed(1)}/10</span>
              </div>
              
              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Genres:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="outline" className="text-xs">
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
