const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

// Fetch all hotels
export async function fetchHotels(): Promise<Hotel[]> {
  try {
    const url = `${API_BASE_URL}/hotels`;
    
    console.log('Fetching hotels from:', url);
    
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Received hotels data:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
    throw error;
  }
}

// Fetch single hotel by ID
export async function fetchHotelById(id: number): Promise<Hotel> {
  try {
    const url = `${API_BASE_URL}/hotels/${id}`;
    
    console.log('Fetching hotel by ID:', url);
    
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Received hotel data:', data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch hotel with ID ${id}:`, error);
    throw error;
  }
}

// Search hotels
export async function searchHotels(query: string): Promise<Hotel[]> {
  try {
    const url = `${API_BASE_URL}/hotels/search?q=${encodeURIComponent(query)}`;
    
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Failed to search hotels:', error);
    throw error;
  }
}

// Get hotels by owner (protected)
export async function getMyHotels(): Promise<Hotel[]> {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_BASE_URL}/hotels/owner`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch your hotels');
  }
  
  return res.json();
}

// Create new hotel (protected)
export async function createHotel(data: CreateHotelData): Promise<Hotel> {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_BASE_URL}/hotels`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error('Failed to create hotel');
  }
  
  return res.json();
}

// Update hotel (protected)
export async function updateHotel(id: number, data: Partial<CreateHotelData>): Promise<Hotel> {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_BASE_URL}/hotels/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error('Failed to update hotel');
  }
  
  return res.json();
}

// Delete hotel (protected)
export async function deleteHotel(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_BASE_URL}/hotels/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete hotel');
  }
}