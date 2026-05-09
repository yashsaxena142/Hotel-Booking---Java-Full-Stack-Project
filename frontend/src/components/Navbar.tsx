"use client";

import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, Heart, Calendar, ChevronDown, Sun, Moon, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/', active: true },
    { name: 'Destinations', href: '#', active: false },
    { name: 'Deals', href: '#', active: false },
    { name: 'Blog', href: '#', active: false },
    { name: 'Contact', href: '#', active: false },
  ];

  return (
    <nav className={`relative w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#191e3b] shadow-lg py-2'
        : 'bg-[#191e3b] py-4'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">HB</span>
            </div>
            <span className="text-xl font-bold text-white">
              Hotel<span className="text-indigo-400">Booking</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors text-white ${item.active
                    ? 'text-indigo-400'
                    : 'text-white/90 hover:text-indigo-400'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              /* User Menu for logged in users */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <span className="text-white text-sm hidden md:block">
                    {user.firstName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-white" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 border border-gray-100 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Role: {user.role}</p>
                    </div>
                    <Link href="/profile" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    {user.role === 'HOTEL_OWNER' && (
                      <Link href="/owner/dashboard" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700">
                        <Briefcase className="w-4 h-4" />
                        <span>Owner Dashboard</span>
                      </Link>
                    )}
                    <Link href="/my-bookings" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700">
                      <Calendar className="w-4 h-4" />
                      <span>My Bookings</span>
                    </Link>
                    <hr className="my-2 border-gray-100 dark:border-gray-700" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Signup buttons for guests */
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium text-white ${item.active
                      ? 'bg-indigo-600/20 text-indigo-400'
                      : 'hover:bg-white/10'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="border-white/10" />
              {!user && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center space-x-2 px-4 py-2 border border-indigo-400 text-indigo-400 rounded-lg hover:bg-indigo-600/20"
                  >
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;