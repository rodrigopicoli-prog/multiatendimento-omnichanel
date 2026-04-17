'use client';

import { Bell, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/services';
import { useAuthStore } from '@/store/auth-store';

export function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearSession();
    router.push('/auth/login');
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-sm text-slate-500">Bem-vindo(a)</p>
        <h1 className="text-base font-semibold text-slate-900">{user?.name ?? 'Usuário'}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
          <Bell className="h-4 w-4" />
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </header>
  );
}
