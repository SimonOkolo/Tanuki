import { Anime } from '../types';

export function createAnimeCard(anime: Anime): HTMLElement {
  const card = document.createElement('div');
  card.classList.add('anime-card');

  if (anime.otherName) {
    card.innerHTML = `
      <img src="${anime.image}" alt="${anime.title}" onerror="this.src='https://via.placeholder.com/200x300'">
      <div class="anime-type" data-anime-id="${anime.id}"></div>
      <div class="anime-title">
        <h3>${anime.otherName}</h3>
      </div>
    `;
  } else {
    card.innerHTML = `
      <img src="${anime.image}" alt="${anime.title}" onerror="this.src='https://via.placeholder.com/200x300'">
      <div class="anime-type" data-anime-id="${anime.id}"></div>
      <div class="anime-title">
        <h3>${anime.title}</h3>
      </div>
    `;
  }

  card.addEventListener('click', () => {
    window.location.href = `animeDetails.html?id=${anime.id}`;
  });

  return card;
}