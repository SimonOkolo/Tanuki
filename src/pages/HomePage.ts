import { getRecentEpisodes, getGenres, getUpcomingAnime, getSchedule } from '../services/api';
import { displayAnimeList } from '../components/AnimeList';
import { Slideshow } from '../components/Slideshow';
import { Schedule } from '../components/Schedule';

export async function initHomePage(): Promise<void> {
  const recentAnime = document.getElementById('recentAnime');
  const genresList = document.getElementById('genresList');
  const upcomingContainer = document.getElementById('top-anime-list');
  const scheduleContainer = document.querySelector('.main-bottom') as HTMLElement; // Add type assertion here

  if (recentAnime && genresList && upcomingContainer && scheduleContainer) {
    try {
      const [recentEpisodesData, genresData] = await Promise.all([
        getRecentEpisodes(),
        getGenres(),
      ]);

      const slideshow = new Slideshow();
      await slideshow.init();

      // Limit recent episodes to 12
      const limitedRecentEpisodes = recentEpisodesData.slice(0, 12);
      displayAnimeList(limitedRecentEpisodes, recentAnime);
      displayGenres(genresData, genresList);
      
      // Initialize upcoming anime section
      await displayUpcomingAnime(upcomingContainer);

      // Initialize schedule component
      const schedule = new Schedule(scheduleContainer);
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

async function displayUpcomingAnime(container: HTMLElement): Promise<void> {
  try {
    const upcomingAnime = await getUpcomingAnime();
    const limitedUpcoming = upcomingAnime.slice(0, 10); // Show top 5 top of all time anime

    container.innerHTML = `
      <div class="upcoming-list">
        ${limitedUpcoming.map(anime => `
          <div class="upcoming-item">
            <div class="upcoming-item-banner" style="background-image: url(${anime.cover});"></div>
            <div class="upcoming-image">
              <img src="${anime.image}" alt="${anime.title}">
            </div>
            <div class="upcoming-info">
              <h3>${anime.title}</h3>
              <div class="upcoming-meta">
                <span class="season">${anime.rating}% Average Score</span>
                ${anime.genres ? `<span class="genres">${anime.genres.slice(0, 2).join(', ')}</span>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error displaying upcoming anime:', error);
    container.innerHTML = '<p>Failed to load upcoming anime</p>';
  }
}
