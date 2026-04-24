// TODO PROTO:book-clubs - Book Detail (ficha del libro). Prototype.
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookClubsStore } from '../../shared/services/book-clubs-store';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetail {
  private readonly store = inject(BookClubsStore);

  readonly id = input.required<string>();

  protected readonly book = computed(() => this.store.getBook(this.id()));
  protected readonly clubs = computed(() => this.store.clubsByBook(this.id()));

  protected readonly totalMembers = computed(() =>
    this.clubs().reduce((acc, c) => acc + c.memberCount, 0),
  );

  protected formatMeeting(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  }
}
