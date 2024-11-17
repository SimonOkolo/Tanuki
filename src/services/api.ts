const API_PROXY_URL = '/api';
const ANILIST_BASE_URL = '/api/anilist';
import { ServerInfo, AnimeDetails, Anime, AniListResponse } from '../types';

//ANILIST SPOTLIGHT SLIDESHOW
export async function getTrendingAnime(): Promise<Anime[]> {
  try {
      const response = await fetch(`${ANILIST_BASE_URL}/trending`);
      if (!response.ok) {
          throw new Error('Failed to fetch trending anime');
      }
      const data = await response.json();
      console.log('Trending Anime API Response:', data);
      
      // Transform AniList data to match our Anime interface
      return data.results.map((item: AniListResponse) => ({
          id: item.id.toString(),
          title: item.title.english || item.title.romaji,
          image: item.cover,
          description: item.description,
          genres: item.genres,
          rating: item.rating,
          season: item.season,
          seasonYear: item.seasonYear,
          bannerImage: item.bannerImage,
          anilistInfo: item
      }));
  } catch (error) {
      console.error('Error fetching trending anime:', error);
      throw error;
  }
}

//ANILIST UPCOMMING SECTION
export async function getUpcomingAnime(): Promise<Anime[]> {
  try {
    const response = await fetch(`${ANILIST_BASE_URL}/popular`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular anime');
    }
    const data = await response.json();
    
    return data.results.map((item: AniListResponse) => ({
      id: item.id.toString(),
      title: item.title.english || item.title.romaji,
      image: item.image,
      cover: item.cover,
      description: item.description,
      genres: item.genres,
      rating: item.rating,
      season: item.season,
      seasonYear: item.seasonYear,
      anilistInfo: item
    }));
  } catch (error) {
    console.error('Error fetching upcoming anime:', error);
    throw error;
  }
}

export async function getAniListInfo(title: string): Promise<AniListResponse | undefined> {
  try {
    const response = await fetch(`${API_PROXY_URL}/anilist/${encodeURIComponent(title)}`);
    if (!response.ok) {
      console.warn(`No AniList data found for: ${title}`);
      return undefined;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching AniList data:', error);
    return undefined;
  }
}

export async function searchAnime(query: string): Promise<Anime[]> {
  const response = await fetch(`${API_PROXY_URL}/${query}`);
  const data = await response.json();
  return data.results;
}

export async function getTopAiring(): Promise<any> {
    const response = await fetch(`${API_PROXY_URL}/top-airing`);
    const data = await response.json();
    return data.results;
}

export async function getMovies(): Promise<any> {
    const response = await fetch(`${API_PROXY_URL}/movies`);
    const data = await response.json();
    return data.results;
}

export async function getRecentEpisodes(): Promise<any> {
    const response = await fetch(`${API_PROXY_URL}/recent-episodes`);
    const data = await response.json();
    return data.results;
}

export async function getAnimeDetails(id: string): Promise<AnimeDetails> {
  const response = await fetch(`${API_PROXY_URL}/info/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch anime details: ${response.statusText}`);
  }
  const details = await response.json();
  const anilistInfo = await getAniListInfo(details.title);
  
  return {
    ...details,
    anilistInfo,
    genres: anilistInfo?.genres,
    score: anilistInfo?.rating,
    popularity: anilistInfo?.popularity,
    season: anilistInfo?.season,
    seasonYear: anilistInfo?.seasonYear,
    studios: anilistInfo?.studios?.nodes?.map(node => node.name)
  };
}


export async function getEpisodeServers(episodeId: string): Promise<ServerInfo[]> {
    try {
      const response = await fetch(`${API_PROXY_URL}/servers/${episodeId}`);
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in getEpisodeServers:', error);
      throw error;
    }
  }

export async function getStreamingLinks(episodeId: string, server: string): Promise<any> {
    const response = await fetch(`${API_PROXY_URL}/watch/${episodeId}?server=${server}`);
    return await response.json();
}

export async function getAnimeByGenre(genreId: string, page: number = 1): Promise<any> {
    const response = await fetch(`${API_PROXY_URL}/genre/${genreId}?page=${page}`);
    return await response.json();
}

export async function getGenres(): Promise<any> {
    const response = await fetch(`${API_PROXY_URL}/genre/list`);
    return await response.json();
}

export async function getTopAiringWithDetails(): Promise<Anime[]> {
  const topAiring = await getTopAiring();
  const detailedAnime = await Promise.all(
    topAiring.map(async (anime: any) => {
      const details = await getAnimeDetails(anime.id);
      return { 
        ...anime,
        anilistInfo: details.anilistInfo,
        description: details.anilistInfo?.description || details.description,
        genres: details.anilistInfo?.genres,
        rating: details.anilistInfo?.rating,
        popularity: details.anilistInfo?.popularity,
        season: details.anilistInfo?.season,
        seasonYear: details.anilistInfo?.seasonYear,
        studios: details.anilistInfo?.studios?.nodes?.map(node => node.name)
      };
    })
  );
  return detailedAnime;
}

async function handleApiResponse(response: Response) {
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API error (${response.status}):`, errorBody);
      throw new Error(`API request failed: ${response.statusText}\n${errorBody}`);
    }
    return response.json();
  }