'use client';

import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Home from '@/components/Home';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { isLoading } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Home />
      </main>
      <Footer />
    </div>
  );
}