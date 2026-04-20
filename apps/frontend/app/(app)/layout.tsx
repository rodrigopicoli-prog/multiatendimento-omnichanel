'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { useAuthStore } from '@/store/auth-store';

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, accessToken, pathname, router]);

  if (!hydrated || !accessToken) {
    return <div className="flex min-h-screen items-center justify-center">Validando sessão...</div>;
  }

  return <AppShell>{children}</AppShell>;
}
