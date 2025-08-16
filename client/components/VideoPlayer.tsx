import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Subtitles,
  Monitor,
  Cast,
  RotateCcw,
  Minimize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tmdbAPI } from '@/lib/tmdb';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';

interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title: string;
}

interface VideoSource {
  name: string;
  requiresImdb?: boolean;
  getUrl: (tmdbId: number, imdbId: string | null, type: 'movie' | 'tv', season?: number, episode?: number) => string;
}

const VIDEO_SOURCES: VideoSource[] = [
  {
    name: 'VidSrc',
    getUrl: (tmdbId, imdbId, type, season, episode) => {
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
    name: 'VidSrc CC',
    getUrl: (tmdbId, imdbId, type, season, episode) => {
      if (type === 'movie') {
        return `https://vidsrc.cc/v2/embed/movie/${tmdbId}?autoPlay=true`;
      } else if (type === 'tv' && season && episode) {
        return `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=true`;
      } else {
        return `https://vidsrc.cc/v2/embed/tv/${tmdbId}?autoPlay=true`;
      }
    }
  },
  {
    name: 'VidSrc Co',
    getUrl: (tmdbId, imdbId, type, season, episode) => {
      if (type === 'movie') {
        return `https://player.vidsrc.co/embed/movie/${tmdbId}?server=1`;
      } else if (type === 'tv' && season && episode) {
        return `https://player.vidsrc.co/embed/tv/${tmdbId}/${season}/${episode}?server=1`;
      } else {
        return `https://player.vidsrc.co/embed/tv/${tmdbId}?server=1`;
      }
    }
  },
  {
    name: 'MKV Embed',
    requiresImdb: true,
    getUrl: (tmdbId, imdbId, type, season, episode) => {
      if (!imdbId) return '';
      if (type === 'movie') {
        return `https://mkvembed.com/embed/movie?imdb=${imdbId}`;
      } else if (type === 'tv' && season && episode) {
        return `https://mkvembed.com/embed/tv?imdb=${imdbId}&s=${season}&e=${episode}`;
      } else {
        return `https://mkvembed.com/embed/tv?imdb=${imdbId}`;
      }
    }
  },
  {
    name: 'VidSrc Online',
    requiresImdb: true,
    getUrl: (tmdbId, imdbId, type, season, episode) => {
      if (!imdbId) return '';
      if (type === 'movie') {
        return `https://vidsrc.online/embed/movie?imdb=${imdbId}`;
      } else if (type === 'tv' && season && episode) {
        return `https://vidsrc.online/embed/tv?imdb=${imdbId}&s=${season}&e=${episode}`;
      } else {
        return `https://vidsrc.online/embed/tv?imdb=${imdbId}`;
      }
    }
  },
  {
    name: 'RG Shows',
    getUrl: (tmdbId, imdbId, type, season, episode) => {
      if (type === 'movie') {
        return `https://embed.rgshows.me/movie/${tmdbId}`;
      } else if (type === 'tv' && season && episode) {
        return `https://embed.rgshows.me/tv/${tmdbId}/${season}/${episode}`;
      } else {
        return `https://embed.rgshows.me/tv/${tmdbId}`;
      }
    }
  },
  {
    name: 'Auto Embed',
    requiresImdb: true,
    getUrl: (tmdbId, imdbId, type, season, episode) => {
      if (!imdbId) return '';
      if (type === 'movie') {
        return `https://autoembed.online/embed/movie/${imdbId}`;
      } else if (type === 'tv' && season && episode) {
        return `https://autoembed.online/embed/tv/${imdbId}/${season}/${episode}`;
      } else {
        return `https://autoembed.online/embed/tv/${imdbId}`;
      }
    }
  }
];

const QUALITY_OPTIONS = ['Auto', '360p', '720p', '1080p'];
const SPEED_OPTIONS = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'];

export function VideoPlayer({ tmdbId, type, season, episode, title }: VideoPlayerProps) {
  const [currentSource, setCurrentSource] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState('Auto');
  const [speed, setSpeed] = useState('1x');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imdbId, setImdbId] = useState<string | null>(null);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Keyboard controls
  useKeyboardControls({
    onTogglePlay: togglePlay,
    onToggleMute: toggleMute,
    onToggleFullscreen: toggleFullscreen,
    onVolumeUp: () => handleVolumeChange([Math.min(100, volume[0] + 10)]),
    onVolumeDown: () => handleVolumeChange([Math.max(0, volume[0] - 10)]),
    onSeekForward: () => console.log('Seek forward 10s'),
    onSeekBackward: () => console.log('Seek backward 10s'),
    isEnabled: true
  });

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fetch IMDB ID for sources that require it
  useEffect(() => {
    const fetchImdbId = async () => {
      try {
        const externalIds = type === 'movie' 
          ? await tmdbAPI.getMovieExternalIds(tmdbId)
          : await tmdbAPI.getTVShowExternalIds(tmdbId);
        
        if (externalIds?.imdb_id) {
          setImdbId(externalIds.imdb_id);
        }
      } catch (error) {
        console.error('Failed to fetch IMDB ID:', error);
      }
    };

    fetchImdbId();
  }, [tmdbId, type]);

  // Get available sources (filter out IMDB-required sources if no IMDB ID)
  const availableSources = VIDEO_SOURCES.filter(source => 
    !source.requiresImdb || (source.requiresImdb && imdbId)
  );

  const currentSourceData = availableSources[currentSource] || availableSources[0];
  const embedUrl = currentSourceData?.getUrl(tmdbId, imdbId, type, season, episode) || '';

  const switchSource = (sourceIndex: number) => {
    if (sourceIndex < availableSources.length) {
      setCurrentSource(sourceIndex);
      setIsLoading(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, you would control the iframe player
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you would control the iframe player
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    setIsMuted(value[0] === 0);
    // In a real implementation, you would control the iframe player
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePictureInPicture = async () => {
    if (!iframeRef.current) return;
    
    try {
      if ('requestPictureInPicture' in HTMLVideoElement.prototype) {
        // Note: PiP for iframes is limited, this is a placeholder
        console.log('Picture-in-Picture requested');
      }
    } catch (error) {
      console.error('PiP not supported or failed:', error);
    }
  };

  const castToDevice = () => {
    // Placeholder for Chromecast functionality
    if ('chrome' in window && 'cast' in (window as any).chrome) {
      console.log('Casting to device...');
    } else {
      console.log('Chromecast not available');
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  if (!currentSourceData || !embedUrl) {
    return (
      <div className="relative w-full bg-black rounded-lg overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          <div className="text-white text-center">
            <p className="mb-2">No compatible video sources available</p>
            <p className="text-sm text-white/60">
              {!imdbId && 'IMDB ID required for some sources'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className="video-player-container group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Source Selection Dropdown */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2">
          <Select
            value={currentSource.toString()}
            onValueChange={(value) => switchSource(parseInt(value))}
          >
            <SelectTrigger className="w-40 h-8 text-xs text-white border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableSources.map((source, index) => (
                <SelectItem key={source.name} value={index.toString()}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Video Container */}
      <div className="aspect-video relative">
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-white text-center">
              <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading {currentSourceData.name}...</p>
              <div className="w-64 bg-white/20 rounded-full h-1 mt-2">
                <div className="bg-white h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Video Iframe */}
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={`Watch ${title} - ${currentSourceData.name}`}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          onLoad={() => setIsLoading(false)}
        />

        {/* Custom Player Controls Overlay */}
        <div className={`video-controls-overlay ${!showControls && !isLoading ? 'hidden' : ''}`}>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-white/20 rounded-full h-1 cursor-pointer">
              <div className="bg-white h-1 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>

          {/* Main Controls */}
          <div className="video-controls-main flex items-center justify-between text-white">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted || volume[0] === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="w-20">
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <div className="text-sm">
                <span>0:30 / 2:15:45</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="video-controls-right flex items-center space-x-2">
              {/* Quality Selector */}
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="w-20 h-8 text-xs text-white border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUALITY_OPTIONS.map((q) => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Speed Selector */}
              <Select value={speed} onValueChange={setSpeed}>
                <SelectTrigger className="w-16 h-8 text-xs text-white border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPEED_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Subtitles Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                className={`text-white hover:bg-white/20 ${subtitlesEnabled ? 'bg-white/20' : ''}`}
              >
                <Subtitles className="h-4 w-4" />
              </Button>

              {/* Picture-in-Picture */}
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePictureInPicture}
                className="text-white hover:bg-white/20"
              >
                <Monitor className="h-4 w-4" />
              </Button>

              {/* Chromecast */}
              <Button
                variant="ghost"
                size="sm"
                onClick={castToDevice}
                className="text-white hover:bg-white/20"
              >
                <Cast className="h-4 w-4" />
              </Button>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
                title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen (F)'}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Video Info */}
          <div className="mt-3 flex justify-between items-center text-sm text-white/80">
            <div>
              <span className="font-medium">{title}</span>
              <span className="ml-2">• {currentSourceData.name}</span>
              <span className="ml-2">• {quality}</span>
              {subtitlesEnabled && <span className="ml-2">• Subtitles</span>}
            </div>
            <div className="text-xs">
              Press F for fullscreen • Space to play/pause
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 text-xs text-white">
          <div className="space-y-1">
            <div>Space: Play/Pause</div>
            <div>F: Fullscreen</div>
            <div>M: Mute</div>
            <div>↑/↓: Volume</div>
          </div>
        </div>
      </div>
    </div>
  );
}
