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

//ANILIST SCHEDULE
export async function getSchedule(): Promise<any[]> {
  try {
    const response = await fetch(`${ANILIST_BASE_URL}/airing-schedule`);
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
}

export async function getAniListInfo(title: string): Promise<AniListResponse | undefined> {
  if (!title) {
    console.warn('No title provided for AniList info');
    return undefined;
  }

  try {
    const response = await fetch(`${API_PROXY_URL}/anilist/${encodeURIComponent(title)}`);
    if (!response.ok) {
      console.warn(`No AniList data found for: ${title}`);
      return undefined;
    }
    const data = await response.json();
    
    // Validate the received data
    if (!data || !data.title) {
      console.warn(`Invalid AniList data for: ${title}`, data);
      return undefined;
    }
    
    return data;
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
    const response = await fetch(`${API_PROXY_URL}/top-airing`);           /*DONT THINK ITS IN USE*/
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
  
  let anilistInfo;
  try {
    const searchResponse = await fetch(`${API_PROXY_URL}/anilist/${encodeURIComponent(details.title)}`);
    if (searchResponse.ok) {
      const searchResults = await searchResponse.json();
      
      if (searchResults.results && searchResults.results.length > 0) {
        const anilistId = searchResults.results[0].id;
        const infoResponse = await fetch(`${API_PROXY_URL}/anilist/info/${anilistId}`);
        
        if (infoResponse.ok) {
          anilistInfo = await infoResponse.json();
        }
      }
    }
  } catch (error) {
    console.warn(`Could not fetch AniList info for ${details.title}:`, error);
  }
  
  return {
    ...details,
    anilistInfo,
    // Provide fallback values with null checks
    malId: anilistInfo?.malId || "",
    genres: anilistInfo?.genres || details.genres || [],
    score: anilistInfo?.rating || "No rating data",
    popularity: anilistInfo?.popularity,
    season: anilistInfo?.season,
    seasonYear: anilistInfo?.seasonYear,
    studios: anilistInfo?.studios,
    characters: anilistInfo?.characters,
    trailers: anilistInfo?.trailer,
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
        studios: details.anilistInfo?.studios,
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