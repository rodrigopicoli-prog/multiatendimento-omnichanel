'use client';

import { useDashboardSummary } from '@/hooks/use-dashboard';
import { EmptyState } from '@/components/ui/empty-state';

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return <p className="text-sm text-slate-500">Carregando dashboard...</p>;
  }

  if (!data) {
    return <EmptyState title="Sem dados de dashboard" description="Verifique integração com backend." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard Operacional</h2>
        <p className="text-sm text-slate-500">Visão resumida da operação em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Conversas hoje" value={data.conversationsToday} />
        <MetricCard title="Novas conversas" value={data.newConversations} />
        <MetricCard title="Tempo médio 1ª resposta (s)" value={Math.round(data.averageFirstResponseTimeSeconds)} />
        <MetricCard title="Tempo médio atendimento (s)" value={Math.round(data.averageHandlingTimeSeconds)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-slate-900">Conversas por fila</h3>
          <ul className="space-y-2 text-sm">
            {data.conversationsByQueue.map((item, index) => (
              <li key={`${item.queueId}-${index}`} className="flex justify-between">
                <span className="text-slate-600">{item.queueId ?? 'Sem fila'}</span>
                <strong>{item._count._all}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-slate-900">Conversas por canal</h3>
          <ul className="space-y-2 text-sm">
            {data.conversationsByChannel.map((item, index) => (
              <li key={`${item.channelId}-${index}`} className="flex justify-between">
                <span className="text-slate-600">{item.channelId ?? 'Sem canal'}</span>
                <strong>{item._count._all}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-slate-900">Conversas encerradas</h3>
          <p className="text-3xl font-semibold">{data.closedConversations}</p>
        </div>
      </div>
    </div>
  );
}
