const API_BASE_URL = 'http://localhost:3000/anime/gogoanime';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    if (animeId) {
        fetchAnimeDetails(animeId);
    } else {
        document.body.innerHTML = '<h1>Error: No anime ID provided</h1>';
    }
});

async function fetchAnimeDetails(animeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/info/${animeId}`);
        const animeDetails = await response.json();
        displayAnimeDetails(animeDetails);
    } catch (error) {
        console.error('Error fetching anime details:', error);
        document.body.innerHTML = '<h1>Error: Failed to fetch anime details</h1>';
    }
}

function displayAnimeDetails(anime) {
    document.title = `Tanuki - ${anime.title}`;

    const banner = document.getElementById('animeBanner');
    banner.style.backgroundImage = `url(${anime.image})`;

    document.getElementById('animeTitle').textContent = anime.title;
    document.getElementById('animeDescription').textContent = anime.description;

    document.getElementById('animeType').textContent = `Type: ${anime.subOrDub}`;
    document.getElementById('animeStatus').textContent = `Status: ${anime.status}`;
    document.getElementById('animeReleased').textContent = `Released: ${anime.releaseDate}`;
    document.getElementById('animeGenres').textContent = `Genres: ${anime.genres.join(', ')}`;

    const episodesContainer = document.getElementById('episodesContainer');
    anime.episodes.forEach(ep => {
        const li = document.createElement('li');
        li.textContent = `Episode ${ep.number}: ${ep.title || 'No title'}`;
        episodesContainer.appendChild(li);
    });
}