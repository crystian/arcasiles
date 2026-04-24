// TODO PROTO:book-clubs - Prototype theme service. Replace with real theming infra when settled.
import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'proto_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  private readonly themeSignal = signal<Theme>(this.resolveInitial());
  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    effect(() => {
      const current = this.themeSignal();
      this.doc.documentElement.setAttribute('data-theme', current);
      try {
        localStorage.setItem(STORAGE_KEY, current);
      } catch {
        // localStorage may be unavailable in some environments; ignore.
      }
    });
  }

  toggle(): void {
    this.themeSignal.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  set(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  private resolveInitial(): Theme {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // fall through
    }

    const prefersDark = this.doc.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
