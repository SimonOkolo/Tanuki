var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_BASE_URL = 'https://api.consumet.org/anime/gogoanime';
export function searchAnime(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/${query}`);
        const data = yield response.json();
        return data.results;
    });
}
export function getTopAiring() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/top-airing`);
        const data = yield response.json();
        return data.results;
    });
}
export function getRecentEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/recent-episodes`);
        const data = yield response.json();
        return data.results;
    });
}
export function getAnimeDetails(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/info/${id}`);
        return yield response.json();
    });
}
export function getEpisodeServers(episodeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/servers/${episodeId}`);
        return yield response.json();
    });
}
export function getStreamingLinks(episodeId, server) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/watch/${episodeId}?server=${server}`);
        return yield response.json();
    });
}
export function getAnimeByGenre(genreId, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/genre/${genreId}?page=${page}`);
        return yield response.json();
    });
}
export function getGenres() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/genre/list`);
        return yield response.json();
    });
}
