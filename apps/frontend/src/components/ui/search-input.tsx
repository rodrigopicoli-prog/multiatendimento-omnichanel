'use client';

import { Search } from 'lucide-react';

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <Search className="h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border-none bg-transparent text-sm outline-none"
        placeholder={placeholder ?? 'Buscar...'}
      />
    </div>
  );
}
