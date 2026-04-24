// TODO PROTO:book-clubs - Prototype topbar as editorial masthead with theme toggle.
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../services/theme';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Topbar {
  private readonly themeService = inject(ThemeService);

  protected readonly theme = this.themeService.theme;
  protected readonly isDark = computed(() => this.theme() === 'dark');
  protected readonly issue = 'nº04 · abril 2026';

  protected toggleTheme(): void {
    this.themeService.toggle();
  }
}
