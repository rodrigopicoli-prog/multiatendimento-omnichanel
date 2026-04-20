'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function HomePage() {
  const router = useRouter();
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hydrated) return;
    router.replace(accessToken ? '/dashboard' : '/auth/login');
  }, [hydrated, accessToken, router]);

  return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
}
