"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/shared/components/PageContainer";

interface SearchResult {
  externalId: string;
  title: string;
  overview: string;
  posterUrl: string | null;
  firstAirDate: string | null;
}

export default function SeriesSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const res = await fetch(
        `/api/series/search?q=${encodeURIComponent(trimmed)}`
      );

      if (!res.ok) {
        throw new Error("Error buscando series");
      }

      const data = (await res.json()) as SearchResult[];
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Hubo un problema buscando las series. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <section className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Buscar series 🎬
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Escribe el nombre de una serie para traer la info desde TMDb
            (títulos, portadas, temporadas, etc.).
          </p>
        </header>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Ej: Breaking Bad, Dark, The Office..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm sm:text-base font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && (
          <div className="rounded-lg bg-red-900/40 border border-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {/* Estado inicial sin búsqueda */}
        {!hasSearched && !loading && (
          <p className="text-sm text-slate-400">
            Empieza escribiendo el nombre de una serie arriba 👆
          </p>
        )}

        {/* Resultados */}
        {hasSearched && !loading && results.length === 0 && !error && (
          <p className="text-sm text-slate-400">
            No encontré resultados para <span className="font-semibold">{query}</span>.
            Prueba con otro nombre.
          </p>
        )}

       {results.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((serie) => (
              <Link
                key={serie.externalId}
                href={`/series/${serie.externalId}`}
                className="bg-slate-800 rounded-xl overflow-hidden flex flex-col border border-slate-700/60 hover:border-indigo-500/80 transition-colors"
              >
                {serie.posterUrl ? (
                  <img
                    src={serie.posterUrl}
                    alt={serie.title}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                    Sin imagen
                  </div>
                )}

                <div className="p-3 flex-1 flex flex-col">
                  <h2 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">
                    {serie.title}
                  </h2>

                  {serie.firstAirDate && (
                    <p className="text-xs text-slate-400 mb-1">
                      Desde {serie.firstAirDate.slice(0, 4)}
                    </p>
                  )}

                  <p className="text-xs text-slate-300 flex-1 overflow-hidden">
                    {serie.overview || "Sin descripción."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
  
}

