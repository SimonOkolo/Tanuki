import { getAnimeDetails } from '../services/api';
import { AnimeDetails, Episode } from '../types';
import { auth } from '../services/firebase';

export async function initAnimeDetailsPage(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id');
  const user = auth.currentUser;

  if (animeId) {
    try {
      const animeDetails = await getAnimeDetails(animeId);
      displayAnimeDetails(animeDetails);
    } catch (error) {
      console.error('Error fetching anime details:', error);
      document.body.innerHTML = '<h1>Error: Failed to fetch anime details</h1>';
    }
  } else {
    document.body.innerHTML = '<h1>Error: No anime ID provided</h1>';
  }
}

function displayAnimeDetails(anime: AnimeDetails): void {
  document.title = `Tanuki - ${anime.title}`;

  const banner = document.getElementById('animeDetailsTop');
  const image = document.getElementById('animeBanner')
  if (banner && image) {
    banner.style.backgroundImage = `url(${anime.image})`;
    image.style.backgroundImage = `url(${anime.image})`;
  }

  updateElement('animeTitle', anime.title);
  updateElement('animeDescription', anime.description || 'No description available.');
  updateElement('animeType', `${anime.subOrDub || 'N/A'}`);
  updateElement('animeStatus', `Status:\\ ${anime.status || 'N/A'}`);
  updateElement('animeReleased', `Released: ${anime.releaseDate || 'N/A'}`);
  updateElement('animeGenres', `Genres: ${anime.genres?.join(', ') || 'N/A'}`);

  displayEpisodes(anime.episodes, anime.id);
}

function updateElement(id: string, text: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function displayEpisodes(episodes: Episode[], animeId: string): void {
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
      
      li.appendChild(episodeNumber);
      episodesContainer.appendChild(li);
    });
  }
}