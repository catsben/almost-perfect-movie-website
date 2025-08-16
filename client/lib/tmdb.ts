const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Credits {
  cast: Cast[];
}

class TMDbAPI {
  private baseURL = TMDB_BASE_URL;
  private apiKey = TMDB_API_KEY;
  private imageBaseURL = TMDB_IMAGE_BASE_URL;

  private async fetchAPI(endpoint: string) {
    const separator = endpoint.includes('?') ? '&' : '?';
    const response = await fetch(`${this.baseURL}${endpoint}${separator}api_key=${this.apiKey}`);
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }
    return response.json();
  }

  // Movie endpoints
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
    return this.fetchAPI(`/trending/movie/${timeWindow}`);
  }

  async getPopularMovies(page = 1) {
    return this.fetchAPI(`/movie/popular?page=${page}`);
  }

  async getTopRatedMovies(page = 1) {
    return this.fetchAPI(`/movie/top_rated?page=${page}`);
  }

  async getUpcomingMovies(page = 1) {
    return this.fetchAPI(`/movie/upcoming?page=${page}`);
  }

  async getMovieDetails(movieId: number) {
    return this.fetchAPI(`/movie/${movieId}`);
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.fetchAPI(`/movie/${movieId}/credits`);
  }

  async getMovieExternalIds(movieId: number) {
    return this.fetchAPI(`/movie/${movieId}/external_ids`);
  }

  // TV Show endpoints
  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'week') {
    return this.fetchAPI(`/trending/tv/${timeWindow}`);
  }

  async getPopularTVShows(page = 1) {
    return this.fetchAPI(`/tv/popular?page=${page}`);
  }

  async getTopRatedTVShows(page = 1) {
    return this.fetchAPI(`/tv/top_rated?page=${page}`);
  }

  async getTVShowDetails(tvId: number) {
    return this.fetchAPI(`/tv/${tvId}`);
  }

  async getTVShowCredits(tvId: number): Promise<Credits> {
    return this.fetchAPI(`/tv/${tvId}/credits`);
  }

  async getTVShowExternalIds(tvId: number) {
    return this.fetchAPI(`/tv/${tvId}/external_ids`);
  }

  // Search endpoints
  async searchMulti(query: string, page = 1) {
    return this.fetchAPI(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
  }

  async searchMovies(query: string, page = 1) {
    return this.fetchAPI(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  }

  async searchTVShows(query: string, page = 1) {
    return this.fetchAPI(`/search/tv?query=${encodeURIComponent(query)}&page=${page}`);
  }

  // Genres
  async getMovieGenres() {
    return this.fetchAPI('/genre/movie/list');
  }

  async getTVGenres() {
    return this.fetchAPI('/genre/tv/list');
  }

  // Discover endpoints for categories
  async discoverMovies(params: {
    with_genres?: string;
    with_keywords?: string;
    page?: number;
    sort_by?: string;
  } = {}) {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      sort_by: params.sort_by || 'popularity.desc',
      ...params
    });
    return this.fetchAPI(`/discover/movie?${queryParams}`);
  }

  async discoverTVShows(params: {
    with_genres?: string;
    with_keywords?: string;
    page?: number;
    sort_by?: string;
  } = {}) {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      sort_by: params.sort_by || 'popularity.desc',
      ...params
    });
    return this.fetchAPI(`/discover/tv?${queryParams}`);
  }

  // Helper methods for image URLs
  getImageURL(path: string, size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'original' = 'w500') {
    if (!path) return '/placeholder.svg';
    return `${this.imageBaseURL}/${size}${path}`;
  }

  getBackdropURL(path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') {
    if (!path) return '/placeholder.svg';
    return `${this.imageBaseURL}/${size}${path}`;
  }
}

export const tmdbAPI = new TMDbAPI();
