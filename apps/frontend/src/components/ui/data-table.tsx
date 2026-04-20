import type { ReactNode } from 'react';
import { EmptyState } from './empty-state';

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
};

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  emptyTitle,
}: {
  columns: Column<T>[];
  data: T[];
  emptyTitle?: string;
}) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle ?? 'Nenhum registro encontrado'} />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 text-left font-semibold text-slate-600">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-slate-100">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3 text-slate-700">
                  {column.render ? column.render(row) : row[column.key as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
