"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) {
      console.log('ProtectedRoute - Still loading...');
      return;
    }

    console.log('ProtectedRoute - Check:', { 
      user: user ? `${user.firstName} ${user.lastName} (${user.role})` : 'No user',
      isLoading,
      pathname,
      requiredRole
    });

    // If no user, redirect to login
    if (!user) {
      console.log('ProtectedRoute - No user, redirecting to login');
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.push(`${redirectTo}?message=Please login to access this page`);
      return;
    }

    // Check role requirements if specified
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const userRole = user.role?.toUpperCase();
      const requiredRolesUpper = roles.map(r => r.toUpperCase());
      
      console.log('ProtectedRoute - Role check:', { 
        userRole, 
        required: requiredRolesUpper,
        matches: requiredRolesUpper.includes(userRole)
      });
      
      if (!requiredRolesUpper.includes(userRole)) {
        console.log('ProtectedRoute - User role not authorized');
        router.push('/unauthorized');
        return;
      }
    }

    // If we get here, user is authorized
    console.log('ProtectedRoute - User authorized');
    setIsAuthorized(true);
  }, [user, isLoading, router, requiredRole, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;