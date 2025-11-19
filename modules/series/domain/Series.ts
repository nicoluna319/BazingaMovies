export type ExternalSource = "tmdb" | "imdb" | "other";

export type SeriesType = "tv" | "movie";

export interface Series {
  id: string;              // id interno en tu BD
  externalId: string;      // id de la API externa (p.ej. tmdbId)
  externalSource: ExternalSource;

  type: SeriesType;        // "tv" o "movie"
  title: string;
  overview?: string | null;

  posterUrl?: string | null;
  backdropUrl?: string | null;

  // útil para saber hasta dónde puede progresar
  totalSeasons?: number | null;

  createdAt: Date;
  updatedAt: Date;
}
