export interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  addedAt: string;
}

export interface HistoryItem extends WatchlistItem {
  watchedAt: string;
  progress?: number; // percentage watched
}

const WATCHLIST_KEY = 'streamflix_watchlist';
const HISTORY_KEY = 'streamflix_history';

export class StorageManager {
  // Watchlist methods
  static getWatchlist(): WatchlistItem[] {
    try {
      const data = localStorage.getItem(WATCHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addToWatchlist(item: Omit<WatchlistItem, 'addedAt'>): void {
    const watchlist = this.getWatchlist();
    const exists = watchlist.find(w => w.id === item.id && w.type === item.type);
    
    if (!exists) {
      const newItem: WatchlistItem = {
        ...item,
        addedAt: new Date().toISOString(),
      };
      watchlist.unshift(newItem);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
  }

  static removeFromWatchlist(id: number, type: 'movie' | 'tv'): void {
    const watchlist = this.getWatchlist();
    const filtered = watchlist.filter(item => !(item.id === id && item.type === type));
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
  }

  static isInWatchlist(id: number, type: 'movie' | 'tv'): boolean {
    const watchlist = this.getWatchlist();
    return watchlist.some(item => item.id === id && item.type === type);
  }

  // History methods
  static getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addToHistory(item: Omit<HistoryItem, 'addedAt' | 'watchedAt'>, progress = 0): void {
    const history = this.getHistory();
    const existingIndex = history.findIndex(h => h.id === item.id && h.type === item.type);
    
    const newItem: HistoryItem = {
      ...item,
      addedAt: new Date().toISOString(),
      watchedAt: new Date().toISOString(),
      progress,
    };

    if (existingIndex >= 0) {
      // Update existing item
      history[existingIndex] = { ...history[existingIndex], ...newItem };
    } else {
      // Add new item to beginning
      history.unshift(newItem);
    }

    // Keep only last 100 items
    if (history.length > 100) {
      history.splice(100);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  static removeFromHistory(id: number, type: 'movie' | 'tv'): void {
    const history = this.getHistory();
    const filtered = history.filter(item => !(item.id === id && item.type === type));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  }

  static clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  }

  static clearWatchlist(): void {
    localStorage.removeItem(WATCHLIST_KEY);
  }
}
