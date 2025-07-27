"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBars, FaTimes, FaSearch, FaUser, FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsRegisterOpen(false);
    setIsProfileOpen(false);
  };

  const toggleRegisterDropdown = () => {
    setIsRegisterOpen(!isRegisterOpen);
    setIsProfileOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsRegisterOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Common navigation items for all users
  const commonItems = (
    <>
      <Link href="/rooms" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
        Browse Rooms
      </Link>
      <Link href="/about" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
        About
      </Link>
      <Link href="/contact" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
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
          className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 focus:outline-none dark:hover:text-white"
          aria-label="Register options"
        >
          Register
        </button>
        {isRegisterOpen && (
          <div className="absolute md:right-0 mt-2 w-48 bg-white text-[#1A1A1A] rounded-lg shadow-lg py-2 z-50">
            <Link
              href="/auth/register?role=customer"
              className="block px-4 py-2 hover:bg-[#F9E4B7] transition-colors duration-300"
              onClick={() => setIsRegisterOpen(false)}
            >
              As Customer
            </Link>
            <Link
              href="/auth/register?role=houseOwner"
              className="block px-4 py-2 hover:bg-[#F9E4B7] transition-colors duration-300"
              onClick={() => setIsRegisterOpen(false)}
            >
              As House Owner
            </Link>
          </div>
        )}
      </div>
      <Link
        href="/auth/login"
        className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white"
      >
        Login
      </Link>
    </>
  );

  // Customer specific items
  const customerItems = (
    <>
      {commonItems}
      <Link href="/bookings" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
        My Bookings
      </Link>
      <Link href="/favorites" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
        Favorites
      </Link>
    </>
  );

  // House owner specific items
  const houseOwnerItems = (
    <>
      {commonItems}
      <Link href="/owner/dashboard" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
        Dashboard
      </Link>
      <Link href="/owner/properties" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
        My Properties
      </Link>
      <Link href="/owner/bookings" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
        Bookings
      </Link>
    </>
  );

  // Admin specific items
  const adminItems = (
    <>
      <Link href="/admin/dashboard" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
        Admin Dashboard
      </Link>
      <Link href="/admin/users" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
        Users
      </Link>
      <Link href="/admin/properties" className="text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
        Properties
      </Link>
    </>
  );

  return (
    <nav className="bg-[#2A4D69] bg-opacity-90 text-white p-4 sticky top-0 z-50 shadow-lg backdrop-blur-sm dark:bg-[#1a2a1f] dark:bg-opacity-90">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold tracking-tight hover:text-[#F9E4B7] transition-colors duration-300 dark:hover:text-white">
          GuestRoom
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {!isAuthenticated ? guestItems : (
            <>
              {user?.role === 'admin' && adminItems}
              {user?.role === 'houseOwner' && houseOwnerItems}
              {user?.role === 'customer' && customerItems}
            </>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="p-2 rounded-l-lg border border-[#F9E4B7] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#D1495B] dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <button
              type="submit"
              className="p-2 bg-[#F9E4B7] text-[#1A1A1A] rounded-r-lg hover:bg-[#D1495B] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#D1495B] dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-lg hover:text-[#F9E4B7] transition-colors duration-300 focus:outline-none dark:hover:text-white"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Profile/Auth Section */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 focus:outline-none dark:hover:text-white"
                aria-label="User profile"
              >
                <FaUser />
                <span>{user?.name}</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-[#1A1A1A] rounded-lg shadow-lg py-2 z-50 dark:bg-gray-800 dark:text-white">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-[#F9E4B7] transition-colors duration-300 dark:hover:bg-gray-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-[#F9E4B7] transition-colors duration-300 dark:hover:bg-gray-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-[#F9E4B7] transition-colors duration-300 dark:hover:bg-gray-700"
                  >
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
          className="md:hidden text-white hover:text-[#F9E4B7] transition-colors duration-300 text-2xl focus:outline-none dark:hover:text-white"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#2A4D69] text-white p-4 mt-4 rounded-lg dark:bg-[#1a2a1f]">
          {!isAuthenticated ? (
            <div className="space-y-2">
              {commonItems}
              <div className="border-t border-gray-600 pt-4 mt-4">
                <div className="relative mb-4">
                  <button
                    onClick={toggleRegisterDropdown}
                    className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 focus:outline-none"
                  >
                    Register
                  </button>
                  {isRegisterOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      <Link
                        href="/auth/register?role=customer"
                        className="block py-2 text-base hover:text-[#F9E4B7] transition-colors duration-300"
                        onClick={toggleMobileMenu}
                      >
                        As Customer
                      </Link>
                      <Link
                        href="/auth/register?role=houseOwner"
                        className="block py-2 text-base hover:text-[#F9E4B7] transition-colors duration-300"
                        onClick={toggleMobileMenu}
                      >
                        As House Owner
                      </Link>
                    </div>
                  )}
                </div>
                <Link
                  href="/auth/login"
                  className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {user?.role === 'admin' && (
                <div className="space-y-2">
                  <Link href="/admin/dashboard" className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300" onClick={toggleMobileMenu}>
                    Admin Dashboard
                  </Link>
                  <Link href="/admin/users" className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300" onClick={toggleMobileMenu}>
                    Users
                  </Link>
                  <Link href="/admin/properties" className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300" onClick={toggleMobileMenu}>
                    Properties
                  </Link>
                </div>
              )}
              
              {user?.role === 'houseOwner' && (
                <div className="space-y-2">
                  {commonItems}
                  <Link href="/owner/dashboard" className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300" onClick={toggleMobileMenu}>
                    Dashboard
                  </Link>
                  <Link href="/owner/properties" className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300" onClick={toggleMobileMenu}>
                    My Properties
                  </Link>
                  <Link href="/owner/bookings" className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300" onClick={toggleMobileMenu}>
                    Bookings
                  </Link>
                </div>
              )}
              
              {user?.role === 'customer' && (
                <div className="space-y-2">
                  {commonItems}
                  <Link href="/bookings" className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300" onClick={toggleMobileMenu}>
                    My Bookings
                  </Link>
                  <Link href="/favorites" className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300" onClick={toggleMobileMenu}>
                    Favorites
                  </Link>
                </div>
              )}
              
              <div className="border-t border-gray-600 pt-4 mt-4">
                <div className="relative mb-4">
                  <button
                    onClick={toggleProfileDropdown}
                    className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300 focus:outline-none"
                  >
                    {user?.name} Profile
                  </button>
                  {isProfileOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      <Link
                        href="/profile"
                        className="block py-2 text-base hover:text-[#F9E4B7] transition-colors duration-300"
                        onClick={toggleMobileMenu}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block py-2 text-base hover:text-[#F9E4B7] transition-colors duration-300"
                        onClick={toggleMobileMenu}
                      >
                        Settings
                      </Link>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="block py-2 text-lg font-medium hover:text-[#F9E4B7] transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
          
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="p-2 rounded-l-lg border border-[#F9E4B7] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#D1495B] w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <button
              type="submit"
              className="p-2 bg-[#F9E4B7] text-[#1A1A1A] rounded-r-lg hover:bg-[#D1495B] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#D1495B] dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>

          {/* Mobile Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center mt-4 text-lg hover:text-[#F9E4B7] transition-colors duration-300 focus:outline-none dark:hover:text-white"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />} <span className="ml-2">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      )}
    </nav>
  );
}
