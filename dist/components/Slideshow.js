export class Slideshow {
    constructor(animeList) {
        this.animeList = animeList;
        this.currentIndex = 0;
        this.intervalId = null;
    }
    init() {
        this.updateSlide();
        this.createDots();
        this.startSlideshow();
    }
    updateSlide() {
        const anime = this.animeList[this.currentIndex];
        const imageElement = document.getElementById('animeImage');
        const titleElement = document.getElementById('animeTitle');
        const descriptionElement = document.getElementById('animeDescription');
        if (imageElement && titleElement && descriptionElement) {
            imageElement.src = anime.image;
            titleElement.textContent = anime.title;
            descriptionElement.textContent = anime.description || 'No description available.';
        }
    }
    createDots() {
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
    showSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
        this.updateActiveDot();
    }
    updateActiveDot() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.animeList.length;
        this.updateSlide();
        this.updateActiveDot();
    }
    startSlideshow() {
        this.intervalId = window.setInterval(() => this.nextSlide(), 15000);
    }
    stopSlideshow() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        }
    }
}
