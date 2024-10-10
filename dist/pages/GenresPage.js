var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAnimeByGenre } from '../services/api';
import { displayAnimeList } from '../components/AnimeList';
export function initGenresPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const genreId = urlParams.get('id');
    const genreTitle = urlParams.get('title');
    if (genreId && genreTitle) {
        fetchAnimeByGenre(genreId, genreTitle);
    }
    else {
        const selectedGenre = document.getElementById('selectedGenre');
        const animeGrid = document.getElementById('animeGrid');
        if (selectedGenre && animeGrid) {
            selectedGenre.textContent = 'No genre selected';
            animeGrid.innerHTML = '<p>Please select a genre from the home page.</p>';
        }
    }
}
function fetchAnimeByGenre(genreId, genreTitle, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectedGenre = document.getElementById('selectedGenre');
        const animeGrid = document.getElementById('animeGrid');
        const paginationControls = document.getElementById('paginationControls');
        if (selectedGenre && animeGrid && paginationControls) {
            try {
                const data = yield getAnimeByGenre(genreId, page);
                selectedGenre.textContent = `${genreTitle} Anime (Page ${page})`;
                displayAnimeList(data.results, animeGrid);
                updatePaginationControls(data.hasNextPage, page, genreId, genreTitle, paginationControls);
            }
            catch (error) {
                console.error('Error fetching anime by genre:', error);
                animeGrid.innerHTML = '<p>Error loading anime. Please try again later.</p>';
            }
        }
    });
}
function updatePaginationControls(hasNextPage, currentPage, genreId, genreTitle, paginationControls) {
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
