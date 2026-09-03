"use client";

import { oswaldBold, oswaldMedium, poppinsMedium, poppinsRegular } from "@/app/layout";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";


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
    date: "Mic, 2024",
    citationTitle: "Two Stages Song Subject Classification on Indonesian Song Based on Lyrics, Genre & Artist",
    authors: "Aziz, R., Bijaksana, M., & Adiwijaya, K",
    publication: "2019 7th International Conference on Information and Communication Technology (ICoICT), 1-6",
    doi: "https://doi.org/10.1109/ICoICT.2019.8835232",
    explanation: "33,4% dan 17,9% dari 427 pendengar musik sering mencari lagu berdasarkan tema atau subjek utama yang diangkat dalam lirik. Hal ini menunjukkan bahwa dalam proses mendengarkan maupun pencarian musik, pengguna juga mempertimbangkan konteks makna dan pesan yang ada pada lirik lagu bukan hanya melodi atau ritme.",
  },
  researchGap = {
    value: "0",
    label: "Research Gap",
    quote: "Mostly",
    note: "Less search focused from themes Meaning right now people",
    date: "Daniel, 2024",
    citationTitle: "Two Stages Song Subject Classification on Indonesian Song Based on Lyrics, Genre & Artist",
    authors: "Aziz, R., Bijaksana, M., & Adiwijaya, K",
    publication: "2019 7th International Conference on Information and Communication Technology (ICoICT), 1-6",
    doi: "https://doi.org/10.1109/ICoICT.2019.8835232",
    explanation: "33,4% dan 17,9% dari 427 pendengar musik sering mencari lagu berdasarkan tema atau subjek utama yang diangkat dalam lirik. Hal ini menunjukkan bahwa dalam proses mendengarkan maupun pencarian musik, pengguna juga mempertimbangkan konteks makna dan pesan yang ada pada lirik lagu bukan hanya melodi atau ritme.",
  },
  className = "",
}: {
  importance?: { value: string; label: string; quote?: string; note?: string; date?: string; citationTitle?: string; authors?: string; publication?:string; doi?: string; explanation?: string;};
  researchGap?: { value: string; label: string; quote?: string; note?: string; date?: string; citationTitle?: string; authors?: string; publication?:string; doi?: string; explanation?: string;};
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [popupIndex, setPopupIndex] = useState<number | null>(null);

  type detailKey = "importance" | "researchGap" | null;
  const [activeDetail, setActiveDetail] = useState<detailKey>(null);

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

  useEffect(() => {
    document.body.style.overflow =
      activeDetail !== null ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeDetail]);

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
    <div className={className}>
      <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
      <audio
        ref={audioRef}
        src={current?.src}
        onEnded={() => {
          setIsPlaying(false);
          setArmActive(false);
        }}
      />

      <div className="sm:hidden mx-4 rounded-2xl border-2 border-black overflow-hidden bg-white flex flex-col">
        <div className="flex items-center gap-3 border-b-2 border-black bg-white px-3 py-2">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-black bg-black flex items-center justify-center">
            {current?.cover ? (
              <img src={current.cover} alt={current.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-3 w-3 rounded-full bg-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm font-bold ${poppinsMedium.className}`}>{current ? current.title : "No song"}</p>
            <p className={`truncate text-xs ${poppinsRegular.className}`}>{current ? current.artist : "—"}</p>
          </div>
          <div className="flex items-end gap-[2px] h-4">
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

        <div className="flex flex-col items-center gap-3 bg-[#F5F5F5] p-3">
          <div className="flex items-center justify-between w-full px-1">
            <button
              type="button"
              onClick={handleUploadClick}
              className={`rounded-full border border-black bg-white px-3 py-1 text-xs font-semibold cursor-pointer hover:bg-black hover:text-white active:bg-black active:text-white transition ${poppinsRegular.className}`}
            >
              Upload
            </button>

            <button type="button" onClick={handleTonearmClick} aria-label="Play random song" className="relative h-8 w-8 cursor-pointer">
              <div className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-black bg-[#c9c9c9]" />
              <div
                className="absolute right-[6px] top-[10px] h-6 w-[4px] origin-top rounded-full border border-black bg-[#c9c9c9] transition-transform duration-500"
                style={{ transform: armActive ? "rotate(-28deg)" : "rotate(-2deg)" }}
              />
            </button>
          </div>

          <div
            className="relative h-32 w-32 rounded-full shadow-md"
            style={{
              background: "repeating-radial-gradient(circle,#1a1a1a 0px,#1a1a1a 2px,#000 3px,#000 5px)",
              animation: isPlaying ? "vinylSpin 3s linear infinite" : "none",
            }}
          >
            <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-black bg-[#8a8a8a] flex items-center justify-center">
              {current?.cover && <img src={current.cover} alt={current.title} className="h-full w-full object-cover" />}
            </div>
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustVolume(-10)}
              className="h-8 w-8 rounded-full border-2 border-black bg-gradient-to-b from-[#e6e6e6] to-[#a8a8a8] text-base font-bold active:scale-95 cursor-pointer"
            >
              −
            </button>
            <button
              onClick={togglePlay}
              aria-pressed={isPlaying}
              className={`relative h-7 w-14 rounded-full border-2 border-black transition cursor-pointer ${isPlaying ? "bg-red-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-black bg-white transition-all ${isPlaying ? "left-7" : "left-0.5"}`}
              />
            </button>
            <button
              onClick={() => adjustVolume(10)}
              className="h-8 w-8 rounded-full border-2 border-black bg-gradient-to-b from-[#e6e6e6] to-[#a8a8a8] text-base font-bold active:scale-95 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div> 

      <div className="hidden sm:flex sm:flex-col items-center lg:items-end mx-4 lg:mx-0">
        <div className="relative z-0 flex items-center gap-3 rounded-full border-2 border-black bg-white px-3 py-2 shadow-sm mb-3 w-[220px] md:w-[250px] lg:w-[280px] max-w-full">
          <div className="h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 shrink-0 overflow-hidden rounded-full border border-black bg-black flex items-center justify-center">
            {current?.cover ? (
              <img src={current.cover} alt={current.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-3 w-3 rounded-full bg-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`truncate font-bold text-sm md:text-md ${poppinsMedium.className}`}>{current ? current.title : "No song"}</p>
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

        <div className="relative w-[500px] md:w-[500px] lg:w-[500px] max-w-full">
          <div className="relative rounded-t-2xl border-2 border-black bg-[#F5F5F5] p-2 overflow-visible">
            <div
              className="absolute right-2 top-0 z-30"
              style={{
                width: "300px",
                height: "280px",
              }}
            >
              <div
                className="absolute right-5 top-2 z-10"
                style={{
                  width: "46px",
                  height: "46px",
                }}
              >
                <img
                  src="/rectangleStylus.svg"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                />
              </div>

              <div
                className="absolute inset-0 z-20"
                style={{
                  transformOrigin: "257px 31px",
                  transform: armActive ? "rotate(0deg)" : "rotate(-24deg)",
                  transition:
                    "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <svg
                  viewBox="0 0 300 280"
                  className="absolute inset-0 h-full w-full overflow-visible"
                  aria-hidden="true"
                >
                  <path
                    d="
                      M 257 31
                      C 248 61, 240 86, 231 112
                      C 222 139, 208 164, 187 177
                      C 170 188, 151 195, 131 210
                    "
                    fill="none"
                    stroke="#111111"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="
                      M 257 31
                      C 248 61, 240 86, 231 112
                      C 222 139, 208 164, 187 177
                      C 170 188, 151 195, 131 210
                    "
                    fill="none"
                    stroke="#E5E5E5"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <rect
                    x="245"
                    y="39"
                    width="23"
                    height="15"
                    rx="5"
                    fill="#222"
                    transform="rotate(16 256 46)"
                  />

                  <rect
                    x="123"
                    y="203"
                    width="27"
                    height="14"
                    rx="5"
                    fill="#222"
                    transform="rotate(-25 136 210)"
                  />

                  <g transform="translate(95 207) rotate(-25)">
                    <path
                      d="
                        M 0 5
                        Q 4 0 12 0
                        L 48 0
                        Q 55 0 59 6
                        L 64 18
                        Q 65 24 58 27
                        L 12 27
                        Q 4 27 1 21
                        Z
                      "
                      fill="#222"
                      stroke="#000"
                      strokeWidth="2"
                    />

                    <rect
                      x="16"
                      y="4"
                      width="25"
                      height="5"
                      rx="2"
                      fill="#666"
                    />

                    <circle cx="17" cy="17" r="2.5" fill="#aaa" />
                    <circle cx="27" cy="17" r="2.5" fill="#aaa" />

                    <path
                      d="M 56 18 L 68 24 L 64 29 L 53 23 Z"
                      fill="#555"
                      stroke="#000"
                      strokeWidth="1.5"
                    />

                    <path
                      d="M 67 24 L 74 34"
                      stroke="#111"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="75"
                      cy="35"
                      r="2"
                      fill="#111"
                    />
                  </g>
                </svg>
              </div>
            </div>

            <div className="relative flex justify-center items-center h-[210px] md:h-[250px] lg:h-[290px]">
              <div
                className="relative h-44 w-44 md:h-56 md:w-56 lg:h-68 lg:w-68 rounded-full shadow-md"
                style={{
                  background: "repeating-radial-gradient(circle,#1a1a1a 0px,#1a1a1a 2px,#000 3px,#000 5px)",
                  animation: isPlaying ? "vinylSpin 3s linear infinite" : "none",
                }}
              >
                <div className="absolute left-1/2 top-1/2 h-16 w-16 md:h-[72px] md:w-[72px] lg:h-20 lg:w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-black bg-[#8a8a8a] flex items-center justify-center">
                  {current?.cover && <img src={current.cover} alt={current.title} className="h-full w-full object-cover" />}
                </div>
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>
            </div>

            <div className="mt-1 grid grid-cols-3 items-center">
              <div className="flex justify-start">
                <button
                  onClick={() => adjustVolume(-10)}
                  className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full border-2 border-black bg-gradient-to-b from-[#e6e6e6] to-[#a8a8a8] text-base md:text-lg lg:text-xl font-bold active:scale-95 cursor-pointer hover:shadow-xl"
                >
                  −
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={togglePlay}
                  aria-pressed={isPlaying}
                  className={`relative h-7 w-14 md:h-7 md:w-15 lg:h-8 lg:w-16 rounded-full border-2 border-black transition cursor-pointer ${
                    isPlaying ? "bg-red-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1/2 h-5 w-5 md:h-6 md:w-6 -translate-y-1/2 rounded-full border border-black bg-white transition-all ${
                      isPlaying ? "left-7 md:left-8" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => adjustVolume(10)}
                  className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full border-2 border-black bg-gradient-to-b from-[#e6e6e6] to-[#a8a8a8] text-base md:text-lg lg:text-xl font-bold active:scale-95 cursor-pointer hover:shadow-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-2 border-t-0 border-black rounded-b-2xl overflow-hidden">
            <div className="bg-[#7C2121] pb-1 text-white rounded-bl-2xl">
              <div className="bg-black px-3 py-1">
                <p className={`text-xl md:text-2xl lg:text-3xl text-center ${oswaldMedium.className}`}>{importance.label}</p>
              </div>
              <div className="px-4 pt-2 md:pt-3">
                <div className="flex justify-center">
                  <p className={`text-4xl md:text-5xl lg:text-6xl leading-none ${oswaldBold.className}`}>{importance.value}%</p>
                </div>
                {(importance.quote || importance.note) && (
                  <div className="mt-1 sm:mt-1 md:mt-1 lg:mt-2 pt-1 md:pt-2 lg:pt-3">
                    <p className={`text-left text-[11px] md:text-[12px] leading-relaxed ${poppinsRegular.className}`}>
                      {importance.quote} {importance.note}
                      <button className={`inline-block rounded-lg bg-[#6D84D7] px-3 py-1 ml-1 text-[13px] md:text-[14px] leading-none align-middle shadow-2xl transition-all duration-200 ease-out hover:-translate-y-0.5 cursor-pointer hover:shadow-4xl border-2 border-transparent hover:border-white ${poppinsRegular.className}`} onClick={() => setActiveDetail("importance")}>
                        {importance.date}
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#6D84D7] pb-1 text-white rounded-br-2xl">
              <div className="bg-white px-3 py-1">
                <p className={`text-xl md:text-2xl lg:text-3xl text-center text-black ${oswaldMedium.className}`}>{researchGap.label}</p>
              </div>
              <div className="px-4 pt-2 md:pt-3">
                <div className="flex justify-center">
                  <p className={`text-4xl md:text-5xl lg:text-6xl leading-none ${oswaldBold.className}`}>{researchGap.value}%</p>
                </div>
                {(researchGap.quote || researchGap.note) && (
                  <div className="mt-1 sm:mt-1 md:mt-1 lg:mt-2 pt-1 md:pt-2 lg:pt-3">
                    <p className={`text-left text-[11px] md:text-[12px] leading-relaxed ${poppinsRegular.className}`}>
                      {researchGap.quote} {researchGap.note}
                      <button className={`inline-block rounded-lg bg-[#7C2121] px-3 py-1 text-[13px] md:text-[14px] leading-none align-middle shadow-2xl transition-all duration-200 ease-out hover:-translate-y-0.5 cursor-pointer hover:shadow-4xl border-2 border-transparent hover:border-white ${poppinsRegular.className}`} onClick={() => setActiveDetail("researchGap")}>
                        {researchGap.date}
                      </button>
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
          from { transform: rotate(-30deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes vinylEq {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
      `}</style>

      {activeDetail != null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setActiveDetail(null)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setActiveDetail(null)}
              className="group absolute right-4 top-4 h-8 w-8 cursor-pointer"
            >
              <img
                src="/popupButtonOff.svg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full select-none transition-opacity duration-200 ease-out group-hover:opacity-0"
              />
              <img
                src="/popupButtonOn.svg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full select-none opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
              />
            </button>

            {(() => {
              const detail = activeDetail === "importance" || "researchGap" ? importance : researchGap;
              return (
                <>
                  <h3 className={`${poppinsMedium.className} pr-8 text-xl leading-snug text-black font-bold text-center`}>
                    {detail.citationTitle}
                  </h3>

                  <p className={`${poppinsRegular.className} mt-3 text-lg text-black/80 text-center`}>
                    {detail.authors}
                  </p>

                  <p className={`${poppinsRegular.className} mt-1 text-base text-black/60 text-center`}>
                    {detail.publication}
                  </p>

                  {detail.doi && (
                    <a
                      href={detail.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${poppinsRegular.className} mt-1 block text-base text-blue-600 underline break-all text-center`}
                    >
                      {detail.doi}
                    </a>
                  )}

                  {detail.explanation && (
                    <div className="relative mt-6 overflow-visible rounded-xl bg-[#F5F5F5] p-4 pt-6 border-2 border-black">
                      <img
                        src="/quotationMark.svg"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-3 -top-3 h-8 w-8 select-none"
                      />
                      <img
                        src="/quotationMark.svg"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 -top-3 h-8 w-8 select-none"
                      />
                      <p className={`${poppinsRegular.className} text-sm leading-relaxed text-black/80 text-center`}>
                        {detail.explanation}
                      </p>
                      <img
                        src="/quotationMark.svg"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-3 -right-3 h-8 w-8 rotate-180 select-none"
                      />
                      <img
                        src="/quotationMark.svg"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-3 right-3 h-8 w-8 rotate-180 select-none"
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}