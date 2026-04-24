// TODO PROTO:book-clubs - Home page (Portada del numero). Prototype.
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookClubsStore } from '../../shared/services/book-clubs-store';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly store = inject(BookClubsStore);

  protected readonly clubs = this.store.clubs;
  protected readonly featuredClub = computed(() => this.clubs()[0]);
  protected readonly secondary = computed(() => this.clubs().slice(1, 4));
  protected readonly upcoming = computed(() => this.store.upcomingMeetings().slice(0, 4));

  protected readonly genres = computed(() => {
    const counts = new Map<string, number>();
    for (const club of this.clubs()) {
      for (const genre of club.genres) {
        counts.set(genre, (counts.get(genre) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  });

  protected readonly totalClubs = computed(() => this.clubs().length);
  protected readonly totalMembers = computed(() =>
    this.clubs().reduce((acc, c) => acc + c.memberCount, 0),
  );

  protected readonly bookIdFor = (title: string, author: string): string =>
    this.store.bookIdFor(title, author);

  protected formatMeeting(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  protected meetingDay(iso: string): string {
    return String(new Date(iso).getDate()).padStart(2, '0');
  }

  protected meetingMonth(iso: string): string {
    return new Date(iso).toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
  }

  protected coverVariant(index: number): string {
    const variants = ['cover-coral', 'cover-lime', 'cover-violet', 'cover-ink'];
    return variants[index % variants.length];
  }
}
