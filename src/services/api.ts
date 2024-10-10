import { Anime, AnimeDetails, ServerResponse } from '../types';

const API_BASE_URL = 'https://api.consumet.org/anime/gogoanime';
const CORS_PROXY = 'http://localhost:8080/';
const API_PROXY_URL = CORS_PROXY + API_BASE_URL;

export async function searchAnime(query: string): Promise<Anime[]> {
  const response = await fetch(`${API_PROXY_URL}/${query}`);
  const data = await response.json();
  return data.results;
}

export async function getTopAiring(): Promise<Anime[]> {
  const response = await fetch(`${API_PROXY_URL}/top-airing`);
  const data = await response.json();
  return data.results;
}

export async function getRecentEpisodes(): Promise<Anime[]> {
  const response = await fetch(`${API_PROXY_URL}/recent-episodes`);
  const data = await response.json();
  return data.results;
}

export async function getAnimeDetails(id: string): Promise<AnimeDetails> {
  const response = await fetch(`${API_PROXY_URL}/info/${id}`);
  return await response.json();
}

export async function getEpisodeServers(episodeId: string): Promise<string[]> {
  const response = await fetch(`${API_PROXY_URL}/servers/${episodeId}`);
  return await response.json();
}

export async function getStreamingLinks(episodeId: string, server: string): Promise<ServerResponse> {
  const response = await fetch(`${API_PROXY_URL}/watch/${episodeId}?server=${server}`);
  return await response.json();
}

export async function getAnimeByGenre(genreId: string, page: number = 1): Promise<{ results: Anime[], hasNextPage: boolean }> {
  const response = await fetch(`${API_PROXY_URL}/genre/${genreId}?page=${page}`);
  return await response.json();
}

export async function getGenres(): Promise<{ id: string, title: string }[]> {
  const response = await fetch(`${API_PROXY_URL}/genre/list`);
  return await response.json();
}