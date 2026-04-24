// TODO PROTO:book-clubs - Me (Mi archivo). Prototype profile + memberships.
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AVAILABLE_GENRES, BookClubsStore } from '../../shared/services/book-clubs-store';

@Component({
  selector: 'app-me',
  imports: [FormsModule, RouterLink],
  templateUrl: './me.html',
  styleUrl: './me.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Me {
  private readonly store = inject(BookClubsStore);

  protected readonly availableGenres = AVAILABLE_GENRES;

  protected readonly name = signal<string>(this.store.profile().name);
  protected readonly favoriteBooks = signal<string[]>([...this.store.profile().favoriteBooks]);
  protected readonly genres = signal<string[]>([...this.store.profile().genres]);
  protected readonly newBookDraft = signal<string>('');
  protected readonly savedFlash = signal<boolean>(false);

  protected readonly joinedCount = this.store.joinedCount;
  protected readonly joinedClubs = this.store.joinedClubs;
  protected readonly hasProfile = computed(
    () => this.name().trim().length > 0 || this.favoriteBooks().length > 0,
  );

  protected readonly displayName = computed(() => this.name().trim() || 'Suscriptor/a');

  protected addBook(): void {
    const value = this.newBookDraft().trim();
    if (!value) return;
    this.favoriteBooks.update((books) => (books.includes(value) ? books : [...books, value]));
    this.newBookDraft.set('');
  }

  protected removeBook(book: string): void {
    this.favoriteBooks.update((books) => books.filter((b) => b !== book));
  }

  protected toggleGenre(genre: string): void {
    this.genres.update((current) =>
      current.includes(genre) ? current.filter((g) => g !== genre) : [...current, genre],
    );
  }

  protected hasGenre(genre: string): boolean {
    return this.genres().includes(genre);
  }

  protected save(): void {
    // TODO PROTO:book-clubs - Replace with real profile update API call.
    this.store.updateProfile({
      name: this.name().trim(),
      favoriteBooks: this.favoriteBooks(),
      genres: this.genres(),
    });
    this.savedFlash.set(true);
    setTimeout(() => this.savedFlash.set(false), 1800);
  }

  protected formatMeeting(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
}
