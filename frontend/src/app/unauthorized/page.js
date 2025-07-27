'use client';

import Link from 'next/link';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function UnauthorizedPage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A4D69] via-[#1A3C52] to-[#0F2A3E] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-yellow-400 mb-6">
            <FaExclamationTriangle className="w-full h-full" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Access Denied
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            You don't have permission to access this page
          </p>
          
          {isAuthenticated ? (
            <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-8">
              <p className="text-gray-200 mb-4">
                Logged in as: <span className="font-semibold text-white">{user?.name}</span>
              </p>
              <p className="text-gray-200">
                Role: <span className="font-semibold text-white capitalize">{user?.role}</span>
              </p>
            </div>
          ) : (
            <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-8">
              <p className="text-gray-200">
                You need to be logged in to access this page.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {!isAuthenticated ? (
              <Link
                href="/auth/login"
                className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-[#2A4D69] bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                Sign In
              </Link>
            ) : (
              <div className="space-y-3">
                {user?.role === 'customer' && (
                  <Link
                    href="/bookings"
                    className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white bg-[#F9E4B7] bg-opacity-20 border-[#F9E4B7] hover:bg-opacity-30 transition-colors duration-300"
                  >
                    Go to My Bookings
                  </Link>
                )}
                {user?.role === 'houseOwner' && (
                  <Link
                    href="/owner/dashboard"
                    className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white bg-[#F9E4B7] bg-opacity-20 border-[#F9E4B7] hover:bg-opacity-30 transition-colors duration-300"
                  >
                    Go to Owner Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white bg-[#F9E4B7] bg-opacity-20 border-[#F9E4B7] hover:bg-opacity-30 transition-colors duration-300"
                  >
                    Go to Admin Dashboard
                  </Link>
                )}
              </div>
            )}
            
            <Link
              href="/"
              className="w-full inline-flex justify-center items-center py-2 px-4 text-sm font-medium text-white hover:text-[#F9E4B7] transition-colors duration-300"
            >
              <FaHome className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
