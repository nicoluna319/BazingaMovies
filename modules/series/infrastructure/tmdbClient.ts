const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL =
  process.env.TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p/w500";

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY no está definida en las variables de entorno");
}

function buildUrl(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "es-ES"); // para tener títulos/descripciones en español

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

export interface TmdbSearchTvResult {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string | null;
}

export interface TmdbTvDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  number_of_seasons: number;
  seasons: Array<{
    season_number: number;
    episode_count: number;
    name: string;
    overview: string;
    poster_path: string | null;
  }>;
}

export interface TmdbEpisode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
}

export async function searchSeries(query: string) {
  const url = buildUrl("/search/tv", { query });
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`TMDb search error: ${res.status}`);
  }

  const data = await res.json();

  const results = (data.results as TmdbSearchTvResult[]).map((item) => ({
    externalId: String(item.id),
    title: item.name,
    overview: item.overview,
    posterUrl: item.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
      : null,
    firstAirDate: item.first_air_date,
  }));

  return results;
}

export async function getSeriesDetails(tvId: string) {
  const url = buildUrl(`/tv/${tvId}`);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`TMDb details error: ${res.status}`);
  }

  const data = (await res.json()) as TmdbTvDetails;

  return {
    externalId: String(data.id),
    title: data.name,
    overview: data.overview,
    posterUrl: data.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}`
      : null,
    backdropUrl: data.backdrop_path
      ? `${TMDB_IMAGE_BASE_URL}${data.backdrop_path}`
      : null,
    totalSeasons: data.number_of_seasons,
    seasons: data.seasons.map((s) => ({
      seasonNumber: s.season_number,
      episodeCount: s.episode_count,
      name: s.name,
      overview: s.overview,
      posterUrl: s.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${s.poster_path}`
        : null,
    })),
  };
}

export async function getSeasonEpisodes(tvId: string, seasonNumber: number) {
  const url = buildUrl(`/tv/${tvId}/season/${seasonNumber}`);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`TMDb season error: ${res.status}`);
  }

  const data = await res.json();

  const episodes = (data.episodes as TmdbEpisode[]).map((ep) => ({
    id: ep.id,
    name: ep.name,
    overview: ep.overview,
    stillUrl: ep.still_path
      ? `${TMDB_IMAGE_BASE_URL}${ep.still_path}`
      : null,
    episodeNumber: ep.episode_number,
    seasonNumber: ep.season_number,
  }));

  return episodes;
}
