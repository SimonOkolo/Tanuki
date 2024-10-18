import { initHomePage } from './pages/HomePage';
import { initSearchPage } from './pages/SearchPage';
import { initGenresPage } from './pages/GenresPage';
import { initAnimeDetailsPage } from './pages/AnimeDetailsPage';
import { initEpisodePage } from './pages/EpisodePage';
import { initLoginPage } from './pages/LoginPage';
import { initAdminPanel } from './pages/AdminPanel';
import { redirectIfNotAuthenticated } from './auth';

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();

  switch (currentPage) {
    case 'index.html':
    case '':
      redirectIfNotAuthenticated();
      initHomePage();
      break;
    case 'search.html':
      redirectIfNotAuthenticated();
      initSearchPage();
      break;
    case 'genres.html':
      redirectIfNotAuthenticated();
      initGenresPage();
      break;
    case 'animeDetails.html':
      redirectIfNotAuthenticated();
      initAnimeDetailsPage();
      break;
    case 'episode.html':
      redirectIfNotAuthenticated();
      initEpisodePage();
      break;
    case 'login.html':
      initLoginPage();
      break;
    case 'admin.html':
      redirectIfNotAuthenticated();
      initAdminPanel();
      break;
    default:
      console.error('Unknown page');
  }
});