"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: string | string[],
  redirectTo = '/login'
) {
  return function WithAuthComponent(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;

      if (!user) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        router.push(`${redirectTo}?message=Please login to access this page`);
        return;
      }

      if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(user.role)) {
          router.push('/unauthorized');
          return;
        }
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      );
    }

    if (user && (!requiredRole || 
        (Array.isArray(requiredRole) ? requiredRole.includes(user.role) : requiredRole === user.role))) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
}