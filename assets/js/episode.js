const API_BASE_URL = 'https://api.consumet.org/anime/gogoanime';

let currentEpisodeId = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    const episodeNumber = urlParams.get('ep');

    if (animeId && episodeNumber) {
        currentEpisodeId = `${animeId}-episode-${episodeNumber}`;
        fetchAvailableServers(currentEpisodeId);
    } else {
        displayError('Invalid episode information. Please check the URL.');
    }
});

async function fetchAvailableServers(episodeId) {
    try {
        const url = `${API_BASE_URL}/servers/${episodeId}`;
        console.log('Fetching servers from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const servers = await response.json();
        console.log('Servers received:', servers);
        
        if (servers.length === 0) {
            throw new Error('No servers available for this episode');
        }
        
        displayServerOptions(servers);
    } catch (error) {
        console.error('Error fetching available servers:', error);
        displayError(`Failed to fetch available servers: ${error.message}`);
    }
}

function displayServerOptions(servers) {
    const serviceSelector = document.getElementById('serviceSelector');
    serviceSelector.innerHTML = '';

    servers.forEach(server => {
        const option = document.createElement('option');
        option.value = server.name;
        option.textContent = server.name;
        serviceSelector.appendChild(option);
    });

    serviceSelector.onchange = function() {
        fetchStreamingLinks(currentEpisodeId, this.value);
    };

    // Fetch streaming links for the first server by default
    if (servers.length > 0) {
        fetchStreamingLinks(currentEpisodeId, servers[0].name);
    }
}

async function fetchStreamingLinks(episodeId, serverName) {
    try {
        const url = `${API_BASE_URL}/watch/${episodeId}?server=${serverName}`;
        console.log('Fetching streaming links from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Streaming data received:', data);
        
        displayVideoPlayer(data);
    } catch (error) {
        console.error('Error fetching streaming links:', error);
        displayError(`Failed to fetch streaming links: ${error.message}`);
    }
}

function displayVideoPlayer(data) {
    const videoContainer = document.getElementById('videoContainer');
    const qualitySelector = document.getElementById('qualitySelector');

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

        video.onerror = function() {
            displayError('Unable to load video. Please try another source or service.');
        };

        videoContainer.appendChild(video);

        qualitySelector.onchange = function() {
            video.src = this.value;
            video.play();
        };
    } else {
        displayError('No video sources available for this episode.');
    }
}

function displayError(message) {
    const errorContainer = document.getElementById('videoContainer');
    errorContainer.innerHTML = `<p style="color: red; font-weight: bold;">Error: ${message}</p>`;
}