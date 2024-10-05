const API_BASE_URL = 'http://localhost:3000/anime/gogoanime';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

document.getElementById('searchLeftArrow').addEventListener('click', () => scrollList('searchResults', -1));
document.getElementById('searchRightArrow').addEventListener('click', () => scrollList('searchResults', 1));

searchButton.addEventListener('click', searchAnime);

function scrollList(elementId, direction) {
    const element = document.getElementById(elementId);
    const scrollAmount = element.offsetWidth * 0.8 * direction;
    element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

async function searchAnime() {
    const query = searchInput.value.trim();
    if (query.length === 0) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${query}`);
        const data = await response.json();
        displayAnimeList(data.results, searchResults);
    } catch (error) {
        console.error('Error searching anime:', error);
        searchResults.innerHTML = '<p>Error searching for anime. Please try again.</p>';
    }
}

function displayAnimeList(results, container) {
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

function createAnimeCard(anime) {
    const card = document.createElement('div');
    card.classList.add('anime-card');
    card.innerHTML = `
        <img src="${anime.image}" alt="${anime.title}" onerror="this.src='https://via.placeholder.com/200x300'">
        <div class="anime-info">
            <h3>${anime.title}</h3>
            <p>Type: ${anime.subOrDub}</p>
            <p>Status: ${anime.status}</p>
        </div>
    `;
    card.addEventListener('click', () => {
        window.location.href = `animeDetails.html?id=${anime.id}`;
    });
    return card;
}