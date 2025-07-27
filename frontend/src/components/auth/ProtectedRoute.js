'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login with the current path as redirect parameter
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // User doesn't have the required role
        router.push('/unauthorized');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname, allowedRoles]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4D69] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or wrong role
  if (!isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(user?.role))) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
