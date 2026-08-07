export function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-100" />
      ))}
    </div>
  );
}
