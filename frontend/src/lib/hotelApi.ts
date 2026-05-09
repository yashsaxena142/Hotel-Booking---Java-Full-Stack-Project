import { api } from './api';

export interface Hotel {
  id: number;
  name: string;
  description: string;
  location: string;
  address: string;
  pricePerNight: number;
  rating: number;
  stars: number;
  imageUrl: string;
  available: boolean;
  amenities: string[];
  images: string[];
  ownerId: number;
  ownerName: string;
}

export interface CreateHotelData {
  name: string;
  description: string;
  location: string;
  address: string;
  pricePerNight: number;
  stars: number;
  imageUrl: string;
  available: boolean;
  amenities: string[];
  images: string[];
}

export const hotelApi = {
  // Get all hotels (public)
  getAll: async (): Promise<Hotel[]> => {
    return api.get('/hotels');
  },

  // Get hotel by ID (public)
  getById: async (id: number): Promise<Hotel> => {
    return api.get(`/hotels/${id}`);
  },

  // Search hotels (public)
  search: async (query: string): Promise<Hotel[]> => {
    return api.get(`/hotels/search?q=${encodeURIComponent(query)}`);
  },

  // Get hotels by owner (protected - hotel owner only)
  getMyHotels: async (): Promise<Hotel[]> => {
    return api.get('/hotels/owner');
  },

  // Create new hotel (protected - hotel owner only)
  create: async (data: CreateHotelData): Promise<Hotel> => {
    return api.post('/hotels', data);
  },

  // Update hotel (protected - hotel owner only)
  update: async (id: number, data: Partial<CreateHotelData>): Promise<Hotel> => {
    return api.put(`/hotels/${id}`, data);
  },

  // Delete hotel (protected - hotel owner only)
  delete: async (id: number): Promise<void> => {
    return api.delete(`/hotels/${id}`);
  }
};