import { SearchX } from "lucide-react";

export function EmptyState({ title = "Nenhum registro encontrado" }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white p-8 text-center text-slate-500">
      <SearchX className="mb-3 h-8 w-8" />
      <p className="text-sm font-medium text-slate-700">{title}</p>
    </div>
  );
}
