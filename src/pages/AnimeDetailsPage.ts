import { getAnimeDetails } from '../services/api';
import { AnimeDetails, Episode } from '../types';
import { auth } from '../services/firebase';

export async function initAnimeDetailsPage(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id');
  console.error('anime id found to be,', animeId)
  const user = auth.currentUser;

  if (animeId) {
    try {
      const animeDetails = await getAnimeDetails(animeId);
      displayAnimeDetails(animeDetails);
      console.error('anime fetched is:', animeDetails)
    } catch (error) {
      console.error('Error fetching anime details:', error);
      document.body.innerHTML = '<h1>Error: Failed to fetch anime details</h1>';
    }
  } else {
    document.body.innerHTML = '<h1>Error: No anime ID provided</h1>';
  }
}

function displayAnimeDetails(anime: AnimeDetails): void {
  // Use AniList banner if available, fallback to GoGoAnime image
  const bannerImage = anime.anilistInfo?.bannerImage || anime.image;
  
  const banner = document.getElementById('animeDetailsTop');
  const image = document.getElementById('animeBanner')
  if (banner && image) {
    banner.style.backgroundImage = `url(${bannerImage})`;
    image.style.backgroundImage = `url(${anime.image})`;
  }

  // Enhance title display with alternative titles
  const titleElement = document.getElementById('animeTitle');
  if (titleElement && anime.anilistInfo) {
    const titles = [
      anime.anilistInfo.title.english,
      anime.anilistInfo.title.romaji,
      anime.anilistInfo.title.native
    ].filter(Boolean);
    
    titleElement.textContent = titles[0];
    if (titles.length > 1) {
      titleElement.title = titles.join(' / ');
    }
  }

  // Use AniList description if available
  updateElement('animeDescription', 
    anime.anilistInfo?.description || anime.description || 'No description available.'
  );

  // More detailed status and metadata
  updateElement('animeStatus', `Status: ${
    anime.anilistInfo?.status || anime.status || 'N/A'
  }`);

  updateElement('animeReleased', `Released: ${
    anime.anilistInfo ? 
      `${anime.anilistInfo.season} ${anime.anilistInfo.seasonYear}` : 
      (anime.releaseDate || 'N/A')
  }`);

  updateElement('animeGenres', `Genres: ${
    anime.anilistInfo?.genres?.join(', ') || 
    anime.genres?.join(', ') || 
    'N/A'
  }`);

  // Optional: Add additional information from AniList
  const extraDetailsEl = document.getElementById('animeExtraDetails');
  if (extraDetailsEl && anime.anilistInfo) {
    extraDetailsEl.innerHTML += `
      <p>Rating: ${anime.anilistInfo.rating / 10}/10</p>
      <p>Popularity: ${anime.anilistInfo.popularity}</p>
      ${anime.anilistInfo.studios?.nodes?.length ? 
        `<p>Studios: ${anime.anilistInfo.studios.nodes.map(node => node.name).join(', ')}</p>` : 
        ''
      }
    `;
  }

  // Preserve original episode display logic
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
      episodeNumber.textContent = `${ep.number}`;
      
      li.appendChild(episodeNumber);
      episodesContainer.appendChild(li);
    });
  }
}