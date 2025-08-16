interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title: string;
}

const VIDEO_SOURCES = [
  {
    name: 'VidSrc',
    getUrl: (tmdbId: number, type: 'movie' | 'tv', season?: number, episode?: number) => {
      if (type === 'movie') {
        return `https://vidsrc.to/embed/movie/${tmdbId}`;
      } else if (type === 'tv' && season && episode) {
        return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
      } else {
        return `https://vidsrc.to/embed/tv/${tmdbId}`;
      }
    }
  },
  {
    name: 'Movie4K',
    getUrl: (tmdbId: number, type: 'movie' | 'tv', season?: number, episode?: number) => {
      if (type === 'movie') {
        return `https://movie4k.to/embed/movie/${tmdbId}`;
      } else if (type === 'tv' && season && episode) {
        return `https://movie4k.to/embed/tv/${tmdbId}/${season}/${episode}`;
      } else {
        return `https://movie4k.to/embed/tv/${tmdbId}`;
      }
    }
  },
  {
    name: 'VidSrc Pro',
    getUrl: (tmdbId: number, type: 'movie' | 'tv', season?: number, episode?: number) => {
      if (type === 'movie') {
        return `https://vidsrc.pro/embed/movie/${tmdbId}`;
      } else if (type === 'tv' && season && episode) {
        return `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}`;
      } else {
        return `https://vidsrc.pro/embed/tv/${tmdbId}`;
      }
    }
  }
];

export function VideoPlayer({ tmdbId, type, season, episode, title }: VideoPlayerProps) {
  const [currentSource, setCurrentSource] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentSourceData = VIDEO_SOURCES[currentSource];
  const embedUrl = currentSourceData.getUrl(tmdbId, type, season, episode);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          title={`Watch ${title}`}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        />
      </div>
      
      {/* Player controls overlay information */}
      <div className="absolute bottom-4 left-4 right-4 text-white text-sm bg-black/50 rounded p-2 opacity-0 hover:opacity-100 transition-opacity">
        <div className="flex justify-between items-center">
          <span className="font-medium">{title}</span>
          <div className="flex space-x-2 text-xs">
            <span>Quality: Auto</span>
            <span>•</span>
            <span>Subtitles: Available</span>
            <span>•</span>
            <span>Fullscreen: F</span>
          </div>
        </div>
      </div>
    </div>
  );
}
