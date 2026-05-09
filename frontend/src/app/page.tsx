"use client";

import { useEffect, useState } from 'react';
import { fetchHotels, searchHotels, Hotel } from '@/api/hotelApi';
import Navbar from '@/components/Navbar';
import HotelCard from '@/components/HotelCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { MapPin, Calendar, Users, Search, ArrowRight, Star, Award, Gift, X, Facebook, Twitter, Instagram, Youtube, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  const [sortOption, setSortOption] = useState('recommended');

  // Popular destinations data (keep this static)
  const popularDestinations = [
    { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 245, country: 'India', slug: 'goa' },
    { name: 'Manali', image: 'https://images.unsplash.com/photo-1655470062377-ef3f5161960a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', count: 189, country: 'India', slug: 'manali' },
    { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', count: 312, country: 'India', slug: 'kerala' },
    { name: 'Udaipur', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 167, country: 'India', slug: 'udaipur' },
    { name: 'Ladakh', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 98, country: 'India', slug: 'ladakh' },
    { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 203, country: 'India', slug: 'jaipur' },
    { name: 'Rishikesh', image: 'https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 156, country: 'India', slug: 'rishikesh' },
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 421, country: 'India', slug: 'mumbai' },
  ];

  useEffect(() => {
    loadInitialHotels();
  }, []);

  const loadInitialHotels = async () => {
    try {
      setLoading(true);
      const data = await fetchHotels();
      setHotels(data);
      setSearchResults(data);
      setError(null);
    } catch (err) {
      setError('Failed to load hotels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      // If search is empty, show all hotels
      setSearchResults(hotels);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchHotels(searchTerm);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search hotels');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If search is cleared, show all hotels
    if (!value.trim()) {
      setSearchResults(hotels);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(hotels);
  };

  const handleDestinationClick = (destination: string) => {
    setSearchTerm(destination);
    // Trigger search for the destination
    searchHotels(destination).then(results => {
      setSearchResults(results);
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
  };

  // Sort function
  const sortHotels = (hotelsToSort: Hotel[]) => {
    const sorted = [...hotelsToSort];
    
    switch(sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => (a.pricePerNight || 0) - (b.pricePerNight || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.pricePerNight || 0) - (a.pricePerNight || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'recommended':
      default:
        // For recommended, sort by rating first, then price
        return sorted.sort((a, b) => {
          // First by rating
          const ratingDiff = (b.rating || 0) - (a.rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          // Then by price (lower is better)
          return (a.pricePerNight || 0) - (b.pricePerNight || 0);
        });
    }
  };

  // Sample top deals hotels
  const topDealsHotels = hotels.filter(hotel => (hotel.rating || 0) >= 4.5).slice(0, 6);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  // Get the base hotels to display (search results or all hotels)
  const baseHotels = searchTerm ? searchResults : hotels;
  
  // Apply sorting
  const displayedHotels = sortHotels(baseHotels);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section with Image Background */}
      <div className="relative h-[500px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.00) 40%, rgba(0, 0, 0, 0.60) 100%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          }}
        />
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4 mt-16">
            <h1 className="text-center text-white text-4xl md:text-5xl font-bold mb-4">
              Your next trip starts here
            </h1>
            
            {/* Search Card */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <form onSubmit={handleSearch} className="space-y-4">
                {/* Search Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Location Field - Takes more space */}
                  <div className="relative md:col-span-5">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                      Where to?
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg hover:border-indigo-400 transition-colors">
                      <MapPin className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Search destinations or hotel names"
                        className="w-full p-3 pl-2 rounded-lg focus:outline-none"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="mr-2 p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dates Field */}
                  <div className="relative md:col-span-3">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                      Dates
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg hover:border-indigo-400 transition-colors">
                      <Calendar className="w-5 h-5 text-gray-400 ml-3" />
                      <input
                        type="text"
                        placeholder="Fri, 6 Mar - Sun, 8 Mar"
                        className="w-full p-3 pl-2 rounded-lg focus:outline-none text-gray-700"
                        defaultValue="Fri, 6 Mar - Sun, 8 Mar"
                      />
                    </div>
                  </div>

                  {/* Travellers Field */}
                  <div className="relative md:col-span-2">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                      Travellers
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg hover:border-indigo-400 transition-colors">
                      <Users className="w-5 h-5 text-gray-400 ml-3" />
                      <input
                        type="text"
                        placeholder="2 travellers, 1 room"
                        className="w-full p-3 pl-2 rounded-lg focus:outline-none text-gray-700"
                        defaultValue="2 travellers, 1 room"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 h-full"
                    >
                      {isSearching ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Searching...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          <span>Search</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Results Count and Sort */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{displayedHotels.length}</span> hotels found
            {searchTerm && (
              <span className="ml-2 text-sm text-gray-500">
                for "{searchTerm}"
              </span>
            )}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
            <select 
              value={sortOption}
              onChange={handleSortChange}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating: Highest First</option>
            </select>
          </div>
        </div>

        {/* Hotel Grid */}
        {displayedHotels.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No hotels found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm 
                ? `We couldn't find any hotels matching "${searchTerm}"`
                : 'Try adjusting your search criteria'}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}

        {/* Top Hotels with Great Deals Section */}
        {!searchTerm && topDealsHotels.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                  <Award className="w-8 h-8 text-indigo-600 mr-3" />
                  Top Hotels with Great Deals
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Exclusive offers on our most popular hotels
                </p>
              </div>
              <Link href="/deals" className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center">
                View all deals
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topDealsHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </section>
        )}

        {/* Popular Destinations Section */}
        {!searchTerm && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                  <Star className="w-8 h-8 text-indigo-600 mr-3" />
                  Popular Destinations
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Most searched destinations by travelers
                </p>
              </div>
              <Link href="/destinations" className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center">
                Explore all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularDestinations.map((destination, index) => (
                <button
                  key={index}
                  onClick={() => handleDestinationClick(destination.name)}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-left"
                >
                  <div className="relative h-48">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="text-sm opacity-90">{destination.country}</p>
                      <p className="text-sm mt-1 flex items-center">
                        <Gift className="w-3 h-3 mr-1" />
                        {destination.count} hotels
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#191e3b] text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">HB</span>
                </div>
                <span className="text-xl font-bold text-white">
                  Hotel<span className="text-indigo-400">Booking</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Discover the perfect stay for your next adventure. From luxury resorts to cozy boutiques, we've got you covered.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Press</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-gray-400">+91 123 456 7890</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-gray-400">support@hotelbooking.com</span>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-gray-400">123 Travel Street, Mumbai, India 400001</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} HotelBooking. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">
                  Terms of Use
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}