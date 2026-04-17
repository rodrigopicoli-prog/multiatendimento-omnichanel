'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { BookUser, Inbox, KanbanSquare, MessageSquare, Settings, Shield, Users, Workflow, BarChart3, Plug } from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/kanban', label: 'Kanban', icon: KanbanSquare },
  { href: '/contacts', label: 'Contatos', icon: BookUser },
  { href: '/users', label: 'Usuários', icon: Users },
  { href: '/queues', label: 'Filas', icon: Workflow },
  { href: '/connections', label: 'Conexões', icon: Plug },
  { href: '/quick-replies', label: 'Respostas rápidas', icon: MessageSquare },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-6 flex items-center gap-3 px-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">Omnichannel</p>
          <p className="font-semibold">Painel Operacional</p>
        </div>
      </div>
      <nav className="space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
                active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
