export interface Game {
  id: string;
  igdbId: number;
  name: string;
  slug: string;
  summary?: string;
  coverUrl?: string;
  genres: string[];
  platforms: string[];
  releaseDate?: string;
  rating?: number;
  hypes?: number;
  expectedTime?: number;
  expectedTimeForAllContent?: number;
  raw?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}
