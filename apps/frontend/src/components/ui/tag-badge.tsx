export function TagBadge({ name, color }: { name: string; color?: string }) {
  return (
    <span
      className="rounded-full px-2 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: color || '#475569' }}
    >
      {name}
    </span>
  );
}
