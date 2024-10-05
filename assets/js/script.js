const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const popularAnime = document.getElementById('popularAnime');
const recentAnime = document.getElementById('recentAnime');
const moviesAnime = document.getElementById('moviesAnime');

const API_BASE_URL = 'http://localhost:3000/anime/gogoanime';

// Add event listeners for navigation arrows
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

let topAiringAnime = [];
let currentSlideIndex = 0;


async function fetchTopAiringAnime() {
    try {
        const response = await fetch(`${API_BASE_URL}/top-airing`);
        const data = await response.json();
        topAiringAnime = data.results;
        await fetchAnimeDetails(topAiringAnime);
        updateSlide();
        startSlideshow();
    } catch (error) {
        console.error('Error fetching top airing anime:', error);
        document.querySelector('.slideshow-container').innerHTML = '<p>Error loading top airing anime. Please try again later.</p>';
    }
}

async function fetchAnimeDetails(animeList) {
    for (let anime of animeList) {
        try {
            const response = await fetch(`${API_BASE_URL}/info/${anime.id}`);
            const data = await response.json();
            anime.description = data.description || "No description available.";
        } catch (error) {
            console.error(`Error fetching details for ${anime.title}:`, error);
            anime.description = "Unable to load description.";
        }
    }
}

function updateSlide() {
    const anime = topAiringAnime[currentSlideIndex];
    document.getElementById('animeImage').src = anime.image;
    document.getElementById('animeTitle').textContent = anime.title;
    document.getElementById('animeDescription').textContent = anime.description;
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % topAiringAnime.length;
    updateSlide();
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + topAiringAnime.length) % topAiringAnime.length;
    updateSlide();
}

function startSlideshow() {
    setInterval(nextSlide, 15000);
}


document.getElementById('nextSlide').addEventListener('click', nextSlide);
document.getElementById('prevSlide').addEventListener('click', prevSlide);

// Fetch popular anime when the page loads
fetchTopAiringAnime();
fetchRecentAnime();
fetchMovies();