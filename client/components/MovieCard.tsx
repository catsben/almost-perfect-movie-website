import { Link } from "react-router-dom";
import { Star, Calendar } from "lucide-react";
import { tmdbAPI, type Movie, type TVShow } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  item: Movie | TVShow;
  type: "movie" | "tv";
  className?: string;
}

export function MovieCard({ item, type, className }: MovieCardProps) {
  const title =
    type === "movie" ? (item as Movie).title : (item as TVShow).name;
  const releaseDate =
    type === "movie"
      ? (item as Movie).release_date
      : (item as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <Link
      to={`/${type}/${item.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-lg bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg",
        className,
      )}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={tmdbAPI.getImageURL(item.poster_path, "w400")}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-sm font-semibold leading-tight mb-1 line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{year}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{item.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
