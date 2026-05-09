"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();

  const [city, setCity] = useState("");

  const onSearch = () => {
    router.push(`/?city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="City"
          className="flex-1 rounded-lg border px-3 py-2"
        />

        <button
          onClick={onSearch}
          className="rounded-lg bg-black px-6 py-2 text-white"
        >
          Search
        </button>
      </div>
    </div>
  );
}
