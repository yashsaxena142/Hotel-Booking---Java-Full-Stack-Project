"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Hotel, PlusCircle, Edit, Trash2, Eye, Star, MapPin } from 'lucide-react';
import { hotelApi, Hotel as HotelType } from '@/lib/hotelApi';

export default function OwnerHotelsPage() {
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await hotelApi.getMyHotels();
      setHotels(data);
    } catch (err: any) {
      console.error('Error fetching hotels:', err);
      setError(err.message || 'Failed to load hotels');
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
      // Refresh the list
      fetchHotels();
    } catch (err: any) {
      alert(err.message || 'Failed to delete hotel');
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
              <p className="text-gray-600 dark:text-gray-300">Loading your hotels...</p>
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
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold mb-2">My Hotels</h1>
                  <p className="text-indigo-100">Manage your hotel listings</p>
                </div>
                <Link
                  href="/owner/hotels/new"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add New Hotel
                </Link>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {hotels.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <Hotel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No hotels yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Start by adding your first hotel listing</p>
                <Link
                  href="/owner/hotels/new"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add Your First Hotel
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                    <div className="h-48 bg-gray-200 relative">
                      {hotel.imageUrl ? (
                        <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                          <Hotel className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Link
                          href={`/owner/hotels/${hotel.id}/edit`}
                          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-indigo-600" />
                        </Link>
                        <button
                          onClick={() => handleDeleteHotel(hotel.id)}
                          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          hotel.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {hotel.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{hotel.name}</h3>
                        <Link
                          href={`/hotels/${hotel.id}`}
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{hotel.location}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {hotel.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {hotel.rating ? hotel.rating.toFixed(1) : 'New'}
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
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}