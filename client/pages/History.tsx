import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StorageManager, HistoryItem } from "@/lib/storage";
import { tmdbAPI } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

export default function History() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistoryItems(StorageManager.getHistory());
  }, []);

  const clearHistory = () => {
    StorageManager.clearHistory();
    setHistoryItems([]);
  };

  const removeItem = (id: number, type: "movie" | "tv") => {
    StorageManager.removeFromHistory(id, type);
    setHistoryItems(StorageManager.getHistory());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (historyItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">
          No History Yet
        </h1>
        <p className="text-muted-foreground mb-6">
          Your viewing history will appear here as you watch movies and TV
          shows.
        </p>
        <Link to="/">
          <Button>Discover Content</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Watch History</h1>
          <p className="text-muted-foreground mt-2">
            {historyItems.length} item{historyItems.length !== 1 ? "s" : ""}{" "}
            watched
          </p>
        </div>
        <Button variant="destructive" onClick={clearHistory} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Clear History
        </Button>
      </div>

      <div className="grid gap-4">
        {historyItems.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="flex gap-4 p-4 bg-card rounded-lg border hover:bg-card/80 transition-colors"
          >
            <Link to={`/${item.type}/${item.id}`} className="flex-shrink-0">
              <img
                src={tmdbAPI.getImageURL(item.poster_path, "w200")}
                alt={item.title}
                className="w-20 h-30 object-cover rounded"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/${item.type}/${item.id}`}
                    className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.title}
                  </Link>

                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <Badge variant="outline">
                      {item.type === "movie" ? "Movie" : "TV Show"}
                    </Badge>

                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.vote_average.toFixed(1)}</span>
                    </div>

                    <span>
                      {item.release_date
                        ? new Date(item.release_date).getFullYear()
                        : "N/A"}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Watched {formatDate(item.watchedAt)}</span>
                    </div>
                    {item.progress && item.progress > 0 && (
                      <div className="mt-1">
                        <div className="w-full bg-muted rounded-full h-1">
                          <div
                            className="bg-primary h-1 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-xs">
                          {item.progress}% watched
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id, item.type)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
