import { initHomePage } from './pages/HomePage.js';
import { initSearchPage } from './pages/SearchPage.js';
import { initGenresPage } from './pages/GenresPage.js';
import { initAnimeDetailsPage } from './pages/AnimeDetailsPage.js';
import { initEpisodePage } from './pages/EpisodePage.js';
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
