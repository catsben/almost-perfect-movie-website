import { tmdbAPI, type Cast } from "@/lib/tmdb";

interface CastMemberProps {
  cast: Cast;
}

export function CastMember({ cast }: CastMemberProps) {
  return (
    <div className="min-w-[120px] text-center">
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted mb-2">
        <img
          src={tmdbAPI.getImageURL(cast.profile_path, "w200")}
          alt={cast.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="text-sm">
        <p className="font-medium text-foreground line-clamp-2">{cast.name}</p>
        <p className="text-muted-foreground text-xs line-clamp-2 mt-1">
          {cast.character}
        </p>
      </div>
    </div>
  );
}
