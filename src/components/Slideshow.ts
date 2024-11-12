import { Anime } from '../types';
import { getTopAiringWithDetails } from '../services/api';

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
        this.animeList = await getTopAiringWithDetails();
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
    const animeButton = document.getElementById('watchButton');

    if (imageElement && titleElement && descriptionElement) {
        imageElement.style.backgroundImage = `url(${anime.image})`;
        if (anime.otherName) {
          titleElement.textContent = anime.otherName;
        } else {
          titleElement.textContent = anime.title;
        }
        
        descriptionElement.textContent = anime.description || 'No description available.';
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