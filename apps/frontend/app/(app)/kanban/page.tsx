'use client';

import { useConversations } from '@/hooks/use-inbox';
import { SearchInput } from '@/components/ui/search-input';
import { useState } from 'react';
import { TagBadge } from '@/components/ui/tag-badge';

const columns = [
  { key: 'OPEN', title: 'Entrada' },
  { key: 'PENDING', title: 'Em atendimento' },
  { key: 'CLOSED', title: 'Encerradas' },
] as const;

export default function KanbanPage() {
  const [search, setSearch] = useState('');
  const { data = [] } = useConversations('all');

  const filtered = data.filter((item) => (item.contact.name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Kanban de atendimento</h2>
          <p className="text-sm text-slate-500">Drag and drop pode ser conectado na próxima iteração.</p>
        </div>
        <div className="w-80"><SearchInput value={search} onChange={setSearch} placeholder="Buscar contato" /></div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <div key={column.key} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">{column.title}</h3>
            <div className="space-y-3">
              {filtered
                .filter((item) => item.status === column.key)
                .map((item) => (
                  <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold">{item.contact.name || 'Contato sem nome'}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.assignedUser?.name || 'Sem atendente'} • {item.queue?.name || 'Sem fila'}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags?.map((tag) => <TagBadge key={tag.tag.id} name={tag.tag.name} color={tag.tag.color} />)}
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
