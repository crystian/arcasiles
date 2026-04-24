// TODO PROTO:book-clubs - Club Detail as editorial article. Prototype.
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookClubsStore } from '../../shared/services/book-clubs-store';

@Component({
  selector: 'app-club-detail',
  imports: [RouterLink],
  templateUrl: './club-detail.html',
  styleUrl: './club-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubDetail {
  private readonly store = inject(BookClubsStore);

  readonly id = input.required<string>();

  protected readonly club = computed(() => this.store.getClub(this.id()));
  protected readonly isMember = computed(() => this.store.isMember(this.id()));
  protected readonly related = computed(() => this.store.relatedClubs(this.id(), 3));

  protected readonly bookId = computed(() => {
    const c = this.club();
    if (!c) return '';
    return this.store.bookIdFor(c.currentBook.title, c.currentBook.author);
  });

  protected readonly formattedDate = computed(() => {
    const club = this.club();
    if (!club) return '';
    return new Date(club.nextMeeting).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  });

  protected readonly meetingDay = computed(() => {
    const c = this.club();
    if (!c) return '';
    return String(new Date(c.nextMeeting).getDate()).padStart(2, '0');
  });

  protected readonly meetingMonth = computed(() => {
    const c = this.club();
    if (!c) return '';
    return new Date(c.nextMeeting).toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
  });

  protected toggleMembership(): void {
    this.store.toggleMembership(this.id());
  }

  protected formatShort(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
}
