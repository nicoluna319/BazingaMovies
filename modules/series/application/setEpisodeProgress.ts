import { SeriesProgressRepository } from "../infrastructure/SeriesProgressRepository";

export async function setEpisodeProgress(params: {
  userId: string;
  showId: string;
  season: number;
  episode: number;
  status: "watching" | "watched";
}) {
  const repo = new SeriesProgressRepository();
  // aquí luego harás validaciones, etc.
  await repo.saveProgress();
}