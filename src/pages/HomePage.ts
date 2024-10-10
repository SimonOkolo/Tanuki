import { getTopAiring, getRecentEpisodes, getGenres } from '../services/api';
import { displayAnimeList, setupScrollButtons } from '../components/AnimeList';
import { Slideshow } from '../components/Slideshow';

export async function initHomePage(): Promise<void> {
  const recentAnime = document.getElementById('recentAnime');
  const genresList = document.getElementById('genresList');

  if (recentAnime && genresList) {
    try {
      const [topAiringData, recentEpisodesData, genresData] = await Promise.all([
        getTopAiring(),
        getRecentEpisodes(),
        getGenres()
      ]);

      const slideshow = new Slideshow(topAiringData);
      slideshow.init();

      displayAnimeList(recentEpisodesData, recentAnime);
      setupScrollButtons('recentAnime');

      displayGenres(genresData, genresList);
    } catch (error) {
      console.error('Error initializing home page:', error);
    }
  }
}

function displayGenres(genres: { id: string, title: string }[], container: HTMLElement): void {
  container.innerHTML = '';
  genres.forEach(genre => {
    const genreLink = document.createElement('a');
    genreLink.textContent = genre.title;
    genreLink.href = `genres.html?id=${genre.id}&title=${encodeURIComponent(genre.title)}`;
    genreLink.classList.add('genre-link');
    container.appendChild(genreLink);
  });
}