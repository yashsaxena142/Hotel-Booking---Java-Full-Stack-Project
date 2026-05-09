"use client";

import { useState } from 'react';
import { Hotel } from '@/api/hotelApi';
import { createBooking } from '@/api/bookingApi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, MapPin, Wifi, Coffee, Dumbbell, Wind, Car, Waves, 
  Calendar, Users, ArrowLeft, Heart, Share2, Check, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Props {
  hotel: Hotel;
}

export default function HotelDetailsClient({ hotel }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Calculate minimum dates (today and tomorrow)
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Combine main image with additional images
  const allImages = [hotel.imageUrl, ...(hotel.images || [])].filter(Boolean);

  // Amenity icons mapping
  const amenityIcons: { [key: string]: any } = {
    'wifi': Wifi,
    'breakfast': Coffee,
    'gym': Dumbbell,
    'ac': Wind,
    'parking': Car,
    'pool': Waves,
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return hotel.pricePerNight * nights * rooms;
  };

  const calculateTaxes = () => {
    return Math.round(calculateTotal() * 0.12);
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTaxes();
  };

  const handleBooking = async () => {
    if (!user) {
      // Redirect to login with return URL
      sessionStorage.setItem('redirectAfterLogin', `/hotels/${hotel.id}`);
      router.push('/login?message=Please login to book this hotel');
      return;
    }

    // Validate dates
    if (!checkIn || !checkOut) {
      setBookingError('Please select check-in and check-out dates');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setBookingError('Check-out date must be after check-in date');
      return;
    }

    setBookingError('');
    setIsBooking(true);

    try {
      const bookingData = {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        numberOfRooms: rooms,
        hotelId: hotel.id,
      };

      const booking = await createBooking(bookingData);
      setBookingSuccess(true);
      
      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        router.push('/my-bookings');
      }, 2000);
    } catch (error: any) {
      console.error('Booking error:', error);
      setBookingError(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to search
      </Link>

      {/* Success Message */}
      {bookingSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
          <div>
            <p className="text-green-800 dark:text-green-200 font-semibold">Booking Confirmed!</p>
            <p className="text-green-600 dark:text-green-400 text-sm">Redirecting to your bookings...</p>
          </div>
        </div>
      )}

      {/* Hotel Name and Actions */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{hotel.name}</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPin className="w-5 h-5 mr-1" />
            <span>{hotel.location}</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
          </button>
          <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">
          <div className="relative h-96 rounded-xl overflow-hidden">
            <Image
              src={allImages[selectedImage] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
              alt={hotel.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {allImages.slice(1, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index + 1)}
              className="relative h-48 rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
            >
              <Image
                src={image}
                alt={`${hotel.name} - Image ${index + 2}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Hotel Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Rating and Reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{hotel.rating?.toFixed(1) || 'New'}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= (hotel.stars || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {/* {hotel.reviews || 0} verified reviews */}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">About this hotel</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {hotel.description || 'No description available.'}
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.amenities?.map((amenity, index) => {
                const Icon = amenityIcons[amenity.toLowerCase()] || Check;
                return (
                  <div key={index} className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24">
            <div className="mb-6">
              <span className="text-3xl font-bold text-indigo-600">₹{hotel.pricePerNight}</span>
              <span className="text-gray-500 dark:text-gray-400">/night</span>
            </div>

            {bookingError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{bookingError}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Check-in/Check-out */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Dates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="date"
                      value={checkIn}
                      min={today}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (checkOut && new Date(e.target.value) >= new Date(checkOut)) {
                          setCheckOut('');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Check-in"
                    />
                    <p className="text-xs text-gray-500 mt-1">Check-in</p>
                  </div>
                  <div>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || tomorrow}
                      disabled={!checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Check-out"
                    />
                    <p className="text-xs text-gray-500 mt-1">Check-out</p>
                  </div>
                </div>
              </div>

              {/* Guests and Rooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Guests
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    min="1"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => setGuests(guests + 1)}
                    className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rooms
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                    min="1"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => setRooms(rooms + 1)}
                    className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    ₹{hotel.pricePerNight} x {calculateNights()} nights x {rooms} room{rooms > 1 ? 's' : ''}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Taxes & fees (12%)</span>
                  <span className="font-semibold text-gray-800 dark:text-white">₹{calculateTaxes()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-800 dark:text-white">Total</span>
                  <span className="text-indigo-600">₹{calculateGrandTotal()}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={isBooking || bookingSuccess}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : bookingSuccess ? (
                  <div className="flex items-center justify-center">
                    <Check className="w-5 h-5 mr-2" />
                    Booked!
                  </div>
                ) : (
                  'Book Now'
                )}
              </button>

              {!user && (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                  Please <Link href="/login" className="text-indigo-600 hover:text-indigo-700">login</Link> to book this hotel
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}