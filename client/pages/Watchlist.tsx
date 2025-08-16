import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StorageManager, WatchlistItem } from "@/lib/storage";
import { tmdbAPI } from "@/lib/tmdb";

export default function Watchlist() {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setWatchlistItems(StorageManager.getWatchlist());
  }, []);

  const clearWatchlist = () => {
    StorageManager.clearWatchlist();
    setWatchlistItems([]);
  };

  const removeItem = (id: number, type: "movie" | "tv") => {
    StorageManager.removeFromWatchlist(id, type);
    setWatchlistItems(StorageManager.getWatchlist());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (watchlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Watchlist is Empty
        </h1>
        <p className="text-muted-foreground mb-6">
          Add movies and TV shows to your watchlist to keep track of what you
          want to watch.
        </p>
        <Link to="/">
          <Button>Browse Content</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Watchlist</h1>
          <p className="text-muted-foreground mt-2">
            {watchlistItems.length} item{watchlistItems.length !== 1 ? "s" : ""}{" "}
            saved
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={clearWatchlist}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear Watchlist
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {watchlistItems.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="group relative bg-card rounded-lg overflow-hidden border hover:border-primary/50 transition-colors"
          >
            <Link to={`/${item.type}/${item.id}`} className="block">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={tmdbAPI.getImageURL(item.poster_path, "w400")}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link
                to={`/${item.type}/${item.id}`}
                className="block text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2"
              >
                {item.title}
              </Link>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <Badge variant="outline" className="text-xs">
                  {item.type === "movie" ? "Movie" : "TV Show"}
                </Badge>

                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{item.vote_average.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {item.release_date
                      ? new Date(item.release_date).getFullYear()
                      : "N/A"}
                  </span>
                </div>

                <span>Added {formatDate(item.addedAt)}</span>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeItem(item.id, item.type)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
