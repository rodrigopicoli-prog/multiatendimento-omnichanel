'use client';

import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { useUsers } from '@/hooks/use-crud';
import { useState } from 'react';

export default function UsersPage() {
  const { data = [], isLoading } = useUsers();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Usuários</h2>
        <button onClick={() => setOpen(true)} className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Novo usuário</button>
      </div>

      {isLoading ? <p>Carregando...</p> : <DataTable data={data} columns={[{ key: 'name', label: 'Nome' }, { key: 'email', label: 'E-mail' }, { key: 'role', label: 'Perfil' }, { key: 'isActive', label: 'Ativo', render: (row) => (row.isActive ? 'Sim' : 'Não') }]} />}

      <FormModal open={open} onClose={() => setOpen(false)} title="Criar usuário">
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Nome" />
          <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="E-mail" />
          <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Senha" />
          <select className="rounded border border-slate-300 px-3 py-2 text-sm"><option>ADMIN</option><option>SUPERVISOR</option><option>AGENT</option></select>
        </div>
        <button className="mt-4 rounded bg-slate-900 px-4 py-2 text-sm text-white">Salvar</button>
      </FormModal>
    </div>
  );
}
