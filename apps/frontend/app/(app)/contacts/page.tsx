'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { SearchInput } from '@/components/ui/search-input';
import { useContacts } from '@/hooks/use-crud';

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const { data = [], isLoading } = useContacts(search);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Contatos</h2>
        <div className="w-80"><SearchInput value={search} onChange={setSearch} /></div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Carregando contatos...</p>
      ) : (
        <DataTable
          data={data}
          columns={[
            { key: 'name', label: 'Nome' },
            { key: 'phone', label: 'Telefone' },
            { key: 'email', label: 'E-mail' },
            { key: 'updatedAt', label: 'Última atualização', render: (row) => new Date(row.updatedAt).toLocaleString('pt-BR') },
          ]}
        />
      )}
    </div>
  );
}
