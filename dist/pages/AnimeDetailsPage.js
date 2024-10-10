var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAnimeDetails } from '../services/api';
export function initAnimeDetailsPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const urlParams = new URLSearchParams(window.location.search);
        const animeId = urlParams.get('id');
        if (animeId) {
            try {
                const animeDetails = yield getAnimeDetails(animeId);
                displayAnimeDetails(animeDetails);
            }
            catch (error) {
                console.error('Error fetching anime details:', error);
                document.body.innerHTML = '<h1>Error: Failed to fetch anime details</h1>';
            }
        }
        else {
            document.body.innerHTML = '<h1>Error: No anime ID provided</h1>';
        }
    });
}
function displayAnimeDetails(anime) {
    var _a;
    document.title = `Tanuki - ${anime.title}`;
    const banner = document.getElementById('animeBanner');
    if (banner) {
        banner.style.backgroundImage = `url(${anime.image})`;
    }
    updateElement('animeTitle', anime.title);
    updateElement('animeDescription', anime.description || 'No description available.');
    updateElement('animeType', `Type: ${anime.subOrDub || 'N/A'}`);
    updateElement('animeStatus', `Status: ${anime.status || 'N/A'}`);
    updateElement('animeReleased', `Released: ${anime.releaseDate || 'N/A'}`);
    updateElement('animeGenres', `Genres: ${((_a = anime.genres) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'N/A'}`);
    displayEpisodes(anime.episodes, anime.id);
}
function updateElement(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}
function displayEpisodes(episodes, animeId) {
    const episodesContainer = document.getElementById('episodesContainer');
    if (episodesContainer) {
        episodesContainer.innerHTML = '';
        episodes.forEach(ep => {
            const li = document.createElement('li');
            li.className = 'episode-item';
            li.onclick = () => window.location.href = `episode.html?id=${animeId}&ep=${ep.number}`;
            const episodeNumber = document.createElement('span');
            episodeNumber.className = 'episode-number';
            episodeNumber.textContent = `Episode ${ep.number}`;
            const episodeTitle = document.createElement('span');
            episodeTitle.className = 'episode-title';
            episodeTitle.textContent = ep.title && ep.title !== "null" ? ep.title : "No Title";
            li.appendChild(episodeNumber);
            li.appendChild(episodeTitle);
            episodesContainer.appendChild(li);
        });
    }
}
