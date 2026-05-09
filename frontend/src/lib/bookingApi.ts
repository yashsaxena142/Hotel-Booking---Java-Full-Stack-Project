import { api } from './api';

export interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  totalPrice: number;
  status: string;
  bookingDate: string;
  userId: number;
  userName: string;
  hotelId: number;
  hotelName: string;
  hotelLocation: string;
  hotelImage?: string;
}

export interface CreateBookingData {
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  hotelId: number;
}

export const bookingApi = {
  // Create new booking (protected)
  create: async (data: CreateBookingData): Promise<Booking> => {
    return api.post('/bookings', data);
  },

  // Get user's bookings (protected)
  getMyBookings: async (): Promise<Booking[]> => {
    return api.get('/bookings/user');
  },

  // Get booking by ID (protected)
  getById: async (id: number): Promise<Booking> => {
    return api.get(`/bookings/${id}`);
  },

  // Get hotel bookings (protected - hotel owner only)
  getHotelBookings: async (hotelId: number): Promise<Booking[]> => {
    return api.get(`/bookings/hotel/${hotelId}`);
  },

  // Cancel booking (protected)
  cancel: async (id: number): Promise<Booking> => {
    return api.put(`/bookings/${id}/cancel`, {});
  }
};