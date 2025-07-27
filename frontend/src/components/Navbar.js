"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleRegisterDropdown = () => {
    setIsRegisterOpen(!isRegisterOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/rooms?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/');
  };

  // Common navigation items for all users
  const commonItems = (
    <>
      <Link href="/rooms" className="nav-link">
        Browse Rooms
      </Link>
      <Link href="/about" className="nav-link">
        About
      </Link>
      <Link href="/contact" className="nav-link">
        Contact
      </Link>
    </>
  );

  // Guest/non-authenticated user items
  const guestItems = (
    <>
      {commonItems}
      <div className="relative">
        <button
          onClick={toggleRegisterDropdown}
          className="nav-link focus:outline-none flex items-center"
          aria-label="Register options"
        >
          Register
          <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        {isRegisterOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
            <Link
              href="/auth/register?role=customer"
              className="block px-4 py-2 hover:bg-[#F9E4B7] hover:text-gray-800 transition-colors duration-300 rounded-lg mx-2"
              onClick={() => setIsRegisterOpen(false)}
            >
              <i className="fas fa-user mr-2"></i>
              As Customer
            </Link>
            <Link
              href="/auth/register?role=houseOwner"
              className="block px-4 py-2 hover:bg-[#F9E4B7] hover:text-gray-800 transition-colors duration-300 rounded-lg mx-2"
              onClick={() => setIsRegisterOpen(false)}
            >
              <i className="fas fa-home mr-2"></i>
              As House Owner
            </Link>
          </div>
        )}
      </div>
      <Link
        href="/auth/login"
        className="bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] text-gray-800 px-6 py-2 rounded-full font-medium hover:from-[#FFD700] hover:to-[#F9E4B7] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Login
      </Link>
    </>
  );

  // Customer specific items
  const customerItems = (
    <>
      {commonItems}
      <Link href="/bookings" className="nav-link">
        <i className="fas fa-calendar-check mr-1"></i>
        My Bookings
      </Link>
      <Link href="/favorites" className="nav-link">
        <i className="fas fa-heart mr-1"></i>
        Favorites
      </Link>
    </>
  );

  // House owner specific items
  const houseOwnerItems = (
    <>
      {commonItems}
      <Link href="/owner/dashboard" className="nav-link">
        <i className="fas fa-chart-line mr-1"></i>
        Dashboard
      </Link>
      <Link href="/owner/properties" className="nav-link">
        <i className="fas fa-building mr-1"></i>
        My Properties
      </Link>
      <Link href="/owner/bookings" className="nav-link">
        <i className="fas fa-calendar-alt mr-1"></i>
        Bookings
      </Link>
    </>
  );

  // Admin specific items
  const adminItems = (
    <>
      <Link href="/admin/dashboard" className="nav-link">
        <i className="fas fa-tachometer-alt mr-1"></i>
        Admin Dashboard
      </Link>
      <Link href="/admin/users" className="nav-link">
        <i className="fas fa-users mr-1"></i>
        Users
      </Link>
      <Link href="/admin/properties" className="nav-link">
        <i className="fas fa-building mr-1"></i>
        Properties
      </Link>
    </>
  );

  const renderNavigationItems = () => {
    if (!isAuthenticated) return guestItems;
    
    switch (user?.role) {
      case 'customer':
        return customerItems;
      case 'houseOwner':
        return houseOwnerItems;
      case 'admin':
        return adminItems;
      default:
        return guestItems;
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg dark:bg-gray-900/95' 
          : 'bg-gradient-to-r from-[#2A4D69] via-[#1A3C52] to-[#2A4D69]'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className={`text-2xl font-extrabold transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-[#2A4D69] to-[#1A3C52] bg-clip-text text-transparent' 
                  : 'text-[#F9E4B7]'
              }`}>
                GuestRoom
              </div>
              <div className={`w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-125 ${
                isScrolled ? 'bg-[#2A4D69]' : 'bg-[#F9E4B7]'
              }`}></div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for rooms, locations..."
                    className={`w-full px-4 py-2 pl-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 ${
                      isScrolled
                        ? 'bg-gray-100 text-gray-800 focus:ring-[#2A4D69] dark:bg-gray-700 dark:text-white'
                        : 'bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-[#F9E4B7] focus:bg-white/30'
                    }`}
                  />
                  <i className={`fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isScrolled ? 'text-gray-400' : 'text-white/70'
                  }`}></i>
                  <button
                    type="submit"
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full transition-all duration-300 ${
                      isScrolled
                        ? 'bg-[#2A4D69] text-white hover:bg-[#1A3C52]'
                        : 'bg-[#F9E4B7] text-gray-800 hover:bg-[#FFD700]'
                    }`}
                  >
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className={`hidden lg:flex items-center space-x-6 ${
              isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'
            }`}>
              {renderNavigationItems()}
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'hover:bg-white/20'
                }`}
                aria-label="Toggle dark mode"
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>

              {/* User Profile */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className={`flex items-center space-x-2 p-2 rounded-full transition-all duration-300 ${
                      isScrolled
                        ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        : 'hover:bg-white/20'
                    }`}
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] rounded-full flex items-center justify-center">
                      <span className="text-gray-800 font-medium text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-[#F9E4B7] text-gray-800 rounded-full">
                          {user?.role}
                        </span>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#F9E4B7] hover:text-gray-800 transition-colors duration-300 rounded-lg mx-2"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <i className="fas fa-user mr-2"></i>
                        Profile Settings
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#F9E4B7] hover:text-gray-800 transition-colors duration-300 rounded-lg mx-2"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <i className="fas fa-cog mr-2"></i>
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300 rounded-lg mx-2"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/20 dark:border-gray-700 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for rooms, locations..."
                    className={`w-full px-4 py-2 pl-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 ${
                      isScrolled
                        ? 'bg-gray-100 text-gray-800 focus:ring-[#2A4D69] dark:bg-gray-700 dark:text-white'
                        : 'bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-[#F9E4B7]'
                    }`}
                  />
                  <i className={`fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isScrolled ? 'text-gray-400' : 'text-white/70'
                  }`}></i>
                </div>
              </form>

              {/* Mobile Navigation Items */}
              <div className={`space-y-2 ${isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}`}>
                {renderNavigationItems()}
                
                {/* Mobile User Profile */}
                {isAuthenticated && (
                  <div className="border-t border-white/20 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] rounded-full flex items-center justify-center">
                        <span className="text-gray-800 font-medium">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm opacity-70">{user?.email}</p>
                      </div>
                    </div>
                    <Link href="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <i className="fas fa-user mr-2"></i>
                      Profile Settings
                    </Link>
                    <Link href="/settings" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <i className="fas fa-cog mr-2"></i>
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left mobile-nav-link text-red-400 hover:text-red-300"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>

      <style jsx>{`
        .nav-link {
          @apply text-lg font-medium transition-all duration-300 hover:text-[#F9E4B7] hover:scale-105 relative;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 50%;
          background: linear-gradient(to right, #F9E4B7, #FFD700);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .mobile-nav-link {
          @apply block px-2 py-3 text-lg font-medium transition-colors duration-300 hover:text-[#F9E4B7] hover:bg-white/10 rounded-lg;
        }
        
        .navbar-scrolled .nav-link {
          @apply text-gray-800 dark:text-white hover:text-[#2A4D69] dark:hover:text-[#F9E4B7];
        }
      `}</style>
    </>
  );
}
