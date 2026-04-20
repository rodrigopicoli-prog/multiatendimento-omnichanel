export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center">
      <p className="text-base font-semibold text-slate-700">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}
