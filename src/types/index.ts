export interface Anime {
  id: string;
  title: string;
  image: string;
  cover: string;
  description?: string;
  otherName?: string;
  releaseDate?: string;
  subOrDub?: string;
  status?: string;
  // AniList-related fields
  anilistInfo?: AniListResponse;
  genres?: string[];
  rating?: number;
  popularity?: number;
  season?: string;
  seasonYear?: number;
  studios?: string[];
}


    
export interface AniListResponse {
  id: number;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  cover: string;
  image: string;
  bannerImage: string;
  genres: string[];
  rating: number;
  popularity: number;
  episodes: number;
  season: string;
  seasonYear: number;
  status: string;
  studios: {
    nodes: Array<{
      name: string;
    }>;
  };
  characters: Array<{
    node: Character;
    role: string;
    name: {
      full: string;
      native: string;
    }
    image: string;
    voiceActors: VoiceActor[];
  }>;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
  };
  artwork?: Array<{
    img: string;
    type: string;
    providerId: string;
  }>;
  recommendations?: Array<{
    title: {
      romaji: string;
      english: string;
      native: string;
    }
  }>;
}

export interface Character {
  id: number;
  name: {
    full: string;
    native: string;
  };
  image: {
    large: string;
    medium: string;
  };
  voiceActors: VoiceActor[];
  role: string;
}

export interface VoiceActor {
  id: number;
  name: {
    full: string;
    native: string;
  };
  image: string;
  language: string;
}

export interface AnimeDetails {
  id: string;
  title: string;
  image: string;
  description?: string;
  episodes: Episode[];
  anilistInfo?: AniListResponse;
}
    
export interface Episode {
  id: string;
  number: number;
  title?: string;
}
    
export interface AnimeDetails extends Anime {
  episodes: Episode[];
}

export interface StreamingLink {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export interface ServerInfo {
  name: string;
  url: string;
}

export interface ServerResponse {
  sources: StreamingLink[];
  subtitles?: { url: string; lang: string }[];
}

export interface WatchingAnime {
  animeId: string;
  episode: Episode;
  title: string;
  otherName: string;
  image: string;
  releaseDate?: string;
  subOrDub?: string;
  status?: string;
  description?: string;
  genres?: string[];
  episodes: Episode[];
  timestamp: Date;
}