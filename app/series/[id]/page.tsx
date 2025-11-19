"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/shared/components/PageContainer";
import Link from "next/link";

interface SeasonSummary {
  seasonNumber: number;
  episodeCount: number;
  name: string;
  overview: string;
  posterUrl: string | null;
}

interface SeriesDetails {
  externalId: string;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  totalSeasons: number | null;
  seasons: SeasonSummary[];
}

interface Episode {
  id: number;
  name: string;
  overview: string;
  stillUrl: string | null;
  episodeNumber: number;
  seasonNumber: number;
}

export default function SeriesDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;

  const [details, setDetails] = useState<SeriesDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar detalles de la serie
  useEffect(() => {
    if (!id) return; // si id aún no existe, no hagas nada

    async function fetchDetails() {
      try {
        setLoadingDetails(true);
        setError(null);

        console.log("Cargando detalles para id:", id);

        const res = await fetch(`/api/series/${id}`);

        if (!res.ok) {
          throw new Error("Error obteniendo detalles de la serie");
        }

        const data = (await res.json()) as SeriesDetails;
        setDetails(data);

        const seasonsSorted = [...data.seasons].sort(
          (a, b) => a.seasonNumber - b.seasonNumber
        );
        const firstNormalSeason =
          seasonsSorted.find((s) => s.seasonNumber > 0) ?? seasonsSorted[0];

        if (firstNormalSeason) {
          setSelectedSeason(firstNormalSeason.seasonNumber);
        }
      } catch (err) {
        console.error(err);
        setError("No pude cargar la información de la serie.");
      } finally {
        setLoadingDetails(false);
      }
    }

    fetchDetails();
  }, [id]);

  // Cargar episodios de la temporada seleccionada
  useEffect(() => {
    if (!id || !selectedSeason) return;

    async function fetchEpisodes() {
      try {
        setLoadingEpisodes(true);
        setError(null);

        console.log(
          `Cargando episodios para id=${id}, temporada=${selectedSeason}`
        );

        const res = await fetch(
          `/api/series/${id}/season/${selectedSeason}`
        );

        if (!res.ok) {
          throw new Error("Error obteniendo episodios");
        }

        const data = (await res.json()) as Episode[];
        setEpisodes(data);
      } catch (err) {
        console.error(err);
        setError("No pude cargar los episodios de esta temporada.");
      } finally {
        setLoadingEpisodes(false);
      }
    }

    fetchEpisodes();
  }, [id, selectedSeason]);

  return (
    <PageContainer>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">
              <Link href="/series" className="hover:underline">
                ← Volver a buscar
              </Link>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {details ? details.title : "Cargando..."}
            </h1>
            {details?.totalSeasons !== null && details?.totalSeasons !== undefined && (
              <p className="text-sm text-slate-300">
                {details.totalSeasons} temporada
                {details.totalSeasons === 1 ? "" : "s"}
              </p>
            )}
          </div>

          {details?.posterUrl && (
            <img
              src={details.posterUrl}
              alt={details.title}
              className="w-28 sm:w-32 rounded-lg border border-slate-700 object-cover self-start sm:self-center"
            />
          )}
        </header>

        {loadingDetails && (
          <p className="text-sm text-slate-300">
            Cargando detalles de la serie…
          </p>
        )}

        {error && (
          <div className="rounded-lg bg-red-900/40 border border-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {details && !loadingDetails && !error && (
          <>
            {details.overview && (
              <p className="text-sm text-slate-200 leading-relaxed">
                {details.overview}
              </p>
            )}

            {/* Selector de temporadas */}
            {details.seasons.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">Temporadas</h2>
                <div className="flex flex-wrap gap-2">
                  {details.seasons
                    .sort((a, b) => a.seasonNumber - b.seasonNumber)
                    .map((season) => (
                      <button
                        key={season.seasonNumber}
                        onClick={() =>
                          setSelectedSeason(season.seasonNumber)
                        }
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm border ${
                          selectedSeason === season.seasonNumber
                            ? "bg-indigo-600 border-indigo-500"
                            : "bg-slate-800 border-slate-700 hover:border-indigo-500/70"
                        }`}
                      >
                        T{season.seasonNumber} ({season.episodeCount} ep)
                      </button>
                    ))}
                </div>
              </section>
            )}

            {/* Lista de episodios */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Episodios{" "}
                  {selectedSeason
                    ? `– Temporada ${selectedSeason}`
                    : ""}
                </h2>
                {loadingEpisodes && (
                  <span className="text-xs text-slate-400">
                    Cargando episodios…
                  </span>
                )}
              </div>

              {episodes.length === 0 && !loadingEpisodes && (
                <p className="text-sm text-slate-400">
                  No encontré episodios para esta temporada.
                </p>
              )}

              <div className="space-y-3">
                {episodes.map((ep) => (
                  <article
                    key={ep.id}
                    className="flex gap-3 rounded-lg bg-slate-800 border border-slate-700/70 p-3"
                  >
                    {ep.stillUrl ? (
                      <img
                        src={ep.stillUrl}
                        alt={ep.name}
                        className="w-24 h-16 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-16 rounded bg-slate-700 flex items-center justify-center text-[10px] text-slate-300 flex-shrink-0">
                        Sin imagen
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-sm font-semibold">
                        Episodio {ep.episodeNumber}: {ep.name}
                      </h3>
                      {ep.overview && (
                        <p className="text-xs text-slate-300 mt-1 line-clamp-3">
                          {ep.overview}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </PageContainer>
  );
}
