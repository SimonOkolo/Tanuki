import { getEpisodeServers, getAnimeDetails } from '../services/api';
import { ServerInfo } from '../types';

export async function initEpisodePage(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id');
  const episodeNumber = urlParams.get('ep');

  if (animeId && episodeNumber) {
    try {
      const animeDetails = await getAnimeDetails(animeId);
      populateEpisodesList(animeDetails, animeId, parseInt(episodeNumber));
      
      const episodeId = `${animeId}-episode-${episodeNumber}`;
      const servers = await getEpisodeServers(episodeId);
      console.log('Available servers:', servers);
      displayServerOptions(servers);
    } catch (error) {
      console.error('Error initializing episode page:', error);
      displayError('Failed to load episode information. Please try again later.');
    }
  } else {
    displayError('Invalid episode information. Please check the URL.');
  }
}

function populateEpisodesList(animeDetails: any, animeId: string, currentEpisode: number): void {
  const episodesContainer = document.getElementById('episodes');
  if (episodesContainer && animeDetails.episodes) {
    episodesContainer.innerHTML = ''; // Clear existing content
    animeDetails.episodes.forEach((episode: any) => {
      const button = document.createElement('button');
      button.textContent = `Episode ${episode.number}`;
      button.classList.add('episode-button');
      if (episode.number === currentEpisode) {
        button.classList.add('current-episode');
      }
      button.addEventListener('click', () => {
        window.location.href = `episode.html?id=${animeId}&ep=${episode.number}`;
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