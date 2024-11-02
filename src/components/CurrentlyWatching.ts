import { auth, db } from '../services/firebase';
import { collection, query, getDocs, doc } from 'firebase/firestore';
import { getAnimeDetails } from '../services/api';
import { AnimeDetails, WatchingAnime, Episode } from '../types';

export async function initCurrentlyWatching() {
  const container = document.querySelector('.watching-section');
  if (!container) return;

  try {
    const watchingList = await loadWatchingList();
    renderWatchingList(container, watchingList);
  } catch (error) {
    console.error('Error initializing currently watching:', error);
    container.innerHTML = '<p>Error loading watching list</p>';
  }
}

async function loadWatchingList(): Promise<WatchingAnime[]> {
    const user = auth.currentUser;
    if (!user) return [];
  
    const watchingRef = collection(doc(db, 'users', user.uid), 'watching');
    const watchingSnapshot = await getDocs(watchingRef);
    
    const watchingData = await Promise.all(
      watchingSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const animeDetails: AnimeDetails = await getAnimeDetails(data.animeId);
        
        return {
          animeId: data.animeId,
          episode: data.episode,
          title: animeDetails.title,
          otherName: animeDetails.otherName,
          image: animeDetails.image,
          releaseDate: animeDetails.releaseDate,
          subOrDub: animeDetails.subOrDub,
          status: animeDetails.status,
          genres: animeDetails.genres,
          episodes: animeDetails.episodes,
          timestamp: data.timestamp?.toDate() || new Date()
        } as WatchingAnime;
      })
    );
  
    return watchingData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function calculateProgress(currentEpisode: number, totalEpisodes: number): number {
  return (currentEpisode / totalEpisodes) * 100;
}

function renderWatchingList(container: Element, animeList: WatchingAnime[]) {
  container.innerHTML = `
    <h3 class="section-title">Currently Watching</h3>
    <div class="watching-grid">
      ${animeList.map(anime => createWatchingCard(anime)).join('')}
    </div>
  `;

  // Add click handlers
  container.querySelectorAll('.watching-card').forEach(card => {
    card.addEventListener('click', () => {
      const animeId = card.getAttribute('data-anime-id');
      const episodeNumber = card.getAttribute('data-episode');
      if (animeId && episodeNumber) {
        window.location.href = `episode.html?id=${animeId}&ep=${episodeNumber}`;
      }
    });
  });
}

function createWatchingCard(anime: WatchingAnime): string {
    const progress = calculateProgress(
      anime.episode.number, 
      anime.episodes?.length || 1
    );
    
    return `
      <div class="watching-card" 
           data-anime-id="${anime.animeId}" 
           data-episode="${anime.episode.number}"
           style="--bg-image: url('${anime.image}');">
        <div class="watching-card-image">
          <img src="${anime.image}" alt="${anime.title}" onerror="this.src='https://via.placeholder.com/200x300'">
        </div>
        <div class="watching-card-info">
          <h4 class="watching-card-title">${anime.title}</h4>
          <div class="watching-card-progress">
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>
            <span class="episode-count">Episode ${anime.episode.number} of ${anime.episodes?.length || '??'}</span>
          </div>
        </div>
      </div>
    `;
  }