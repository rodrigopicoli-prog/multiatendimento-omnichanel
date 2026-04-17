'use client';

import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useQueues } from '@/hooks/use-crud';

export default function QueuesPage() {
  const { data = [], isLoading } = useQueues();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Filas</h2>
      {isLoading ? <p>Carregando...</p> : <DataTable data={data} columns={[{ key: 'name', label: 'Fila' }, { key: 'color', label: 'Cor', render: (row) => <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: row.color || '#94a3b8' }} />{row.color || '-'}</span> }, { key: 'sortOrder', label: 'Ordem' }, { key: 'isActive', label: 'Status', render: (row) => <StatusBadge label={row.isActive ? 'OPEN' : 'CLOSED'} /> }]} />}
    </div>
  );
}
