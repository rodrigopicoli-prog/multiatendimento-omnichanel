'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { SearchInput } from '@/components/ui/search-input';
import { useQuickReplies } from '@/hooks/use-crud';

export default function QuickRepliesPage() {
  const [search, setSearch] = useState('');
  const { data = [], isLoading } = useQuickReplies();

  const filtered = data.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Respostas rápidas</h2>
        <div className="w-80"><SearchInput value={search} onChange={setSearch} /></div>
      </div>
      {isLoading ? <p>Carregando...</p> : <DataTable data={filtered} columns={[{ key: 'title', label: 'Título' }, { key: 'category', label: 'Categoria' }, { key: 'body', label: 'Texto' }, { key: 'isActive', label: 'Ativa', render: (row) => (row.isActive ? 'Sim' : 'Não') }]} />}
    </div>
  );
}
