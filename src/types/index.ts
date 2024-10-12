export interface Anime {
    id: string;
    title: string;
    image: string;
    releaseDate?: string;
    subOrDub?: string;
    status?: string;
    description?: string;
    genres?: string[];
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