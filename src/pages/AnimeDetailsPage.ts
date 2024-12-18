import { getAniListInfo, getAnimeDetails, searchAnime } from '../services/api';
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
  // Use AniList banner if available, fallback to GoGoAnime image
  const bannerImage = anime.anilistInfo?.cover || anime.anilistInfo?.image || anime.image;
  const clearLogoArtwork = anime.anilistInfo?.artwork?.find(art => art.type === 'clear_logo');
  const titleElement = document.getElementById('animeTitle');

  
  const banner = document.getElementById('animeDetailsTop');
  const image = document.getElementById('animeBanner')
  if (banner && image) {
    banner.style.backgroundImage = `url(${bannerImage})`;
    image.style.backgroundImage = `url(${anime.image})`;
  }

  if (clearLogoArtwork && titleElement) {
    // If clear logo exists, create an img element to display it
    const clearLogoImg = document.createElement('img');
    clearLogoImg.src = clearLogoArtwork.img;
    clearLogoImg.alt = 'Anime Logo';

    titleElement.innerHTML = '';
    titleElement.appendChild(clearLogoImg);
  } else if (titleElement && anime.anilistInfo) {

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
      `${anime.anilistInfo.season}` : 
      (anime.releaseDate || 'N/A')
  }`);

  updateElement('animeGenres', `Genres: ${
    anime.anilistInfo?.genres?.join(', ') || 
    anime.genres?.join(', ') || 
    'N/A'
  }`);

  const extraDetailsEl = document.getElementById('animeExtraDetails');
  if (extraDetailsEl && anime.anilistInfo) {
    extraDetailsEl.innerHTML += `
      <p>Rating: ${anime.anilistInfo.rating / 10}/10</p>
      <p>Popularity: ${anime.anilistInfo.popularity}</p>
      ${anime.anilistInfo.studios?.length ? 
        `<p>Studios: ${anime.anilistInfo.studios.join(', ')}</p>` : 
        ''
      }
      <a href="https://myanimelist.net/anime/${anime.anilistInfo.malId}" target="_blank">MAL Link</a>
    `;
  }

  displayTrailers(anime);
  displayCharacters(anime);
  displayRecommendations(anime);
  // Preserve original episode display logic
  displayEpisodes(anime.episodes, anime.id);
}

function updateElement(id: string, text: string): void {
  const element = document.getElementById(id);
  if (element) {
    // Clean the HTML string to prevent XSS (Cross-Site Scripting)
    const sanitizedHtml = text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/on\w+="[^"]*"/g, ''); // Remove event handlers
      
    // Set the innerHTML instead of textContent
    element.innerHTML = sanitizedHtml;
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

function displayTrailers(anime: AnimeDetails): void {
  const trailersContainer = document.getElementById('trailers')
  if (!trailersContainer || !anime.anilistInfo?.trailer) {
    console.log('Character data:', anime.anilistInfo?.trailer);
    console.log('Missing container or character data');
    return;
  }
  trailersContainer.innerHTML = '';

  const trailerSectionTitle = document.createElement('h2');
  trailerSectionTitle.textContent = 'Trailers';
  trailerSectionTitle.style.cssText = 'margin: 2rem 0 1rem; color: #fff; font-size: 1.5rem;';
  trailersContainer.appendChild(trailerSectionTitle);

  const trailerList = document.createElement('div');
  trailerList.className = 'trailer-list';
  trailerList.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `;

  const youtubeId = anime.anilistInfo.trailer.id;
  const thumbnail = anime.anilistInfo.trailer.thumbnail;

  // Create trailer container
  const trailerContainer = document.createElement('div');
  trailerContainer.className = 'trailer-container';
  trailerContainer.style.cssText = `
    padding: 1rem;
    position: relative;
    cursor: pointer;
    max-width: 300px;
    width: 100%;
  `;

  // Create thumbnail image
  const thumbnailImg = document.createElement('img');
  thumbnailImg.src = thumbnail;
  thumbnailImg.alt = 'Trailer thumbnail';
  thumbnailImg.style.cssText = `
    width: 100%;
    height: auto;
    border-radius: 8px;
  `;

  // Create play button overlay
  const playButton = document.createElement('div');
  playButton.className = 'play-button';
  playButton.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // Add play icon
  playButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M8 5v14l11-7z"/>
    </svg>
  `;

  // Add click handler to open YouTube video
  trailerContainer.addEventListener('click', () => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  });

  // Assemble the trailer container
  trailerContainer.appendChild(thumbnailImg);
  trailerContainer.appendChild(playButton);
  trailerList.appendChild(trailerContainer);
  trailersContainer.appendChild(trailerList);
}

function displayCharacters(anime: AnimeDetails): void {
  const charactersContainer = document.getElementById('charactersSection');
  if (!charactersContainer || !anime.anilistInfo?.characters) {
    console.log('Character data:', anime.anilistInfo?.characters);
    console.log('Missing container or character data');
    return;
  }

  // Clear existing content
  charactersContainer.innerHTML = '';

  // Create section title
  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = 'Characters & Voice Actors';
  sectionTitle.style.cssText = 'margin: 2rem 0 1rem; color: #fff; font-size: 1.5rem;';
  charactersContainer.appendChild(sectionTitle);

  // Create character list container
  const characterList = document.createElement('div');
  characterList.className = 'character-list';
  characterList.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `;

  // Limit the list to 6 characters
  anime.anilistInfo.characters.slice(0, 6).forEach(character => {
    if (!character || !character.name) return;

    // Find Japanese voice actor
    const japaneseVA = character.voiceActors?.find(va => va?.language === 'Japanese');
    if (!japaneseVA) return; // Skip if no Japanese VA is found

    // Character and VA data
    const characterImage = character.image;
    const characterName = character.name.full || character.name.native;
    const characterRole = character.role || 'Unknown Role';

    const vaImage = japaneseVA.image;
    const vaName = japaneseVA.name.full || japaneseVA.name.native;

    // Create a row for character and VA
    const characterRow = document.createElement('div');
    characterRow.className = 'character-row';
    characterRow.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.5rem 1rem;
      gap: 1rem;
    `;

    // Character section
    const characterSection = document.createElement('div');
    characterSection.className = 'character-section';
    characterSection.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.75rem;
    `;

    // Character image
    const characterImg = document.createElement('img');
    characterImg.src = characterImage;
    characterImg.alt = characterName;
    characterImg.style.cssText = `
      width: 50px;
      height: 70px;
      object-fit: cover;
      border-radius: 8px;
    `;

    // Character info
    const characterInfo = document.createElement('div');
    characterInfo.innerHTML = `
      <h3 style="margin: 0; font-size: 0.875rem; color: #fff;">${characterName}</h3>
      <p style="margin: 0; font-size: 0.75rem; color: rgba(255, 255, 255, 0.7);">${characterRole}</p>
    `;

    characterSection.appendChild(characterImg);
    characterSection.appendChild(characterInfo);

    // VA section
    const vaSection = document.createElement('div');
    vaSection.className = 'va-section';
    vaSection.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `;

    const vaImg = document.createElement('img');
    vaImg.src = vaImage;
    vaImg.alt = vaName;
    vaImg.style.cssText = `
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.5);
    `;

    const vaInfo = document.createElement('div');
    vaInfo.innerHTML = `
      <p style="margin: 0; font-size: 0.75rem; color: #fff;">${vaName}</p>
      <p style="margin: 0; font-size: 0.7rem; color: rgba(255, 255, 255, 0.7);">Voice Actor</p>
    `;

    vaSection.appendChild(vaImg);
    vaSection.appendChild(vaInfo);

    // Add character and VA sections to row
    characterRow.appendChild(characterSection);
    characterRow.appendChild(vaSection);

    // Append row to the character list
    characterList.appendChild(characterRow);
  });

  // Append the list to the container
  charactersContainer.appendChild(characterList);
}

async function displayRecommendations(anime: AnimeDetails): Promise<void> {
  const recContainer = document.getElementById('reccomended');
  if (!recContainer || !anime.anilistInfo?.recommendations) {
    return;
  }

  // Clear existing content
  recContainer.innerHTML = '';

  // Add section title
  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = 'Recommended Anime';
  sectionTitle.style.cssText = 'margin: 2rem 0 1rem; color: #fff; font-size: 1.5rem;';
  recContainer.appendChild(sectionTitle);

  // Create recommendations container
  const recList = document.createElement('div');
  recList.className = 'recommendations-list';
  recList.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: flex-start;
  `;

  // Limit recommendations to 6
  const recommendationPromises = anime.anilistInfo.recommendations
    .slice(0, 6)
    .map(async (rec) => {
      try {
        // Search for the recommended anime in GoGoAnime using its AniList title
        const searchResults = await searchAnime(rec.title.english || rec.title.romaji);
        
        // If search results are found, return the first matching anime
        if (searchResults && searchResults.length > 0) {
          return searchResults[0];
        }
        
        // If no direct match, return null to be filtered out
        return null;
      } catch (error) {
        console.warn(`Could not find GoGoAnime match for recommendation: ${rec.title.english}`, error);
        return null;
      }
    });

  try {
    // Resolve all recommendation searches
    const recommendations = await Promise.all(recommendationPromises);
    
    // Filter out null results
    const validRecommendations = recommendations.filter((rec): rec is AnimeDetails => rec !== null);

    // If no recommendations found, don't render anything
    if (validRecommendations.length === 0) {
      return;
    }

    // Create cards for valid recommendations
    validRecommendations.forEach(recAnime => {
      const recCard = document.createElement('div');
      recCard.className = 'recommendation-card';
      recCard.style.cssText = `
        cursor: pointer;
        flex: 0 0 auto;
        width: 171px;
        height: 261px;
        margin-right: 1rem;
        position: relative;
        overflow: hidden;
        border-radius: 4px;
        box-shadow: 0 4px 6px #0000001a;
        transition: transform .3s ease, box-shadow .3s ease;
      `;

      recCard.innerHTML = `
        <img src="${recAnime.image}" alt="${recAnime.title}" style="width: 100%; height: auto; border-radius: 8px;">
        <div class="recommendation-title" style="height: auto;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #1e1e1e;
          color: #fff;
          padding: 0.5rem;
          transition: background-color 0.5s ease, height 0.5s ease;">
          ${recAnime.title}
        </div>
      `;

      recCard.addEventListener('click', () => {
        window.location.href = `animeDetails.html?id=${recAnime.id}`;
      });

      recCard.addEventListener('mouseenter', () => {
        recCard.style.transform = 'scale(1.05)';
      });

      recCard.addEventListener('mouseleave', () => {
        recCard.style.transform = 'scale(1)';
      });

      recList.appendChild(recCard);
    });

    recContainer.appendChild(recList);
  } catch (error) {
    console.error('Error processing recommendations:', error);
  }
}
