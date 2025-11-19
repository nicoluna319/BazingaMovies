export type WatchStatus = "in_progress" | "completed";

export interface EpisodeProgress {
  id: string;          // id interno del registro de progreso

  userId: string;      // referencia a User.id
  seriesId: string;    // referencia a Series.id

  seasonNumber: number;
  episodeNumber: number;

  status: WatchStatus; // "in_progress" o "completed"

  // puede servir para "continuar viendo", ordenar por lo último actualizado
  updatedAt: Date;
  createdAt: Date;
}
