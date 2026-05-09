export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'HOTEL_OWNER' | 'ADMIN';
  phoneNumber?: string;
}

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

export interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  totalPrice: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
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

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'USER' | 'HOTEL_OWNER';
}