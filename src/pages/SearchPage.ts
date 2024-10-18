import { searchAnime } from '../services/api';
import { displayAnimeList } from '../components/AnimeList';

export function initSearchPage(): void {
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  const searchButton = document.getElementById('searchButton');
  const searchResults = document.getElementById('searchResults');

  if (searchInput && searchButton && searchResults) {
    searchButton.addEventListener('click', () => performSearch(searchInput.value, searchResults));
  }
}

async function performSearch(query: string, container: HTMLElement): Promise<void> {
  if (query.trim().length === 0) return;

  try {
    const results = await searchAnime(query);
    displayAnimeList(results, container);
  } catch (error) {
    console.error('Error searching anime:', error);
    container.innerHTML = '<p>Error searching for anime. Please try again.</p>';
  }
}