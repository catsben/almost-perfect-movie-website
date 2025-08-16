import { useState } from "react";

interface VideoPlayerProps {
  tmdbId: number;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  title: string;
}

const VIDEO_SOURCES = [
  {
    name: "VidSrc",
    getUrl: (
      tmdbId: number,
      type: "movie" | "tv",
      season?: number,
      episode?: number,
    ) => {
      if (type === "movie") {
        return `https://vidsrc.to/embed/movie/${tmdbId}`;
      } else if (type === "tv" && season && episode) {
        return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
      } else {
        return `https://vidsrc.to/embed/tv/${tmdbId}`;
      }
    },
  },
  {
    name: "VidSrc CC",
    getUrl: (
      tmdbId: number,
      type: "movie" | "tv",
      season?: number,
      episode?: number,
    ) => {
      if (type === "movie") {
        return `https://vidsrc.cc/v2/embed/movie/${tmdbId}?autoPlay=true`;
      } else if (type === "tv" && season && episode) {
        return `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=true`;
      } else {
        return `https://vidsrc.cc/v2/embed/tv/${tmdbId}?autoPlay=true`;
      }
    },
  },
  {
    name: "VidSrc Co",
    getUrl: (
      tmdbId: number,
      type: "movie" | "tv",
      season?: number,
      episode?: number,
    ) => {
      if (type === "movie") {
        return `https://player.vidsrc.co/embed/movie/${tmdbId}?server=1`;
      } else if (type === "tv" && season && episode) {
        return `https://player.vidsrc.co/embed/tv/${tmdbId}/${season}/${episode}?server=1`;
      } else {
        return `https://player.vidsrc.co/embed/tv/${tmdbId}?server=1`;
      }
    },
  },
  {
    name: "RG Shows",
    getUrl: (
      tmdbId: number,
      type: "movie" | "tv",
      season?: number,
      episode?: number,
    ) => {
      if (type === "movie") {
        return `https://embed.rgshows.me/movie/${tmdbId}`;
      } else if (type === "tv" && season && episode) {
        return `https://embed.rgshows.me/tv/${tmdbId}/${season}/${episode}`;
      } else {
        return `https://embed.rgshows.me/tv/${tmdbId}`;
      }
    },
  },
];

export function VideoPlayerSimple({
  tmdbId,
  type,
  season,
  episode,
  title,
}: VideoPlayerProps) {
  const [currentSource, setCurrentSource] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentSourceData = VIDEO_SOURCES[currentSource];
  const embedUrl = currentSourceData.getUrl(tmdbId, type, season, episode);

  const switchSource = (sourceIndex: number) => {
    setCurrentSource(sourceIndex);
    setIsLoading(true);
  };

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {/* Source Selection */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2">
          <div className="flex gap-2">
            {VIDEO_SOURCES.map((source, index) => (
              <button
                key={source.name}
                onClick={() => switchSource(index)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  currentSource === index
                    ? "bg-white text-black"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="aspect-video relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-white text-center">
              <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Loading {currentSourceData.name}...</p>
            </div>
          </div>
        )}

        <iframe
          src={embedUrl}
          title={`Watch ${title} - ${currentSourceData.name}`}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Simple controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-white text-sm bg-black/70 backdrop-blur-sm rounded p-3 opacity-0 hover:opacity-100 transition-opacity">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">{title}</span>
            <div className="text-xs text-white/80 mt-1">
              Source: {currentSourceData.name}
            </div>
          </div>
          <div className="flex space-x-3 text-xs">
            <span>Quality: Auto</span>
            <span>•</span>
            <span>Fullscreen: F</span>
            <span>•</span>
            <span>Play/Pause: Space</span>
          </div>
        </div>
      </div>
    </div>
  );
}
