import { initHomePage } from './pages/HomePage';
import { initSearchPage } from './pages/SearchPage';
import { initGenresPage } from './pages/GenresPage';
import { initAnimeDetailsPage } from './pages/AnimeDetailsPage';
import { initEpisodePage } from './pages/EpisodePage';

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();

  switch (currentPage) {
    case 'index.html':
    case '':
      initHomePage();
      break;
    case 'search.html':
      initSearchPage();
      break;
    case 'genres.html':
      initGenresPage();
      break;
    case 'animeDetails.html':
      initAnimeDetailsPage();
      break;
    case 'episode.html':
      initEpisodePage();
      break;
    default:
      console.error('Unknown page');
  }
});