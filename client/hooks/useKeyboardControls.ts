import { useEffect } from 'react';

interface KeyboardControlsProps {
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  isEnabled?: boolean;
}

export function useKeyboardControls({
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onVolumeUp,
  onVolumeDown,
  onSeekForward,
  onSeekBackward,
  isEnabled = true
}: KeyboardControlsProps) {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          onTogglePlay();
          break;
        case 'KeyF':
          event.preventDefault();
          onToggleFullscreen();
          break;
        case 'KeyM':
          event.preventDefault();
          onToggleMute();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onVolumeUp();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onVolumeDown();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onSeekForward();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onSeekBackward();
          break;
        case 'Escape':
          // Exit fullscreen if active
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    onTogglePlay,
    onToggleMute,
    onToggleFullscreen,
    onVolumeUp,
    onVolumeDown,
    onSeekForward,
    onSeekBackward,
    isEnabled
  ]);
}
