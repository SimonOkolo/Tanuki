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

document.addEventListener('DOMContentLoaded', fetchGenres);

function isCacheValid(cacheTimestamp, maxAge = 3600000) { // maxAge default: 1 hour
    if (!cacheTimestamp) return false;
    const currentTime = new Date().getTime();
    const cacheAge = currentTime - parseInt(cacheTimestamp);
    return cacheAge < maxAge;
}

// Utility function to set cache
function setCache(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}Timestamp`, new Date().getTime().toString());
}

// Utility function to get cache
function getCache(key) {
    const data = localStorage.getItem(key);
    const timestamp = localStorage.getItem(`${key}Timestamp`);
    return { data: data ? JSON.parse(data) : null, timestamp };
}

async function fetchGenres() {
    const { data: cachedGenres, timestamp } = getCache('genres');

    if (cachedGenres && isCacheValid(timestamp)) {
        displayGenres(cachedGenres);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/genre/list`);
        const genres = await response.json();
        
        setCache('genres', genres);
        displayGenres(genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
        genresList.innerHTML = '<p>Error loading genres. Please try again later.</p>';
        
        // If there's an error, use cached data if available, even if it's old
        if (cachedGenres) {
            console.log('Using cached genres data due to fetch error');
            displayGenres(cachedGenres);
        }
    }
}


function displayGenres(genres) {
    genresList.innerHTML = '';
    genres.forEach(genre => {
        const genreLink = document.createElement('a');
        genreLink.textContent = genre.title;
        genreLink.href = `genres.html?id=${genre.id}&title=${encodeURIComponent(genre.title)}`;
        genreLink.classList.add('genre-link');
        genresList.appendChild(genreLink);
    });
}

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
    const { data: cachedData, timestamp } = getCache('topAiringAnime');

    if (cachedData && isCacheValid(timestamp)) {
        topAiringAnime = cachedData;
        updateSlide();
        createDots(); // Create dots for navigation
        startSlideshow();
        return;
    }

    document.getElementById('topAiringSkeleton').style.display = 'block';
    document.querySelector('.slideshow-container').style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/top-airing`);
        const data = await response.json();
        topAiringAnime = data.results;
        await fetchAnimeDetails(topAiringAnime);

        setCache('topAiringAnime', topAiringAnime);

        document.getElementById('topAiringSkeleton').style.display = 'none';
        document.querySelector('.slideshow-container').style.display = 'block';
        updateSlide();
        createDots(); // Create dots for navigation
        startSlideshow();
    } catch (error) {
        console.error('Error fetching top airing anime:', error);
        document.querySelector('.slideshow-container').innerHTML = '<p>Error loading top airing anime. Please try again later.</p>';
        document.getElementById('topAiringSkeleton').style.display = 'none';

        if (cachedData) {
            topAiringAnime = cachedData;
            updateSlide();
            createDots(); // Create dots for navigation
            startSlideshow();
        }
    }
}

function createDots() {
    const dotsContainer = document.getElementById('dotsContainer');
    dotsContainer.innerHTML = ''; // Clear existing dots
    topAiringAnime.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
    });
    updateActiveDot(); // Update the first dot as active
}

function showSlide(index) {
    currentSlideIndex = index;
    updateSlide();
    updateActiveDot();
}

function updateActiveDot() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
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
    updateActiveDot();
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + topAiringAnime.length) % topAiringAnime.length;
    updateSlide();
}

function startSlideshow() {
    setInterval(nextSlide, 15000);
}


// Fetch popular anime when the page loads
fetchTopAiringAnime();
fetchRecentAnime();
fetchMovies();