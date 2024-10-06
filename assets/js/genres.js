const API_BASE_URL = 'http://localhost:3000/anime/gogoanime';
const genresList = document.getElementById('genresList');
const selectedGenre = document.getElementById('selectedGenre');
const animeGrid = document.getElementById('animeGrid');
const paginationControls = document.createElement('div');
paginationControls.id = 'paginationControls';

let currentPage = 1;
let currentGenre = '';
let currentGenreTitle = '';


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentGenre = urlParams.get('id');
    currentGenreTitle = urlParams.get('title');
    
    if (currentGenre && currentGenreTitle) {
        fetchAnimeByGenre(currentGenre, currentGenreTitle, currentPage);
    } else {
        selectedGenre.textContent = 'No genre selected';
        animeGrid.innerHTML = '<p>Please select a genre from the home page.</p>';
    }
});

async function fetchGenres() {
    try {
        const response = await fetch(`${API_BASE_URL}/genre/list`);
        const genres = await response.json();
        displayGenres(genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
        genresList.innerHTML = '<p>Error loading genres. Please try again later.</p>';
    }
}

function displayGenres(genres) {
    genresList.innerHTML = '';
    genres.forEach(genre => {
        const genreButton = document.createElement('button');
        genreButton.textContent = genre.title;
        genreButton.addEventListener('click', () => {
            currentPage = 1;
            currentGenre = genre.id;
            fetchAnimeByGenre(genre.id, genre.title, currentPage);
        });
        genresList.appendChild(genreButton);
    });
}

async function fetchAnimeByGenre(genreId, genreTitle, page = 1) {
    try {
        const response = await fetch(`${API_BASE_URL}/genre/${genreId}?page=${page}`);
        const data = await response.json();
        selectedGenre.textContent = `${genreTitle} Anime (Page ${page})`;
        displayAnimeGrid(data.results);
        updatePaginationControls(data.hasNextPage, page);
    } catch (error) {
        console.error('Error fetching anime by genre:', error);
        animeGrid.innerHTML = '<p>Error loading anime. Please try again later.</p>';
    }
}


function displayAnimeGrid(results) {
    animeGrid.innerHTML = '';
    if (results.length === 0) {
        animeGrid.innerHTML = '<p>No results found.</p>';
        return;
    }
    results.forEach(anime => {
        const animeCard = createAnimeCard(anime);
        animeGrid.appendChild(animeCard);
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

function updatePaginationControls(hasNextPage, currentPage) {
    paginationControls.innerHTML = '';
    
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            currentPage--;
            fetchAnimeByGenre(currentGenre, selectedGenre.textContent.split('(')[0].trim(), currentPage);
        });
        paginationControls.appendChild(prevButton);
    }

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${currentPage}`;
    paginationControls.appendChild(pageInfo);

    if (hasNextPage) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            currentPage++;
            fetchAnimeByGenre(currentGenre, selectedGenre.textContent.split('(')[0].trim(), currentPage);
        });
        paginationControls.appendChild(nextButton);
    }

    // Add pagination controls to the page if not already added
    if (!document.getElementById('paginationControls')) {
        document.getElementById('genreAnime').appendChild(paginationControls);
    }
}