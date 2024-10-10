var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { searchAnime } from '../services/api';
import { displayAnimeList, setupScrollButtons } from '../components/AnimeList';
export function initSearchPage() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    if (searchInput && searchButton && searchResults) {
        searchButton.addEventListener('click', () => performSearch(searchInput.value, searchResults));
        setupScrollButtons('searchResults');
    }
}
function performSearch(query, container) {
    return __awaiter(this, void 0, void 0, function* () {
        if (query.trim().length === 0)
            return;
        try {
            const results = yield searchAnime(query);
            displayAnimeList(results, container);
        }
        catch (error) {
            console.error('Error searching anime:', error);
            container.innerHTML = '<p>Error searching for anime. Please try again.</p>';
        }
    });
}
