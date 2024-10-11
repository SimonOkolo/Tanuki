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

export function setupScrollButtons(containerId: string): void {
  const container = document.getElementById(containerId);
  const leftArrow = document.getElementById(`${containerId}LeftArrow`);
  const rightArrow = document.getElementById(`${containerId}RightArrow`);

  if (container && leftArrow && rightArrow) {
    leftArrow.addEventListener('click', () => scrollList(container, -1));
    rightArrow.addEventListener('click', () => scrollList(container, 1));
  }
}

function scrollList(element: HTMLElement, direction: number): void {
  const scrollAmount = element.offsetWidth * 0.8 * direction;
  element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}