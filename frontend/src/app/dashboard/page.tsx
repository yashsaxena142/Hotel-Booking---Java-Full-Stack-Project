"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Calendar, Heart, User, Settings, LogOut, Hotel, Star, Clock, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  // Sample data - replace with real data from API
  const recentBookings = [
    { id: 1, hotel: 'Grand Palace Hotel', location: 'Mumbai', checkIn: 'Mar 15, 2024', checkOut: 'Mar 18, 2024', status: 'Confirmed', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
    { id: 2, hotel: 'Sea View Resort', location: 'Goa', checkIn: 'Apr 2, 2024', checkOut: 'Apr 5, 2024', status: 'Upcoming', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4' },
  ];

  const recommendedHotels = [
    { id: 1, name: 'Taj Mahal Palace', location: 'Mumbai', price: 15000, rating: 4.9, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' },
    { id: 2, name: 'The Oberoi', location: 'Delhi', price: 12000, rating: 4.8, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b' },
    { id: 3, name: 'ITC Grand Chola', location: 'Chennai', price: 10000, rating: 4.7, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="container mx-auto px-4 py-12">
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
              <p className="text-indigo-100">Manage your bookings and discover new stays</p>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="container mx-auto px-4 py-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">3</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-300">Active Bookings</h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">12</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-300">Wishlist</h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Hotel className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">8</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-300">Hotels Visited</h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">Gold</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-300">Member Level</h3>
              </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Link href="/my-bookings" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group">
                <Calendar className="w-8 h-8 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">My Bookings</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">View and manage your hotel bookings</p>
              </Link>

              <Link href="/profile" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group">
                <User className="w-8 h-8 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Profile Settings</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Update your personal information</p>
              </Link>

              <Link href="/wishlist" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group">
                <Heart className="w-8 h-8 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Wishlist</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">View your saved hotels</p>
              </Link>
            </div>

            {/* Recent Bookings */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Recent Bookings</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-12">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        <img src={booking.image} alt={booking.hotel} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">{booking.hotel}</h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {booking.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Check In</p>
                        <p className="font-medium text-gray-800 dark:text-white">{booking.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Check Out</p>
                        <p className="font-medium text-gray-800 dark:text-white">{booking.checkOut}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Hotels */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedHotels.map((hotel) => (
                <div key={hotel.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  <div className="h-48 overflow-hidden">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{hotel.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {hotel.location}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{hotel.rating}</span>
                      </div>
                      <div>
                        <span className="text-lg font-bold text-indigo-600">₹{hotel.price}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">/night</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}