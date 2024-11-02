import { getEpisodeServers, getAnimeDetails } from '../services/api';
import { ServerInfo, AnimeDetails, Episode } from '../types';
import { saveAnimeToProfile } from '../services/auth';
import { auth } from '../services/firebase';

export async function initEpisodePage(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id');
  const episodeNumber = urlParams.get('ep');
  const user = auth.currentUser;

  if (animeId && episodeNumber) {
    try {
      const animeDetails = await getAnimeDetails(animeId);
      
      // Find the current episode from the episodes list
      const currentEpisode = animeDetails.episodes?.find(
        (ep: Episode) => ep.number === parseInt(episodeNumber)
      );

      populateEpisodesList(animeDetails, animeId, parseInt(episodeNumber));

      // Save the current episode instead of the first episode
      if (user && currentEpisode) {
        await saveAnimeToProfile(user.uid, animeId, currentEpisode);
      } else if (user) {
        console.warn('Current episode not found');
      } else {
        console.warn('User not authenticated');
      }
      
      const episodeId = `${animeId}-episode-${episodeNumber}`;
      const servers = await getEpisodeServers(episodeId);
      console.log('Available servers:', servers);
      displayServerOptions(servers);
      displayAnimeInformation(animeDetails);
    } catch (error) {
      console.error('Error initializing episode page:', error);
      displayError('Failed to load episode information. Please try again later.');
    }
  } else {
    displayError('Invalid episode information. Please check the URL.');
  }
}

function populateEpisodesList(animeDetails: AnimeDetails, animeId: string, currentEpisode: number): void {
  const episodesContainer = document.getElementById('episodes');
  const user = auth.currentUser;

  if (episodesContainer && animeDetails.episodes) {
    episodesContainer.innerHTML = ''; // Clear existing content
    animeDetails.episodes.forEach((episode: Episode) => {
      const button = document.createElement('button');
      button.textContent = `Episode ${episode.number}`;
      button.classList.add('episode-button');
      if (episode.number === currentEpisode) {
        button.classList.add('current-episode');
      }
      button.addEventListener('click', async () => {
        window.location.href = `episode.html?id=${animeId}&ep=${episode.number}`;
        if (user) {
          try {
            await saveAnimeToProfile(user.uid, animeId, episode);
            console.log(`Saved episode ${currentEpisode} to profile`);
          } catch (error) {
            console.error('Error saving episode to profile:', error);
          }
        } else {
          console.warn('User not authenticated');
        }
      });
      episodesContainer.appendChild(button);
    });
  }
}

function displayServerOptions(servers: ServerInfo[]): void {
  const serviceSelector = document.getElementById('serviceSelector') as HTMLSelectElement;
  if (serviceSelector) {
    serviceSelector.innerHTML = '';
    servers.forEach(server => {
      const option = document.createElement('option');
      option.value = server.url;
      option.textContent = server.name;
      serviceSelector.appendChild(option);
    });

    serviceSelector.onchange = (ev: Event) => {
      const target = ev.target as HTMLSelectElement;
      loadVideoPlayer(target.value);
    };

    // Load the first server by default
    if (servers.length > 0) {
      loadVideoPlayer(servers[0].url);
    }
  }
}

function loadVideoPlayer(serverUrl: string): void {
  const videoContainer = document.getElementById('videoContainer');
  if (videoContainer) {
    videoContainer.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = serverUrl;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.allowFullscreen = true;
    videoContainer.appendChild(iframe);
  }
}

function displayError(message: string): void {
  const errorContainer = document.getElementById('errorContainer');
  if (errorContainer) {
    errorContainer.innerHTML = `<p style="color: red; font-weight: bold;">Error: ${message}</p>`;
  } else {
    console.error('Error container not found in the DOM');
    alert(`Error: ${message}`);
  }
}

function updateElement(id: string, text: string): void {

  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function displayAnimeInformation(anime: AnimeDetails): void {

  const banner = document.getElementById('animeBannerSmall');
  if (banner) {
    banner.style.backgroundImage = `url(${anime.image})`;
  }

  updateElement('animeTitle', anime.title);
  updateElement('animeDescription', anime.description || 'No Description Available'); ;
  updateElement('animeStatus', `Status: ${anime.status || 'N/A'}`);
}