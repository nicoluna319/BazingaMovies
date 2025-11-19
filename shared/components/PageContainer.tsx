// shared/components/PageContainer.tsx
import { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex justify-center">
      <div className="w-full max-w-3xl p-4">{children}</div>
    </main>
  );
}
