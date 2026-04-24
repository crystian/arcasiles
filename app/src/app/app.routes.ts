// TODO PROTO:book-clubs - Prototype routes. Replace with real feature-module routing when lands.
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'explore',
    loadComponent: () => import('./features/explore/explore').then((m) => m.Explore),
  },
  {
    path: 'clubs/:id',
    loadComponent: () => import('./features/club-detail/club-detail').then((m) => m.ClubDetail),
    data: { bindToComponentInputs: true },
  },
  {
    path: 'books/:id',
    loadComponent: () => import('./features/book-detail/book-detail').then((m) => m.BookDetail),
    data: { bindToComponentInputs: true },
  },
  {
    path: 'meetings',
    loadComponent: () => import('./features/meetings/meetings').then((m) => m.Meetings),
  },
  {
    path: 'me',
    loadComponent: () => import('./features/me/me').then((m) => m.Me),
  },
  // Legacy prototype aliases.
  { path: 'club/:id', redirectTo: 'clubs/:id' },
  { path: 'profile', redirectTo: 'me' },
  { path: '**', redirectTo: '' },
];
