import { getRecentEpisodes, getGenres, getMovies } from '../services/api';
import { displayAnimeList } from '../components/AnimeList';
import { Slideshow } from '../components/Slideshow';

export async function initHomePage(): Promise<void> {
  const recentAnime = document.getElementById('recentAnime');
  const genresList = document.getElementById('genresList');
  const moviesAnime = document.getElementById('moviesAnime');

  if (recentAnime && genresList && moviesAnime) {
    try {
      const [recentEpisodesData, genresData, moviesData] = await Promise.all([
        getRecentEpisodes(),
        getGenres(),
        getMovies()
      ]);

      const slideshow = new Slideshow();
      await slideshow.init();

      // Limit recent episodes to 12
      const limitedRecentEpisodes = recentEpisodesData.slice(0, 12);
      displayAnimeList(limitedRecentEpisodes, recentAnime);

      displayGenres(genresData, genresList);
      const limitedMovies = moviesData.slice(0, 12);
      displayAnimeList(limitedMovies, moviesAnime);
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