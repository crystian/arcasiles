// TODO PROTO:book-clubs - Meetings (agenda). Prototype.
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookClubsStore, Club } from '../../shared/services/book-clubs-store';

interface WeekGroup {
  key: string;
  label: string;
  range: string;
  clubs: Club[];
}

@Component({
  selector: 'app-meetings',
  imports: [RouterLink],
  templateUrl: './meetings.html',
  styleUrl: './meetings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Meetings {
  private readonly store = inject(BookClubsStore);

  protected readonly upcoming = this.store.upcomingMeetings;

  protected readonly groups = computed<WeekGroup[]>(() => {
    const byWeek = new Map<string, Club[]>();

    for (const club of this.upcoming()) {
      const d = new Date(club.nextMeeting);
      const monday = this.startOfWeek(d);
      const key = monday.toISOString().slice(0, 10);
      const list = byWeek.get(key) ?? [];
      list.push(club);
      byWeek.set(key, list);
    }

    return Array.from(byWeek.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, clubs], idx) => {
        const monday = new Date(key);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return {
          key,
          label: idx === 0 ? 'Esta semana' : idx === 1 ? 'La que viene' : `Semana ${idx + 1}`,
          range: `${this.formatDay(monday)} — ${this.formatDay(sunday)}`,
          clubs,
        };
      });
  });

  protected day(iso: string): string {
    return String(new Date(iso).getDate()).padStart(2, '0');
  }

  protected month(iso: string): string {
    return new Date(iso).toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
  }

  protected weekday(iso: string): string {
    return new Date(iso).toLocaleDateString('es-ES', { weekday: 'long' });
  }

  private formatDay(d: Date): string {
    return `${String(d.getDate()).padStart(2, '0')} ${d
      .toLocaleDateString('es-ES', { month: 'short' })
      .replace('.', '')}`;
  }

  private startOfWeek(d: Date): Date {
    const copy = new Date(d);
    const dow = copy.getDay();
    const diff = (dow + 6) % 7; // Monday-based
    copy.setDate(copy.getDate() - diff);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }
}
