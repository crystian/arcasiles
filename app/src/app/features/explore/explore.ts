// TODO PROTO:book-clubs - Explore (Indice). Prototype.
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookClubsStore, Modality } from '../../shared/services/book-clubs-store';

type Filter = 'all' | Modality;
type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-explore',
  imports: [FormsModule, RouterLink],
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Explore {
  private readonly store = inject(BookClubsStore);

  protected readonly filter = signal<Filter>('all');
  protected readonly query = signal<string>('');
  protected readonly view = signal<ViewMode>('grid');

  protected readonly clubs = computed(() => {
    const term = this.query().trim().toLowerCase();
    const mode = this.filter();
    return this.store.clubs().filter((club) => {
      if (mode !== 'all' && club.modality !== mode) return false;
      if (!term) return true;
      const haystack = [
        club.name,
        club.currentBook.title,
        club.currentBook.author,
        club.city ?? '',
        club.genres.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  });

  protected readonly joinedCount = this.store.joinedCount;

  protected setFilter(filter: Filter): void {
    this.filter.set(filter);
  }

  protected setView(view: ViewMode): void {
    this.view.set(view);
  }

  protected isMember(id: string): boolean {
    return this.store.isMember(id);
  }

  protected formatMeeting(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  }

  protected coverVariant(index: number): string {
    const variants = ['cover-coral', 'cover-lime', 'cover-violet', 'cover-ink'];
    return variants[index % variants.length];
  }
}
