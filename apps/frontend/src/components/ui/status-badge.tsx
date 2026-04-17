import clsx from 'clsx';

const variants: Record<string, string> = {
  OPEN: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-amber-100 text-amber-700',
  CLOSED: 'bg-slate-200 text-slate-700',
  CONNECTED: 'bg-emerald-100 text-emerald-700',
  DISCONNECTED: 'bg-rose-100 text-rose-700',
  CONNECTING: 'bg-amber-100 text-amber-700',
};

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className={clsx('rounded-full px-2 py-1 text-xs font-semibold', variants[label] ?? 'bg-slate-100 text-slate-600')}>
      {label}
    </span>
  );
}
