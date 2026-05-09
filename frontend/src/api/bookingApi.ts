const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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
}

export interface CreateBookingData {
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  hotelId: number;
}

// Create new booking (protected)
export async function createBooking(data: CreateBookingData): Promise<Booking> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('You must be logged in to book a hotel');
  }

  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create booking');
  }

  return response.json();
}

// Get user's bookings (protected)
export async function getMyBookings(): Promise<Booking[]> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('You must be logged in');
  }

  const response = await fetch(`${API_BASE_URL}/bookings/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  return response.json();
}

// Get booking by ID (protected)
export async function getBookingById(id: number): Promise<Booking> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch booking');
  }

  return response.json();
}

// Cancel booking (protected)
export async function cancelBooking(id: number): Promise<Booking> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('You must be logged in');
  }

  const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to cancel booking');
  }

  return response.json();
}