'use client';

import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { useChannels } from '@/hooks/use-crud';

export default function ConnectionsPage() {
  const { data = [], isLoading } = useChannels();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Conexões</h2>
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Nova conexão</button>
      </div>

      {isLoading ? <p>Carregando...</p> : <DataTable data={data} columns={[{ key: 'name', label: 'Nome' }, { key: 'type', label: 'Tipo' }, { key: 'status', label: 'Status', render: (row) => <StatusBadge label={row.status} /> }]} />}

      <EmptyState title="Área reservada para QR Code/Status WhatsApp" description="Integração completa do conector será habilitada nas próximas etapas." />
    </div>
  );
}
