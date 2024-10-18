import { Anime } from '../types';
import { createAnimeCard } from './AnimeCard';

export function displayAnimeList(results: Anime[], container: HTMLElement): void {
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = '<p>No results found.</p>';
    return;
  }
  results.forEach(anime => {
    const animeCard = createAnimeCard(anime);
    container.appendChild(animeCard);
  });
}