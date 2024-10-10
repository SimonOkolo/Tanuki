var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getEpisodeServers, getStreamingLinks } from '../services/api.j';
export function initEpisodePage() {
    return __awaiter(this, void 0, void 0, function* () {
        const urlParams = new URLSearchParams(window.location.search);
        const animeId = urlParams.get('id');
        const episodeNumber = urlParams.get('ep');
        if (animeId && episodeNumber) {
            const episodeId = `${animeId}-episode-${episodeNumber}`;
            try {
                const servers = yield getEpisodeServers(episodeId);
                displayServerOptions(servers, episodeId);
            }
            catch (error) {
                console.error('Error fetching episode servers:', error);
                displayError('Failed to fetch available servers. Please try again later.');
            }
        }
        else {
            displayError('Invalid episode information. Please check the URL.');
        }
    });
}
function displayServerOptions(servers, episodeId) {
    const serviceSelector = document.getElementById('serviceSelector');
    if (serviceSelector) {
        serviceSelector.innerHTML = '';
        servers.forEach(server => {
            const option = document.createElement('option');
            option.value = server;
            option.textContent = server;
            serviceSelector.appendChild(option);
        });
        serviceSelector.onchange = function () {
            fetchStreamingLinks(episodeId, this.value);
        };
        // Fetch streaming links for the first server by default
        if (servers.length > 0) {
            fetchStreamingLinks(episodeId, servers[0]);
        }
    }
}
function fetchStreamingLinks(episodeId, serverName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield getStreamingLinks(episodeId, serverName);
            displayVideoPlayer(data);
        }
        catch (error) {
            console.error('Error fetching streaming links:', error);
            displayError('Failed to fetch streaming links. Please try another source or service.');
        }
    });
}
function displayVideoPlayer(data) {
    const videoContainer = document.getElementById('videoContainer');
    const qualitySelector = document.getElementById('qualitySelector');
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
            video.onerror = function () {
                displayError('Unable to load video. Please try another source or service.');
            };
            videoContainer.appendChild(video);
            qualitySelector.onchange = function () {
                video.src = this.value;
                video.play();
            };
        }
        else {
            displayError('No video sources available for this episode.');
        }
    }
}
function displayError(message) {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.innerHTML = `<p style="color: red; font-weight: bold;">Error: ${message}</p>`;
    }
    else {
        console.error('Error container not found in the DOM');
        alert(`Error: ${message}`);
    }
}
