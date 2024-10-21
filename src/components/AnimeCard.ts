import { Anime } from '../types';
import { getAnimeDetails } from '../services/api';

export function createAnimeCard(anime: Anime): HTMLElement {
  const card = document.createElement('div');
  card.classList.add('anime-card');

  card.innerHTML = `
    <img src="${anime.image}" alt="${anime.title}" onerror="this.src='https://via.placeholder.com/200x300'">
    <div class="anime-type" data-anime-id="${anime.id}">Loading...</div>
    <div class="anime-title">
      <h3>${anime.title}</h3>
    </div>
  `;

  card.addEventListener('click', () => {
    window.location.href = `animeDetails.html?id=${anime.id}`;
  });

  // Fetch episode count asynchronously
  fetchEpisodeCount(anime.id, card.querySelector('.anime-type') as HTMLElement);

  return card;
}

async function fetchEpisodeCount(animeId: string, element: HTMLElement): Promise<void> {
  try {
    const details = await getAnimeDetails(animeId);
    const episodeCount = details.episodes ? details.episodes.length : 'N/A';
    element.textContent = `${episodeCount} eps`;
  } catch (error) {
    console.error(`Error fetching episode count for anime ${animeId}:`, error);
    element.textContent = 'N/A';
  }
}