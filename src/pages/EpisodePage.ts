import { getEpisodeServers, getStreamingLinks } from '../services/api';
import { ServerResponse } from '../types';

export async function initEpisodePage(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id');
  const episodeNumber = urlParams.get('ep');

  if (animeId && episodeNumber) {
    const episodeId = `${animeId}-episode-${episodeNumber}`;
    try {
      const servers = await getEpisodeServers(episodeId);
      displayServerOptions(servers, episodeId);
    } catch (error) {
      console.error('Error fetching episode servers:', error);
      displayError('Failed to fetch available servers. Please try again later.');
    }
  } else {
    displayError('Invalid episode information. Please check the URL.');
  }
}

function displayServerOptions(servers: string[], episodeId: string): void {
  const serviceSelector = document.getElementById('serviceSelector') as HTMLSelectElement;
  if (serviceSelector) {
    serviceSelector.innerHTML = '';
    servers.forEach(server => {
      const option = document.createElement('option');
      option.value = server;
      option.textContent = server;
      serviceSelector.appendChild(option);
    });

    serviceSelector.onchange = (ev: Event) => {
      const target = ev.target as HTMLSelectElement;
      fetchStreamingLinks(episodeId, target.value);
    };

    // Fetch streaming links for the first server by default
    if (servers.length > 0) {
      fetchStreamingLinks(episodeId, servers[0]);
    }
  }
}

async function fetchStreamingLinks(episodeId: string, serverName: string): Promise<void> {
  try {
    const data = await getStreamingLinks(episodeId, serverName);
    displayVideoPlayer(data);
  } catch (error) {
    console.error('Error fetching streaming links:', error);
    displayError('Failed to fetch streaming links. Please try another source or service.');
  }
}

function displayVideoPlayer(data: ServerResponse): void {
  const videoContainer = document.getElementById('videoContainer');
  const qualitySelector = document.getElementById('qualitySelector') as HTMLSelectElement;

  if (videoContainer && qualitySelector) {
    videoContainer.innerHTML = '';
    qualitySelector.innerHTML = '';

    if (data.sources && data.sources.length > 0) {
      const video = document.createElement('video');
      video.controls = true;
      video.style.width = '100%';
      video.style.maxWidth = '1280px';
      video.style.height = 'auto';

      // Sort sources by quality
      const sortedSources = data.sources.sort((a, b) => {
        const qualityA = parseInt(a.quality) || 0;
        const qualityB = parseInt(b.quality) || 0;
        return qualityB - qualityA;
      });

      // Add sources to video element and populate quality selector
      sortedSources.forEach(source => {
        const sourceElement = document.createElement('source');
        sourceElement.src = source.url;
        sourceElement.type = 'video/mp4';
        video.appendChild(sourceElement);

        const option = document.createElement('option');
        option.value = source.url;
        option.textContent = source.quality;
        qualitySelector.appendChild(option);
      });

      video.onerror = () => {
        displayError('Unable to load video. Please try another source or service.');
      };

      videoContainer.appendChild(video);

      qualitySelector.onchange = (ev: Event) => {
        const target = ev.target as HTMLSelectElement;
        video.src = target.value;
        video.play();
      };
    } else {
      displayError('No video sources available for this episode.');
    }
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