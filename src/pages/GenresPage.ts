import { getAnimeByGenre } from '../services/api';
import { displayAnimeList } from '../components/AnimeList';

export function initGenresPage(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const genreId = urlParams.get('id');
  const genreTitle = urlParams.get('title');
  
  if (genreId && genreTitle) {
    fetchAnimeByGenre(genreId, genreTitle);
  } else {
    const selectedGenre = document.getElementById('selectedGenre');
    const animeGrid = document.getElementById('animeGrid');
    if (selectedGenre && animeGrid) {
      selectedGenre.textContent = 'No genre selected';
      animeGrid.innerHTML = '<p>Please select a genre from the home page.</p>';
    }
  }
}

async function fetchAnimeByGenre(genreId: string, genreTitle: string, page: number = 1): Promise<void> {
  const selectedGenre = document.getElementById('selectedGenre');
  const animeGrid = document.getElementById('animeGrid');
  const paginationControls = document.getElementById('paginationControls');

  if (selectedGenre && animeGrid && paginationControls) {
    try {
      const data = await getAnimeByGenre(genreId, page);
      selectedGenre.textContent = `${genreTitle} Anime (Page ${page})`;
      displayAnimeList(data.results, animeGrid);
      updatePaginationControls(data.hasNextPage, page, genreId, genreTitle, paginationControls);
    } catch (error) {
      console.error('Error fetching anime by genre:', error);
      animeGrid.innerHTML = '<p>Error loading anime. Please try again later.</p>';
    }
  }
}

function updatePaginationControls(
  hasNextPage: boolean,
  currentPage: number,
  genreId: string,
  genreTitle: string,
  paginationControls: HTMLElement
): void {
  paginationControls.innerHTML = '';
  
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => fetchAnimeByGenre(genreId, genreTitle, currentPage - 1));
    paginationControls.appendChild(prevButton);
  }

  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Page ${currentPage}`;
  paginationControls.appendChild(pageInfo);

  if (hasNextPage) {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => fetchAnimeByGenre(genreId, genreTitle, currentPage + 1));
    paginationControls.appendChild(nextButton);
  }
}