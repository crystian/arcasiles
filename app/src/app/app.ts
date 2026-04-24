// TODO PROTO:book-clubs - This root shell is a prototype. Replace with real app shell when features module lands.
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer';
import { ThemeService } from './shared/services/theme';
import { Topbar } from './shared/topbar/topbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Topbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Instantiate theme service to apply data-theme ASAP.
  private readonly themeService = inject(ThemeService);

  protected readonly showChrome = signal(true);
}
