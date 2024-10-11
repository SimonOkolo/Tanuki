const API_PROXY_URL = '/api';

export async function searchAnime(query: string): Promise<any> {
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

export async function getAnimeDetails(id: string): Promise<any> {
    const response = await fetch(`${API_PROXY_URL}/info/${id}`);
    return await response.json();
}

export async function getEpisodeServers(episodeId: string): Promise<any> {
    const response = await fetch(`${API_PROXY_URL}/servers/${episodeId}`);
    return await response.json();
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

export async function getTopAiringWithDetails(): Promise<any> {
    const topAiring = await getTopAiring();
    const detailedAnime = await Promise.all(
        topAiring.map(async (anime: any) => {
            const details = await getAnimeDetails(anime.id);
            return { ...anime, description: details.description };
        })
    );
    return detailedAnime;
}