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
  // Use AniList banner if available, fallback to GoGoAnime image
  const bannerImage = anime.anilistInfo?.cover || anime.anilistInfo?.image || anime.image;
  
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
      <a href="https://myanimelist.net/anime/${anime.anilistInfo.malId}" target="_blank">MAL Link</a>
    `;
  }

  displayCharacters(anime);

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
    vaImg.src = vaImage.large;
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
