"use client";

import { Hotel } from '@/types/hotel';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, MapPin } from 'lucide-react';
import Link from 'next/link';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Sample images array - in real app, these would come from your hotel data
  const hotelImages = hotel.images || [
    hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
  ];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + hotelImages.length) % hotelImages.length);
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  // Calculate discounted price (example: 10% off)
  const originalPrice = hotel.pricePerNight || 6325;
  const discountedPrice = Math.round(originalPrice * 0.9);
  const totalPrice = discountedPrice * 2; // Assuming 2 nights
  const rating = hotel.rating || 4.5;
  const reviewCount = 128;

  return (
    <Link href={`/hotels/${hotel.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        {/* Image Carousel Section */}
        <div className="relative h-56 bg-gray-200 dark:bg-gray-700">
          {hotelImages.length > 0 && (
            <>
              <Image
                src={hotelImages[currentImageIndex]}
                alt={hotel.name}
                fill
                className="object-cover"
              />
              
              {/* Carousel Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Save Button */}
          <button
            onClick={toggleSave}
            className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          {/* Price Tag */}
          <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-lg">
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">₹{hotel.pricePerNight || 199}</span>
            <span className="text-gray-600 dark:text-gray-300 text-xs">/night</span>
          </div>

          {/* Availability Badge */}
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {hotel.available ? 'Available' : 'Limited'}
          </div>
        </div>

        {/* Hotel Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
                {hotel.name}
              </h3>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {hotel.location}
              </div>
            </div>
            <div className="flex items-center bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center mb-3">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= (hotel.stars || 4) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({reviewCount} reviews)
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {hotel.description || 'Experience luxury and comfort in the heart of the city with stunning views and exceptional service.'}
          </p>

          {/* Deal Badge and Price */}
          <div className="flex items-center justify-between">
            <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
              10% off
            </span>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{discountedPrice.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                includes taxes & fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;