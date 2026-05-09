import HotelCard from "./HotelCard";
import type { Hotel } from "@/types/hotel";

interface Props {
  hotels: Hotel[];
}

export default function HotelList({ hotels }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {hotels.map(hotel => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}

