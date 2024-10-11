var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getTopAiring, getRecentEpisodes, getGenres } from '../services/api.js';
import { displayAnimeList, setupScrollButtons } from '../components/AnimeList.js';
import { Slideshow } from '../components/Slideshow.js';
export function initHomePage() {
    return __awaiter(this, void 0, void 0, function* () {
        const recentAnime = document.getElementById('recentAnime');
        const genresList = document.getElementById('genresList');
        if (recentAnime && genresList) {
            try {
                const [topAiringData, recentEpisodesData, genresData] = yield Promise.all([
                    getTopAiring(),
                    getRecentEpisodes(),
                    getGenres()
                ]);
                const slideshow = new Slideshow(topAiringData);
                slideshow.init();
                displayAnimeList(recentEpisodesData, recentAnime);
                setupScrollButtons('recentAnime');
                displayGenres(genresData, genresList);
            }
            catch (error) {
                console.error('Error initializing home page:', error);
            }
        }
    });
}
function displayGenres(genres, container) {
    container.innerHTML = '';
    genres.forEach(genre => {
        const genreLink = document.createElement('a');
        genreLink.textContent = genre.title;
        genreLink.href = `genres.html?id=${genre.id}&title=${encodeURIComponent(genre.title)}`;
        genreLink.classList.add('genre-link');
        container.appendChild(genreLink);
    });
}
