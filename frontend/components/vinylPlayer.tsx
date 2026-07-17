"use client";

import { oswaldBold, oswaldMedium, poppinsMedium, poppinsRegular } from "@/app/layout";
import { useEffect, useRef, useState } from "react";

type Track = {
  title: string;
  artist: string;
  cover: string | null;
  src: string;
  isCustom?: boolean;
};

const DEFAULT_TRACKS: Track[] = [
  { title: "Ivy", artist: "Frank Ocean", cover: "/covers/ivy.jpeg", src: "/audio/ivy.opus" },
  { title: "Wildflower", artist: "Billie Eilish", cover: "/covers/wildflower.jpeg", src: "/audio/wildflower.opus" },
  { title: "Toronto 2014", artist: "Daniel Caesar", cover: "/covers/toronto2014.jpeg", src: "/audio/toronto2014.opus" },
];

export default function VinylPlayer({
  importance = {
    value: "33,4",
    label: "Importance",
    quote: "Less search focused from themes",
    note: "right now people often search song from theme",
    date: "Oct. 2024",
  },
  researchGap = {
    value: "0",
    label: "Research Gap",
    quote: "Mostly",
    note: "Less search focused from themes Meaning right now people",
    date: "Oct. 2024",
  },
  className = "",
}: {
  importance?: { value: string; label: string; quote?: string; note?: string; date?: string };
  researchGap?: { value: string; label: string; quote?: string; note?: string; date?: string };
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [armActive, setArmActive] = useState(false);

  const current = tracks[currentIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const playTrack = (index: number) => {
    setCurrentIndex(index);
    setArmActive(true);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 50);
    setIsPlaying(true);
  };

  const handleTonearmClick = () => {
    if (tracks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * tracks.length);
    playTrack(randomIndex);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setArmActive(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      setArmActive(true);
    }
  };

  const adjustVolume = (delta: number) => {
    setVolume((v) => Math.min(100, Math.max(0, v + delta)));
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    const customTrack: Track = {
      title: "Unknown",
      artist: "Unknown",
      cover: null,
      src: url,
      isCustom: true,
    };

    setTracks((prev) => {
      const withoutOldCustom = prev.filter((t) => !t.isCustom);
      return [...withoutOldCustom, customTrack];
    });

    setCurrentIndex(DEFAULT_TRACKS.length);
    setArmActive(true);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play().catch(() => {}), 80);

    e.target.value = "";
  };

  return (
    <div className={`mx-8 mt-6 ${className}`}>
      {/* Shared, non-visual elements — dipakai baik oleh layout mobile maupun desktop */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <audio
        ref={audioRef}
        src={current?.src}
        onEnded={() => {
          setIsPlaying(false);
          setArmActive(false);
        }}
      />
      {/* ============================= MOBILE LAYOUT ============================= */}
      <div className="sm:hidden w-full rounded-2xl border-2 border-black overflow-hidden bg-white">
        <div className="grid grid-cols-[1fr_100px]">
          {/* KOLOM KIRI: player */}
          <div className="flex flex-col items-center gap-3 border-r-2 border-black bg-[#F5F5F5] p-3">
            {/* Cover + Nama + Artist */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-black bg-black flex items-center justify-center">
                {current?.cover ? (
                  <img src={current.cover} alt={current.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-white" />
                )}
              </div>
              <div className="min-w-0 text-center">
                <p className={`truncate text-xs font-bold ${poppinsMedium.className}`}>
                  {current ? current.title : "No song"}
                </p>
                <p className={`truncate text-[10px] ${poppinsRegular.className}`}>
                  {current ? current.artist : "—"}
                </p>
              </div>
              {/* EQ */}
              <div className="flex items-end gap-[2px] h-4 mt-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={`m-eq-${i}`}
                    className="w-[3px] bg-black rounded-sm"
                    style={{
                      height: isPlaying ? undefined : "4px",
                      animation: isPlaying ? `vinylEq 0.9s ease-in-out ${i * 0.15}s infinite` : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Upload + Arm */}
            <div className="flex items-center justify-between w-full px-1">
              <button
                type="button"
                onClick={handleUploadClick}
                className={`rounded-full border border-black bg-white px-2 py-0.5 text-[10px] font-semibold cursor-pointer hover:bg-black hover:text-white transition ${poppinsRegular.className}`}
              >
                Upload
              </button>

              <button
                type="button"
                onClick={handleTonearmClick}
                aria-label="Play random song"
                className="relative h-8 w-8 cursor-pointer"
              >
                <div className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-black bg-[#c9c9c9]" />
                <div
                  className="absolute right-[6px] top-[10px] h-6 w-[4px] origin-top rounded-full border border-black bg-[#c9c9c9] transition-transform duration-500"
                  style={{
                    transform: armActive ? "rotate(-28deg)" : "rotate(-2deg)",
                  }}
                />
              </button>
            </div>

            {/* Vinyl */}
            <div
              className="relative h-24 w-24 rounded-full shadow-md"
              style={{
                background: "repeating-radial-gradient(circle,#1a1a1a 0px,#1a1a1a 2px,#000 3px,#000 5px)",
                animation: isPlaying ? "vinylSpin 3s linear infinite" : "none",
              }}
            >
              <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-black bg-[#8a8a8a] flex items-center justify-center">
                {current?.cover && (
                  <img src={current.cover} alt={current.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </div>

            {/* -, toggle, + */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustVolume(-10)}
                className="h-7 w-7 rounded-full border-2 border-black bg-gradient-to-b from-[#e6e6e6] to-[#a8a8a8] text-sm font-bold active:scale-95 cursor-pointer"
              >
                −
              </button>
              <button
                onClick={togglePlay}
                aria-pressed={isPlaying}
                className={`relative h-6 w-11 rounded-full border-2 border-black transition cursor-pointer ${
                  isPlaying ? "bg-red-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-black bg-white transition-all ${
                    isPlaying ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
              <button
                onClick={() => adjustVolume(10)}
                className="h-7 w-7 rounded-full border-2 border-black bg-gradient-to-b from-[#e6e6e6] to-[#a8a8a8] text-sm font-bold active:scale-95 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: Importance & Research Gap, penuh tinggi */}
          <div className="flex flex-col">
            <div className="bg-[#7C2121] text-white flex-1 flex flex-col items-center justify-center gap-1 px-1 py-3 text-center">
              <p className={`text-[11px] leading-tight ${oswaldMedium.className}`}>{importance.label}</p>
              <p className={`text-2xl leading-none ${oswaldBold.className}`}>{importance.value}%</p>
            </div>
            <div className="bg-[#6D84D7] text-white flex-1 flex flex-col items-center justify-center gap-1 px-1 py-3 text-center border-t-2 border-black">
              <p className={`text-[11px] leading-tight ${oswaldMedium.className}`}>{researchGap.label}</p>
              <p className={`text-2xl leading-none ${oswaldBold.className}`}>{researchGap.value}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================= DESKTOP LAYOUT (tidak diubah sama sekali) ============================= */}
      <div className="hidden sm:flex sm:flex-col sm:items-end">
        <div className="relative z-0 flex items-center gap-3 rounded-full border-2 border-black bg-white px-3 py-2 shadow-sm mb-3 w-[280px] max-w-full">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-black bg-black flex items-center justify-center">
            {current?.cover ? (
              <img src={current.cover} alt={current.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-3 w-3 rounded-full bg-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`truncate font-bold text-md ${poppinsMedium.className}`}>{current ? current.title : "No song"}</p>
            <p className={`truncate text-xs ${poppinsRegular.className}`}>{current ? current.artist : "—"}</p>
          </div>
          <div className="flex items-end gap-[2px] h-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[3px] bg-black rounded-sm"
                style={{
                  height: isPlaying ? undefined : "4px",
                  animation: isPlaying ? `vinylEq 0.9s ease-in-out ${i * 0.15}s infinite` : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative w-[500px] max-w-full">
          <div className="relative rounded-t-2xl border-2 border-black bg-[#F5F5F5] p-2 overflow-visible">
            <div className="relative">
              <button
                type="button"
                onClick={handleUploadClick}
                className={`rounded-full border-2 border-black bg-white px-4 py-1 text-md font-semibold cursor-pointer hover:bg-black hover:text-white transition ${poppinsRegular.className}`}
              >
                Upload
              </button>

              <button
                type="button"
                onClick={handleTonearmClick}
                aria-label="Play random song"
                className="absolute right-2 top-0 z-30 h-0 w-0"
              >
                <div className="relative">
                  <div className="absolute right-0 top-0 h-5 w-5 rounded-full border-2 border-black bg-[#c9c9c9]" />
                  <div
                    className="absolute right-[8px] top-[14px] h-16 w-[5px] origin-top rounded-full border border-black bg-[#c9c9c9] transition-transform duration-500"
                    style={{
                      transform: armActive ? "rotate(-28deg)" : "rotate(-2deg)",
                    }}
                  />
                </div>
              </button>
            </div>

            <div className="relative flex justify-center items-center h-[290px]">
              <div
                className="relative h-68 w-68 rounded-full shadow-md"
                style={{
                  background: "repeating-radial-gradient(circle,#1a1a1a 0px,#1a1a1a 2px,#000 3px,#000 5px)",
                  animation: isPlaying ? "vinylSpin 3s linear infinite" : "none",
                }}
              >
                <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-black bg-[#8a8a8a] flex items-center justify-center">
                  {current?.cover && (
                    <img src={current.cover} alt={current.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>
            </div>

            <div className="mt-1 grid grid-cols-3 items-center">
              <div className="flex justify-start">
                <button
                  onClick={() => adjustVolume(-10)}
                  className="h-10 w-10 rounded-full border-2 border-black bg-gradient-to-b from-[#e6e6e6] to-[#a8a8a8] text-xl font-bold active:scale-95 cursor-pointer hover:shadow-xl"
                >
                  −
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={togglePlay}
                  aria-pressed={isPlaying}
                  className={`relative h-8 w-16 rounded-full border-2 border-black transition cursor-pointer ${
                    isPlaying ? "bg-red-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-black bg-white transition-all ${
                      isPlaying ? "left-8" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => adjustVolume(10)}
                  className="h-10 w-10 rounded-full border-2 border-black bg-gradient-to-b from-[#e6e6e6] to-[#a8a8a8] text-xl font-bold active:scale-95 cursor-pointer hover:shadow-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-2 border-t-0 border-black rounded-b-2xl overflow-hidden">
            <div className="bg-[#7C2121] pb-1 text-white rounded-bl-2xl">
              <div className="bg-black px-3 py-1">
                <p className={`text-3xl text-center ${oswaldMedium.className}`}>{importance.label}</p>
              </div>
              <div className="px-4 pt-3">
                <div className="flex justify-center">
                  <p className={`text-6xl leading-none ${oswaldBold.className}`}>{importance.value}%</p>
                </div>
                {(importance.quote || importance.note) && (
                  <div className="mt-2 pt-3">
                    <p className={`text-left text-[12px] leading-relaxed ${poppinsRegular.className}`}>
                      {importance.quote} {importance.note}
                      <span className={`ml-2 inline-block rounded-lg bg-[#6D84D7] px-3 py-1 text-[14px] leading-none align-middle shadow-2xl ${poppinsRegular.className}`}>
                        {importance.date}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#6D84D7] pb-1 text-white rounded-br-2xl">
              <div className="bg-white px-3 py-1">
                <p className={`text-3xl text-center text-black ${oswaldMedium.className}`}>{researchGap.label}</p>
              </div>
              <div className="px-4 pt-3">
                <div className="flex justify-center">
                  <p className={`text-6xl leading-none ${oswaldBold.className}`}>{researchGap.value}%</p>
                </div>
                {(researchGap.quote || researchGap.note) && (
                  <div className="mt-2 pt-3">
                    <p className={`text-left text-[12px] leading-relaxed ${poppinsRegular.className}`}>
                      {researchGap.quote} {researchGap.note}
                      <span className={`inline-block rounded-lg bg-[#7C2121] px-3 py-1 text-[14px] leading-none align-middle shadow-2xl ${poppinsRegular.className}`}>
                        {researchGap.date}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes vinylEq {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
      `}</style>
    </div>
  );
}