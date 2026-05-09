"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Hotel, PlusCircle, Users, DollarSign, Star, Calendar, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { hotelApi, Hotel as HotelType } from '@/lib/hotelApi';
import { bookingApi, Booking } from '@/lib/bookingApi';

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Calculate stats from real data
  const stats = {
    totalHotels: hotels.length,
    totalBookings: recentBookings.length,
    revenue: recentBookings.reduce((sum, b) => sum + b.totalPrice, 0),
    averageRating: hotels.length > 0 
      ? (hotels.reduce((sum, h) => sum + (h.rating || 0), 0) / hotels.length).toFixed(1)
      : 0,
    occupancyRate: 78, // This would need more complex calculation
    pendingBookings: recentBookings.filter(b => b.status === 'PENDING').length
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      // Fetch owner's hotels
      const myHotels = await hotelApi.getMyHotels();
      setHotels(myHotels);

      // Fetch bookings for all hotels (you might need a separate endpoint for this)
      // For now, we'll fetch bookings for each hotel
      const allBookings: Booking[] = [];
      for (const hotel of myHotels) {
        try {
          const hotelBookings = await bookingApi.getHotelBookings(hotel.id);
          allBookings.push(...hotelBookings);
        } catch (err) {
          console.error(`Error fetching bookings for hotel ${hotel.id}:`, err);
        }
      }
      // Sort by booking date (most recent first)
      allBookings.sort((a, b) => 
        new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      );
      setRecentBookings(allBookings.slice(0, 5)); // Show only 5 most recent
    } catch (err: any) {
      console.error('Error fetching owner data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (hotelId: number) => {
    if (!confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      return;
    }

    try {
      await hotelApi.delete(hotelId);
      // Refresh hotels list
      fetchOwnerData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete hotel');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="HOTEL_OWNER">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="HOTEL_OWNER">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="container mx-auto px-4 py-12">
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
              <p className="text-indigo-100">Manage your hotels and track performance</p>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="container mx-auto px-4 py-12">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Hotels</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalHotels}</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                    <Hotel className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalBookings}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue (MTD)</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{stats.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.averageRating}</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.occupancyRate}%</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.pendingBookings}</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Link href="/owner/hotels/new" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group">
                <PlusCircle className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-1">Add New Hotel</h3>
                <p className="text-sm text-indigo-100">List your property and start earning</p>
              </Link>

              <Link href="/owner/hotels" 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group">
                <Hotel className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Manage Hotels</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Edit, update, or remove your listings</p>
              </Link>

              <Link href="/owner/analytics" 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group">
                <TrendingUp className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">View performance metrics and reports</p>
              </Link>

              <Link href="/owner/bookings" 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group">
                <Calendar className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">All Bookings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">View and manage all reservations</p>
              </Link>
            </div>

            {/* My Hotels */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Hotels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {hotels.slice(0, 3).map((hotel) => (
                <div key={hotel.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    {hotel.imageUrl ? (
                      <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <Hotel className="w-12 h-12 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Link href={`/owner/hotels/${hotel.id}/edit`} 
                        className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
                        <Edit className="w-4 h-4 text-indigo-600" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteHotel(hotel.id)}
                        className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{hotel.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{hotel.location}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {hotel.rating || 'New'}
                        </span>
                      </div>
                      <div>
                        <span className="text-lg font-bold text-indigo-600">₹{hotel.pricePerNight}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">/night</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {hotels.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No hotels yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Start by adding your first hotel</p>
                  <Link href="/owner/hotels/new" 
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Hotel
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Bookings */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Recent Bookings</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {recentBookings.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Hotel</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Guest</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Check In</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">{booking.hotelName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{booking.userName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">₹{booking.totalPrice}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/owner/bookings/${booking.id}`} className="text-indigo-600 hover:text-indigo-700">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No bookings yet
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}