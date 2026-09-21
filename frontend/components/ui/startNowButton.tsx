"use client";

import { useState } from "react";
import { jockeyOneRegular } from "@/app/layout";

/**
 * Tombol "Start Now". Efek hover (jadi merah) di layar besar sekarang
 * juga jalan saat ditekan/di-tap di layar kecil, lewat state React
 * (onMouseEnter/Leave untuk hover, onTouchStart/End untuk tap) —
 * bukan cuma lewat class CSS hover:/active:, supaya perubahannya
 * konsisten kerender di semua device.
 */
export default function StartNowButton() {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onMouseEnter={() => setPressed(true)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      className={`rounded-3xl lg:rounded-4xl text-center cursor-pointer border-black transition-all mt-1.5 ${
        pressed ? "bg-red-500 text-white shadow-lg" : "bg-black text-white"
      }`}
    >
      <button
        className={`${jockeyOneRegular.className} text-base sm:text-xl md:text-xl lg:text-2xl font-bold px-6 py-2 lg:px-8 lg:py-3 cursor-pointer`}
      >
        Start Now
      </button>
    </div>
  );
}
