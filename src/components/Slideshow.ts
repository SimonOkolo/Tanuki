import { Anime } from '../types';
import { getTrendingAnime } from '../services/api';

export class Slideshow {
  private animeList: Anime[];
  private currentIndex: number;
  private intervalId: number | null;

  constructor(animeList: Anime[] = []) {
    this.animeList = animeList;
    this.currentIndex = 0;
    this.intervalId = null;
  }

  public async init(): Promise<void> {
    try {
        if (this.animeList.length === 0) {
            this.animeList = await getTrendingAnime();
        }
        this.updateSlide();
        this.createDots();
        this.startSlideshow();
    } catch (error) {
        console.error('Error initializing slideshow:', error);
    }
  }

  private updateSlide(): void {
    const anime = this.animeList[this.currentIndex];
    const imageElement = document.getElementById('animeImage');
    const titleElement = document.getElementById('animeTitle');
    const descriptionElement = document.getElementById('animeDescription');
    const metadataElement = document.getElementById('animeMetadata');
    const animeButton = document.getElementById('watchButton');

    if (imageElement && titleElement && descriptionElement && metadataElement) {
      // Use banner image from AniList if available
      imageElement.style.backgroundImage = `url(${anime.anilistInfo?.bannerImage || anime.image})`;
      
      // Use English title if available, fall back to original title
      titleElement.textContent = anime.anilistInfo?.title?.english || anime.title;
      
      // Use AniList description if available
      const cleanDescription = anime.description?.replace(/<[^>]*>/g, '') || 'No description available.';
      descriptionElement.textContent = cleanDescription;

      // Display additional metadata
      const metadata: string[] = [];
      if (anime.rating) metadata.push(`Score: ${anime.rating}%`);
      if (anime.season && anime.seasonYear) {
        metadata.push(`${anime.season} ${anime.seasonYear}`);
      }
      if (anime.genres && anime.genres.length > 0) {
        metadata.push(`Genres: ${anime.genres.join(', ')}`);
      }
      metadataElement.innerHTML = metadata.join(' • ');
    }


    if (animeButton && anime.id) {
      animeButton.onclick = () => window.location.href = `animeDetails.html?id=${anime.id}`;
    }
    //animeButton.onclick = () => window.location.href = `animeDetails.html?id=${anime}`;
  }

  private createDots(): void {
    const dotsContainer = document.getElementById('dotsContainer');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      this.animeList.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => this.showSlide(index));
        dotsContainer.appendChild(dot);
      });
      this.updateActiveDot();
    }
  }

  private showSlide(index: number): void {
    this.currentIndex = index;
    this.updateSlide();
    this.updateActiveDot();
  }

  private updateActiveDot(): void {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  private nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.animeList.length;
    this.updateSlide();
    this.updateActiveDot();
  }

  private startSlideshow(): void {
    this.intervalId = window.setInterval(() => this.nextSlide(), 15000);
  }

  public stopSlideshow(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }
}