import { cn } from "@/lib/utils";

export function ScoreIndicator({ score, label }: { score: number; label?: string }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="min-w-[110px]">
      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-slate-600">
        <span>{label ?? "Score"}</span>
        <strong>{score}%</strong>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={cn("h-2 rounded-full", color)} style={{ width: `${Math.max(4, Math.min(score, 100))}%` }} />
      </div>
    </div>
  );
}
