const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const popularAnime = document.getElementById('popularAnime');
const recentAnime = document.getElementById('recentAnime');
const moviesAnime = document.getElementById('moviesAnime');

const API_BASE_URL = 'http://localhost:3000/anime/gogoanime';

searchButton.addEventListener('click', searchAnime);

// Add event listeners for navigation arrows
document.getElementById('searchLeftArrow').addEventListener('click', () => scrollList('searchResults', -1));
document.getElementById('searchRightArrow').addEventListener('click', () => scrollList('searchResults', 1));
document.getElementById('popularLeftArrow').addEventListener('click', () => scrollList('popularAnime', -1));
document.getElementById('popularRightArrow').addEventListener('click', () => scrollList('popularAnime', 1));
document.getElementById('recentLeftArrow').addEventListener('click', () => scrollList('recentAnime', -1));
document.getElementById('recentRightArrow').addEventListener('click', () => scrollList('recentAnime', 1));
document.getElementById('moviesLeftArrow').addEventListener('click', () => scrollList('moviesAnime', -1));
document.getElementById('moviesRightArrow').addEventListener('click', () => scrollList('moviesAnime', 1));


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

async function fetchPopularAnime() {
    try {
        const response = await fetch(`${API_BASE_URL}/top-airing`);
        const data = await response.json();
        displayAnimeList(data.results, popularAnime);
    } catch (error) {
        console.error('Error fetching popular anime:', error);
        popularAnime.innerHTML = '<p>Error loading popular anime. Please try again later.</p>';
    }
}

async function fetchRecentAnime() {
    try {
        const response = await fetch(`${API_BASE_URL}/recent-episodes`);
        const data = await response.json();
        displayAnimeList(data.results, recentAnime);
    } catch (error) {
        console.error('Error fetching popular anime:', error);
        recentAnime.innerHTML = '<p>Error loading popular anime. Please try again later.</p>';
    }
}

async function fetchMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/movies`);
        const data = await response.json();
        displayAnimeList(data.results, moviesAnime);
    } catch (error) {
        console.error('Error fetching popular anime:', error);
        moviesAnime.innerHTML = '<p>Error loading popular anime. Please try again later.</p>';
    }
}

// Fetch popular anime when the page loads
fetchPopularAnime();
fetchRecentAnime();
fetchMovies();