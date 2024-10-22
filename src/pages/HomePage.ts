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

function displayGenres(genres: { id: string; title: string }[], container: HTMLElement): void {
  container.innerHTML = '';
  
  // Create wrapper for the scrolling content
  const wrapper = document.createElement('div');
  wrapper.classList.add('genres-wrapper');
  
  // Create original set of genres
  genres.forEach(genre => {
      const genreLink = document.createElement('a');
      genreLink.textContent = genre.title;
      genreLink.href = `genres.html?id=${genre.id}&title=${encodeURIComponent(genre.title)}`;
      genreLink.classList.add('genre-link');
      wrapper.appendChild(genreLink);
  });
  
  // Clone genres for seamless loop
  const clone = wrapper.cloneNode(true);
  wrapper.appendChild(clone.childNodes[0]);
  
  container.appendChild(wrapper);

  let timeoutId: number | null = null;
  let isHovered = false;
  let isManuallyScrolling = false;
  
  // Function to pause animation
  const pauseScroll = () => {
      wrapper.style.animationPlayState = 'paused';
      if (timeoutId) {
          window.clearTimeout(timeoutId);
      }
  };
  
  // Function to resume animation
  const resumeScroll = () => {
      if (!isHovered && !isManuallyScrolling) {
          wrapper.style.animationPlayState = 'running';
      }
  };
  
  // Event listeners for mouse interaction
  container.addEventListener('mouseenter', () => {
      isHovered = true;
      pauseScroll();
  });
  
  container.addEventListener('mouseleave', () => {
      isHovered = false;
      timeoutId = window.setTimeout(resumeScroll, 3000); // Changed to 3 seconds
  });
  
  // Event listeners for scroll interaction
  let scrollTimeout: number | null = null;
  container.addEventListener('wheel', () => {
      isManuallyScrolling = true;
      pauseScroll();
      
      if (scrollTimeout) {
          window.clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = window.setTimeout(() => {
          isManuallyScrolling = false;
          if (!isHovered) {
              resumeScroll();
          }
      }, 3000); // Changed to 3 seconds
  });

  // Handle touch events for mobile
  container.addEventListener('touchstart', () => {
      isManuallyScrolling = true;
      pauseScroll();
  });

  container.addEventListener('touchend', () => {
      if (scrollTimeout) {
          window.clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = window.setTimeout(() => {
          isManuallyScrolling = false;
          if (!isHovered) {
              resumeScroll();
          }
      }, 3000); // Changed to 3 seconds
  });
}