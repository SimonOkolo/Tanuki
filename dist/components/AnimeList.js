import { createAnimeCard } from './AnimeCard';
export function displayAnimeList(results, container) {
    container.innerHTML = '';
    if (results.length === 0) {
        container.innerHTML = '<p>No results found.</p>';
        return;
    }
    results.forEach(anime => {
        const animeCard = createAnimeCard(anime);
        container.appendChild(animeCard);
    });
}
export function setupScrollButtons(containerId) {
    const leftArrow = document.getElementById(`${containerId}LeftArrow`);
    const rightArrow = document.getElementById(`${containerId}RightArrow`);
    const container = document.getElementById(containerId);
    if (leftArrow && rightArrow && container) {
        leftArrow.addEventListener('click', () => scrollList(container, -1));
        rightArrow.addEventListener('click', () => scrollList(container, 1));
    }
}
function scrollList(element, direction) {
    const scrollAmount = element.offsetWidth * 0.8 * direction;
    element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
