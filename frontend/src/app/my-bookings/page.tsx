"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, XCircle, Eye, Download, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getMyBookings, cancelBooking, Booking } from '@/api/bookingApi';
import { fetchHotelById } from '@/api/hotelApi';

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      // Refresh bookings after cancellation
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const handleBookAgain = (hotelId: number) => {
    window.location.href = `/hotels/${hotelId}`;
  };

  // Filter bookings based on status and search
  const filteredBookings = bookings.filter(booking => {
    // Filter by tab
    const now = new Date();
    const checkOut = new Date(booking.checkOutDate);
    
    let statusMatch = true;
    if (activeTab === 'upcoming') {
      statusMatch = booking.status === 'CONFIRMED' && checkOut >= now;
    } else if (activeTab === 'past') {
      statusMatch = booking.status === 'COMPLETED' || (booking.status === 'CONFIRMED' && checkOut < now);
    } else if (activeTab === 'cancelled') {
      statusMatch = booking.status === 'CANCELLED';
    }

    // Filter by search term
    const searchMatch = !searchTerm || 
      booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotelLocation.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  // Group by status for stats
  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => 
      b.status === 'CONFIRMED' && new Date(b.checkOutDate) >= new Date()
    ).length,
    completed: bookings.filter(b => 
      b.status === 'COMPLETED' || (b.status === 'CONFIRMED' && new Date(b.checkOutDate) < new Date())
    ).length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatGuests = (guests: number, rooms: number) => {
    return `${guests} ${guests === 1 ? 'Adult' : 'Adults'}, ${rooms} ${rooms === 1 ? 'Room' : 'Rooms'}`;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading your bookings...</p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="container mx-auto px-4 py-12">
              <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
              <p className="text-indigo-100">View and manage all your hotel reservations</p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-green-600">{stats.upcoming}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex space-x-4 mb-4 md:mb-0">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'upcoming'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Upcoming ({stats.upcoming})
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'past'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Past ({stats.completed})
                </button>
                <button
                  onClick={() => setActiveTab('cancelled')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'cancelled'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Cancelled ({stats.cancelled})
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No bookings found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm 
                    ? `No ${activeTab} bookings matching "${searchTerm}"`
                    : `You don't have any ${activeTab} bookings`}
                </p>
                <Link 
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Browse Hotels
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                    <div className="md:flex">
                      {/* Hotel Image */}
                      <div className="md:w-64 h-48 md:h-auto relative bg-gray-200">
                        <img 
                          // src={booking.hotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                          src={'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                          alt={booking.hotelName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945';
                          }}
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{booking.hotelName}</h3>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{booking.hotelLocation}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Booked on {formatDate(booking.bookingDate)}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Check In</p>
                              <p className="font-semibold text-gray-800 dark:text-white">{formatDate(booking.checkInDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Check Out</p>
                              <p className="font-semibold text-gray-800 dark:text-white">{formatDate(booking.checkOutDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-5 h-5 text-indigo-600 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Guests</p>
                              <p className="font-semibold text-gray-800 dark:text-white">
                                {formatGuests(booking.numberOfGuests, booking.numberOfRooms)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                              <p className="text-xl font-bold text-indigo-600">₹{booking.totalPrice.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <Link
                            href={`/hotels/${booking.hotelId}`}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Hotel
                          </Link>
                          {activeTab === 'upcoming' && booking.status !== 'CANCELLED' && (
                            <>
                              <button 
                                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center"
                                onClick={() => {/* Download invoice functionality */}}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Invoice
                              </button>
                              <button 
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancellingId === booking.id}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {cancellingId === booking.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel
                                  </>
                                )}
                              </button>
                            </>
                          )}
                          {activeTab === 'past' && (
                            <button 
                              onClick={() => handleBookAgain(booking.hotelId)}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              Book Again
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}