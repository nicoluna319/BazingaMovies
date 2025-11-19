// app/page.tsx
import Link from "next/link";
import { PageContainer } from "@/shared/components/PageContainer";

export default function Home() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold mb-2">BazingaMovies 🎬</h1>
        <p className="text-slate-300">
          Guarda en qué capítulo vas de cada serie y no vuelvas a perderte.
        </p>

        <Link
          href="/series"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500"
        >
          Empezar buscando una serie
        </Link>
      </div>
    </PageContainer>
  );
}
