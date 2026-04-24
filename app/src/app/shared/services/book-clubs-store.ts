// TODO PROTO:book-clubs - This entire service is a prototype store. Replace with real BookClubsService backed by API.
import { Injectable, computed, signal } from '@angular/core';

export type Modality = 'presencial' | 'online';

export interface Club {
  id: string;
  name: string;
  modality: Modality;
  city: string | null;
  venue: string | null;
  description: string;
  currentBook: { title: string; author: string };
  nextMeeting: string; // ISO date
  memberCount: number;
  genres: string[];
  vibe: string;
}

export interface Profile {
  name: string;
  favoriteBooks: string[];
  genres: string[];
}

const SEED_VERSION = 'v1';
const KEY_VERSION = 'proto_seed_version';
const KEY_CLUBS = 'proto_book_clubs';
const KEY_PROFILE = 'proto_profile';
const KEY_MEMBERSHIPS = 'proto_memberships';

const SEED_CLUBS: Club[] = [
  {
    id: 'c1',
    name: 'Cafe Comercial Lectores',
    modality: 'presencial',
    city: 'Madrid',
    venue: 'Cafe Comercial, Glorieta de Bilbao',
    description: 'Grupo tranquilo, conversacion pausada y mucha literatura latinoamericana. Nos juntamos cada dos semanas despues del trabajo.',
    currentBook: { title: 'Los detectives salvajes', author: 'Roberto Bolano' },
    nextMeeting: '2026-05-07',
    memberCount: 12,
    genres: ['Novela', 'Latinoamericana'],
    vibe: 'Pausado y bohemio',
  },
  {
    id: 'c2',
    name: 'Malasana Book Club',
    modality: 'presencial',
    city: 'Madrid',
    venue: 'La Libre de Malasana',
    description: 'Lectura joven y curiosa, mezcla novela actual con ensayo breve. Cervezas despues, siempre.',
    currentBook: { title: 'Las malas', author: 'Camila Sosa Villada' },
    nextMeeting: '2026-05-03',
    memberCount: 18,
    genres: ['Novela contemporanea', 'Ensayo'],
    vibe: 'Joven y social',
  },
  {
    id: 'c3',
    name: 'Ciencia Ficcion Madrid',
    modality: 'presencial',
    city: 'Madrid',
    venue: 'Biblioteca Eugenio Trias, Retiro',
    description: 'Fans de sci-fi y futuros posibles. Leemos un clasico y un actual cada mes para comparar.',
    currentBook: { title: 'El problema de los tres cuerpos', author: 'Cixin Liu' },
    nextMeeting: '2026-05-11',
    memberCount: 24,
    genres: ['Ciencia ficcion'],
    vibe: 'Nerd amistoso',
  },
  {
    id: 'c4',
    name: 'Lavapies Lee Poesia',
    modality: 'presencial',
    city: 'Madrid',
    venue: 'La Tabacalera',
    description: 'Poesia contemporanea en voz alta. Cada quien trae un poema ademas del libro del mes.',
    currentBook: { title: 'Poeta chileno', author: 'Alejandro Zambra' },
    nextMeeting: '2026-05-09',
    memberCount: 9,
    genres: ['Poesia'],
    vibe: 'Intimo y sensible',
  },
  {
    id: 'c5',
    name: 'True Crime Readers',
    modality: 'online',
    city: null,
    venue: null,
    description: 'Leemos cronica negra y no ficcion criminal. Debate sin golpes bajos, con respeto por las victimas.',
    currentBook: { title: 'A sangre fria', author: 'Truman Capote' },
    nextMeeting: '2026-05-05',
    memberCount: 41,
    genres: ['No ficcion', 'Cronica'],
    vibe: 'Analitico',
  },
  {
    id: 'c6',
    name: 'Fantasia Ibericaa',
    modality: 'online',
    city: null,
    venue: null,
    description: 'Fantasia epica y urbana en espanol. Voces iberoamericanas tienen prioridad, pero leemos de todo.',
    currentBook: { title: 'La casa de los espiritus', author: 'Isabel Allende' },
    nextMeeting: '2026-05-12',
    memberCount: 33,
    genres: ['Fantasia'],
    vibe: 'Enthusiasta',
  },
  {
    id: 'c7',
    name: 'Club Feminista de Lectura',
    modality: 'presencial',
    city: 'Madrid',
    venue: 'Traficantes de Suenos, centro',
    description: 'Autoras mujeres y disidencias. Alternamos ficcion y ensayo politico. Espacio seguro y con humor.',
    currentBook: { title: 'Los hombres me explican cosas', author: 'Rebecca Solnit' },
    nextMeeting: '2026-05-10',
    memberCount: 22,
    genres: ['Ensayo', 'Novela'],
    vibe: 'Critico y calido',
  },
  {
    id: 'c8',
    name: 'Clasicos a tu aire',
    modality: 'online',
    city: null,
    venue: null,
    description: 'Clasicos de todas las epocas leidos sin pretensiones. Ideal si nunca te animaste con los grandes.',
    currentBook: { title: 'Anna Karenina', author: 'Leon Tolstoi' },
    nextMeeting: '2026-05-06',
    memberCount: 58,
    genres: ['Clasicos'],
    vibe: 'Relajado',
  },
];

