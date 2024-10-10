import { Anime } from '../types';

export function createAnimeCard(anime: Anime): HTMLElement {
  const card = document.createElement('div');
  card.classList.add('anime-card');
  card.innerHTML = `
    <img src="${anime.image}" alt="${anime.title}" onerror="this.src='https://via.placeholder.com/200x300'">
    <div class="anime-info">
      <h3>${anime.title}</h3>
      <p>Type: ${anime.subOrDub || 'N/A'}</p>
      <p>Status: ${anime.status || 'N/A'}</p>
    </div>
  `;
  card.addEventListener('click', () => {
    window.location.href = `animeDetails.html?id=${anime.id}`;
  });
  return card;
}