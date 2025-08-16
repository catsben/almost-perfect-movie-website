interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title: string;
}

export function VideoPlayer({ tmdbId, type, season, episode, title }: VideoPlayerProps) {
  // Construct VidSrc URL based on type
  let embedUrl = '';
  
  if (type === 'movie') {
    embedUrl = `https://vidsrc.to/embed/movie/${tmdbId}`;
  } else if (type === 'tv' && season && episode) {
    embedUrl = `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
  } else {
    embedUrl = `https://vidsrc.to/embed/tv/${tmdbId}`;
  }

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