const DEFAULT_PROFILE: Profile = {
  name: '',
  favoriteBooks: [],
  genres: [],
};

export const AVAILABLE_GENRES = [
  'Novela',
  'Novela contemporanea',
  'Poesia',
  'Ensayo',
  'Ciencia ficcion',
  'Fantasia',
  'No ficcion',
  'Cronica',
  'Clasicos',
  'Latinoamericana',
];

@Injectable({ providedIn: 'root' })
export class BookClubsStore {
  private readonly clubsSignal = signal<Club[]>([]);
  private readonly profileSignal = signal<Profile>({ ...DEFAULT_PROFILE });
  private readonly membershipsSignal = signal<Set<string>>(new Set());

  readonly clubs = this.clubsSignal.asReadonly();
  readonly profile = this.profileSignal.asReadonly();
  readonly memberships = this.membershipsSignal.asReadonly();
  readonly joinedCount = computed(() => this.membershipsSignal().size);

  readonly joinedClubs = computed(() =>
    this.clubsSignal().filter((club) => this.membershipsSignal().has(club.id)),
  );

  readonly upcomingMeetings = computed(() => {
    const todayIso = new Date().toISOString().slice(0, 10);
    return this.clubsSignal()
      .filter((club) => club.nextMeeting >= todayIso)
      .sort((a, b) => a.nextMeeting.localeCompare(b.nextMeeting));
  });

  readonly allBooks = computed(() => {
    const seen = new Map<string, { title: string; author: string; clubIds: string[] }>();
    for (const club of this.clubsSignal()) {
      const key = `${club.currentBook.title}::${club.currentBook.author}`;
      const entry = seen.get(key);
      if (entry) {
        entry.clubIds.push(club.id);
      } else {
        seen.set(key, { ...club.currentBook, clubIds: [club.id] });
      }
    }
    return Array.from(seen.entries()).map(([id, book]) => ({ id, ...book }));
  });

  clubsByBook(bookId: string): Club[] {
    const book = this.allBooks().find((b) => b.id === bookId);
    if (!book) return [];
    return this.clubsSignal().filter((club) => book.clubIds.includes(club.id));
  }

  getBook(bookId: string): { id: string; title: string; author: string; clubIds: string[] } | undefined {
    return this.allBooks().find((b) => b.id === bookId);
  }

  bookIdFor(title: string, author: string): string {
    return `${title}::${author}`;
  }

  relatedClubs(clubId: string, limit = 3): Club[] {
    const current = this.getClub(clubId);
    if (!current) return [];
    return this.clubsSignal()
      .filter((other) => other.id !== clubId)
      .map((other) => ({
        club: other,
        score: other.genres.filter((g) => current.genres.includes(g)).length,
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => entry.club);
  }

  constructor() {
    this.bootstrap();
  }

  private bootstrap(): void {
    // TODO PROTO:book-clubs - Replace localStorage seed with real API fetch.
    const currentVersion = localStorage.getItem(KEY_VERSION);
    if (currentVersion !== SEED_VERSION) {
      localStorage.setItem(KEY_CLUBS, JSON.stringify(SEED_CLUBS));
      localStorage.setItem(KEY_PROFILE, JSON.stringify(DEFAULT_PROFILE));
      localStorage.setItem(KEY_MEMBERSHIPS, JSON.stringify([]));
      localStorage.setItem(KEY_VERSION, SEED_VERSION);
    }

    this.clubsSignal.set(this.readJson<Club[]>(KEY_CLUBS, SEED_CLUBS));
    this.profileSignal.set(this.readJson<Profile>(KEY_PROFILE, DEFAULT_PROFILE));
    const memberList = this.readJson<string[]>(KEY_MEMBERSHIPS, []);
    this.membershipsSignal.set(new Set(memberList));
  }

  getClub(id: string): Club | undefined {
    return this.clubsSignal().find((club) => club.id === id);
  }

  isMember(clubId: string): boolean {
    return this.membershipsSignal().has(clubId);
  }

  toggleMembership(clubId: string): void {
    const next = new Set(this.membershipsSignal());
    if (next.has(clubId)) {
      next.delete(clubId);
    } else {
      next.add(clubId);
    }
    this.membershipsSignal.set(next);
    localStorage.setItem(KEY_MEMBERSHIPS, JSON.stringify(Array.from(next)));
  }

  updateProfile(partial: Partial<Profile>): void {
    const next = { ...this.profileSignal(), ...partial };
    this.profileSignal.set(next);
    localStorage.setItem(KEY_PROFILE, JSON.stringify(next));
  }

  private readJson<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
}
