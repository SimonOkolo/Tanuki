// components/SearchBar.ts
import { Anime } from '../types';
import { searchAnime } from '../services/api';

export class SearchBar {
    private container: HTMLElement;
    private searchForm: HTMLFormElement;
    private searchInput: HTMLInputElement;
    private predictionsContainer: HTMLDivElement;
    private debounceTimeout: NodeJS.Timeout | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.searchForm = document.createElement('form');
        this.searchInput = document.createElement('input');
        this.predictionsContainer = document.createElement('div');
        this.initialize();
    }

    private initialize(): void {
        // Set up container
        this.container.className = 'search-container';
        
        // Set up form
        this.searchForm.className = 'search-form';
        
        // Set up input
        this.searchInput.type = 'text';
        this.searchInput.placeholder = 'Search anime...';
        this.searchInput.className = 'search-input';
        
        // Set up search button
        const searchButton = document.createElement('button');
        searchButton.type = 'submit';
        searchButton.className = 'search-button';
        searchButton.innerHTML = `
            <i class="fas fa-search" style="color: #666;"></i>
        `;
        
        // Set up predictions container
        this.predictionsContainer.className = 'predictions-container hidden';
        
        // Append elements
        this.searchForm.appendChild(this.searchInput);
        this.searchForm.appendChild(searchButton);
        this.container.appendChild(this.searchForm);
        this.container.appendChild(this.predictionsContainer);
        
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.searchInput.addEventListener('input', () => {
            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
            }
            
            this.debounceTimeout = setTimeout(async () => {
                const query = this.searchInput.value.trim();
                if (query) {
                    await this.updatePredictions(query);
                } else {
                    this.hidePredictions();
                }
            }, 300);
        });

        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = this.searchInput.value.trim();
            if (query) {
                window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
            }
        });

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target as Node)) {
                this.hidePredictions();
            }
        });
    }

    private async updatePredictions(query: string): Promise<void> {
        try {
            const results: Anime[] = await searchAnime(query);
            const predictions = results.slice(0, 5);
            
            this.predictionsContainer.innerHTML = '';
            
            if (predictions.length > 0) {
                predictions.forEach((anime: Anime) => {
                    const predictionElement = document.createElement('div');
                    predictionElement.className = 'prediction-item';
                    
                    predictionElement.innerHTML = `
                        <div class="prediction-background" style="background-image: url('${anime.image || '/assets/img/default-anime.png'}')"></div>
                        <div class="prediction-overlay"></div>
                        <div class="prediction-content">
                            <h3 class="prediction-title">${anime.title}</h3>
                            <div class="prediction-info">${anime.releaseDate || 'Release date unknown'}</div>
                        </div>
                    `;
                    
                    predictionElement.addEventListener('click', () => {
                        window.location.href = `/animeDetails.html?id=${anime.id}`;
                    });
                    
                    this.predictionsContainer.appendChild(predictionElement);
                });
                
                this.showPredictions();
            } else {
                this.hidePredictions();
            }
        } catch (error) {
            console.error('Search error:', error);
            this.hidePredictions();
        }
    }

    private showPredictions(): void {
        this.predictionsContainer.classList.remove('hidden');
    }

    private hidePredictions(): void {
        this.predictionsContainer.classList.add('hidden');
    }
}