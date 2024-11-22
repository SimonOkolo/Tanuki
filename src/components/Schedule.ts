import { getSchedule } from '../services/api';

interface ScheduleAnime {
  id: number;
  title: {
    english: string;
    romaji: string;
  };
  image: string;
  airingAt: number;
  episode: number;
}

export class Schedule {
  private container: HTMLElement;
  private schedule: ScheduleAnime[] = [];
  private selectedDay: number = 0;
  private updateInterval: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  async init(): Promise<void> {
    try {
      await this.loadSchedule();
      this.render();
      this.startCountdownUpdates();
    } catch (error) {
      console.error('Error initializing schedule:', error);
      this.container.innerHTML = '<p>Failed to load schedule</p>';
    }
  }

  private async loadSchedule(): Promise<void> {
    const data = await getSchedule();
    this.schedule = data;
  }

  private getDayName(dayOffset: number): string {
    const days = ['Today', 'Tomorrow'];
    for (let i = 2; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'long' }));
    }
    return days[dayOffset];
  }

  private getAnimeForDay(dayOffset: number): ScheduleAnime[] {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    startOfDay.setDate(startOfDay.getDate() + dayOffset);
    
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    return this.schedule.filter(anime => {
      const airingDate = new Date(anime.airingAt * 1000);
      return airingDate >= startOfDay && airingDate <= endOfDay;
    });
  }

  private getCountdown(airingAt: number): string {
    const now = Date.now() / 1000;
    const timeLeft = airingAt - now;
    
    if (timeLeft <= 0) return 'Aired';
    
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  private startCountdownUpdates(): void {
    // Update countdowns every minute
    this.updateInterval = window.setInterval(() => {
      const countdowns = this.container.querySelectorAll('.countdown');
      countdowns.forEach(countdown => {
        const airingAt = parseInt(countdown.getAttribute('data-airing-at') || '0');
        countdown.textContent = this.getCountdown(airingAt);
      });
    }, 60000);
  }

  private render(): void {
    // Create navigation
    const nav = document.createElement('div');
    nav.className = 'schedule-nav';
    
    for (let i = 0; i < 7; i++) {
      const button = document.createElement('button');
      button.textContent = this.getDayName(i);
      button.className = i === this.selectedDay ? 'active' : '';
      button.addEventListener('click', () => {
        this.selectedDay = i;
        this.render();
      });
      nav.appendChild(button);
    }

    // Create schedule grid
    const grid = document.createElement('div');
    grid.className = 'schedule-grid';

    const animeForDay = this.getAnimeForDay(this.selectedDay);
    
    if (animeForDay.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = 'No anime scheduled for this day';
      grid.appendChild(emptyMessage);
    } else {
      animeForDay.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'schedule-card';
        
        card.innerHTML = `
            <div class="schedule-card-image">
                <img src="${anime.image}" alt="${anime.title.english || anime.title.romaji}">
            </div>
            <div class="schedule-card-info">
                <h3>${anime.title.english || anime.title.romaji}</h3>
                <div class="countdown" data-airing-at="${anime.airingAt}">
                ${this.getCountdown(anime.airingAt)}
                </div>
            </div>
        `;

        // Add click event for the details button
        const detailsButton = card.querySelector('.details-button') as HTMLButtonElement;
        if (detailsButton) {
          detailsButton.addEventListener('click', () => {
            window.location.href = `/anime/${anime.id}`;
          });
        }

        grid.appendChild(card);
      });
    }

    // Update container
    this.container.innerHTML = '';
    this.container.appendChild(nav);
    this.container.appendChild(grid);
  }

  public destroy(): void {
    if (this.updateInterval) {
      window.clearInterval(this.updateInterval);
    }
  }
}