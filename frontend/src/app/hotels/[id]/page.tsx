import { fetchHotelById } from "@/api/hotelApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelDetailsClient from "./HotelDetailsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function HotelDetailsPage({ params }: Props) {
  const { id } = await params;
  const hotelId = parseInt(id);
  
  try {
    const hotel = await fetchHotelById(hotelId);
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <HotelDetailsClient hotel={hotel} />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Hotel not found</h1>
            <p className="text-gray-600">The hotel you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}