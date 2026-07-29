"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  jockeyOneRegular,
  oswaldMedium,
  poppinsRegular,
} from "@/app/layout";

type BackgroundItem = {
  id: string;
  step: string;
  title: string;
  text: string;
};

const backgroundItems: BackgroundItem[] = [
  {
    id: "01",
    step: "Masalah",
    title: "Ledakan Musik Digital",
    text: "Perkembangan musik digital meningkatkan jumlah lagu secara pesat, sehingga pengguna kesulitan menemukan lagu yang sesuai preferensi karena pilihan yang terlalu banyak dan tersebar. Klasifikasi lirik lagu menjadi solusi untuk mengelompokkan lagu berdasarkan karakteristiknya agar pencarian lebih efektif.",
  },
  {
    id: "02",
    step: "Tantangan",
    title: "Klasifikasi Tema & Tantangannya",
    text: "Berbeda dari klasifikasi sentimen (positif/negatif), klasifikasi tema berfokus pada makna utama lirik. Tantangannya, tema sering bersifat implisit, tersebar, dan tumpang tindih antar kalimat, sehingga dibutuhkan pendekatan semantik untuk memahami makna kontekstual dan non-literal dalam lirik.",
  },
  {
    id: "03",
    step: "Fokus",
    title: "Tema sebagai Fokus Penelitian",
    text: "Berdasarkan Du (2024), tiga tema paling dominan dalam lirik lagu adalah cinta, keadilan sosial, dan refleksi diri. Tema ini juga relevan bagi pengguna, terbukti dari data yang menunjukkan pengguna sering mencari musik berdasarkan mood/tema, bukan hanya melodi.",
  },
  {
    id: "04",
    step: "Keterbatasan",
    title: "Keterbatasan Metode Sebelumnya",
    text: "Penelitian sebelumnya menggunakan pendekatan kualitatif manual yang lambat dan tidak konsisten, atau machine learning tradisional seperti Naïve Bayes dan TWCNB yang masih terbatas karena mengasumsikan setiap fitur independen sehingga tidak menangkap hubungan antar kata.",
  },
  {
    id: "05",
    step: "Solusi",
    title: "Deep Learning & IndoBERT",
    text: "Model transformer seperti BERT/IndoBERT mampu memahami konteks bahasa secara dua arah dengan performa lebih tinggi dari metode tradisional (F1-score 84.13 vs Naïve Bayes 70.95 dan LSTM 71.62). Penelitian ini mengembangkan model klasifikasi tema lirik Indonesia menggunakan IndoBERT.",
  },
];

type Point = { x: number; y: number };

const CITATION_PATTERN =
  /([A-Z][\wÀ-ÿ.]*(?:\s(?:et al\.|&|dan)\s[A-Z][\wÀ-ÿ.]*)?,?\s?\(?\d{4}\)?)/g;

function renderWithCitationHighlight(text: string) {
  const parts = text.split(CITATION_PATTERN);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="relative inline-block px-0.5">
        <span className="absolute inset-x-0 inset-y-[12%] bg-red-500/25 rounded-sm -z-10" />
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function BackgroundSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const connectorRefs = useRef<Array<HTMLDivElement | null>>([]);
  const patchJackRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [connectorPoints, setConnectorPoints] = useState<Point[]>([]);
  const [patchPoint, setPatchPoint] = useState<Point>({ x: 0, y: 0 });
  const [centerX, setCenterX] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    const sections = cardRefs.current.filter(
      (el): el is HTMLDivElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeIndex == null) return;
    if (!voiceEnabled) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio("/audio/plugin.opus");
    audioRef.current = audio;

    const timeout = setTimeout(() => {
      audio.play().catch((err) => {
        console.error("Gagal memutar audio:", err);
      });
    }, 480);

    return () => {
      clearTimeout(timeout);
      audio.pause();
      audio.currentTime = 0;
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, [activeIndex, voiceEnabled]);

  const measure = useCallback(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const points = connectorRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - containerRect.left + r.width / 2,
        y: r.top - containerRect.top + r.height / 2,
      };
    });
    setConnectorPoints(points);
    setCenterX(containerRect.width / 2);

    const patchEl = patchJackRefs.current[activeIndex];
    const patchRect = patchEl?.getBoundingClientRect();
    if (patchRect) {
      setPatchPoint({
        x: patchRect.left - containerRect.left + patchRect.width / 2,
        y: patchRect.top - containerRect.top + patchRect.height / 2,
      });
    }
  }, [activeIndex]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const activePoint = connectorPoints[activeIndex];

  const cablePath = (() => {
    if (!activePoint || (activePoint.x === 0 && activePoint.y === 0)) return "";
    const startX = patchPoint.x || centerX;
    const startY = patchPoint.y || 0;
    const bendY = activePoint.y - 40;
    const midX = (centerX + activePoint.x) / 2;

    return `M ${startX} ${startY} C ${startX} ${startY + 60}, ${centerX} ${
      bendY - 60
    }, ${centerX} ${bendY} C ${centerX} ${bendY + 20}, ${midX} ${
      activePoint.y
    }, ${activePoint.x} ${activePoint.y}`;
  })();

  return (
    <section
      id="background"
      ref={sectionRef}
      className="relative z-10 mx-4 md:mx-8 mt-10 md:mt-16 mb-10 md:mb-16"
    >
      <h2
        className={`${jockeyOneRegular.className} text-6xl sm:text-8xl md:text-9xl lg:text-10xl text-black text-center mb-10 md:mb-14`}
      >
        Background
      </h2>

      <div className="relative p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl"
        >
          <svg className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
            <defs>
              <pattern id="studio-grid" width="90" height="90" patternUnits="userSpaceOnUse">
                <path
                  d="M 90 0 L 0 0 0 90"
                  fill="none"
                  stroke="#201F1F"
                  strokeWidth="1"
                />
                <path d="M 4 0 L -4 0" stroke="#D4D4D4" strokeWidth="1" />
                <path d="M 0 4 L 0 -4" stroke="#D4D4D4" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#studio-grid)" opacity={0.5} />
          </svg>

          <div className="absolute left-1 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-start gap-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className={`h-px bg-gray-300 ${i % 4 === 0 ? "w-3" : "w-1.5"}`}
              />
            ))}
            <span className="h-0.5 w-3 bg-red-500/70 mt-1" />
          </div>

          <svg
            className="absolute top-4 right-16 md:right-24 hidden sm:block opacity-40"
            width="70"
            height="16"
            viewBox="0 0 70 16"
          >
            <polyline
              points="0,8 6,3 12,13 18,5 24,11 30,2 36,14 42,6 48,10 54,4 60,12 66,7 70,8"
              fill="none"
              stroke="#BDBDBD"
              strokeWidth="1"
            />
          </svg>

          <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-gray-200" />
          <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-gray-200" />
        </div>

        <div className="flex flex-col items-center mb-10 md:mb-14">
          <div className="flex items-center gap-3 border-2 border-white rounded-xl bg-black px-4 py-3">
            {backgroundItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Fokus ke ${item.title}`}
                onClick={() =>
                  cardRefs.current[i]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }
                ref={(el) => {
                  patchJackRefs.current[i] = el;
                }}
                className={`w-3 h-3 rounded-full border-2 transition-colors duration-500 cursor-pointer ${
                  i === activeIndex
                    ? "border-red-500 bg-red-500"
                    : "border-white bg-black hover:border-red-400"
                }`}
              />
            ))}

            <div className="w-px h-4 bg-white/20 mx-1" />

            <button
              type="button"
              onClick={() => setVoiceEnabled((prev) => !prev)}
              aria-pressed={voiceEnabled}
              className={`flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 transition-colors duration-300 cursor-pointer ${
                voiceEnabled
                  ? "border-red-500 bg-red-500/10"
                  : "border-white/40 bg-black hover:border-white"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  voiceEnabled ? "bg-red-500 animate-pulse" : "bg-white/30"
                }`}
              />
              <span
                className={`${oswaldMedium.className} text-[10px] uppercase tracking-wide transition-colors duration-300 ${
                  voiceEnabled ? "text-red-500" : "text-white/50"
                }`}
              >
                {voiceEnabled ? "Voice On" : "Voice Off"}
              </span>
            </button>
          </div>
          <span
            className={`${oswaldMedium.className} text-[10px] uppercase tracking-wide text-black/50 mt-2`}
          >
            Patch panel
          </span>
        </div>

        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none z-20"
            style={{ overflow: "visible" }}
          >
            <AnimatePresence mode="wait">
              {cablePath && (
                <motion.g
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <path
                    d={cablePath}
                    fill="none"
                    stroke="#0a0a0a"
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                  <path
                    d={cablePath}
                    fill="none"
                    stroke="#6b6b6b"
                    strokeWidth={2}
                    strokeLinecap="round"
                    opacity={0.5}
                  />
                  {activePoint && (
                    <g
                      transform={`translate(${activePoint.x - 15}, ${
                        activePoint.y - 11
                      })`}
                    >
                      <rect
                        width="30"
                        height="22"
                        rx="6"
                        fill="#141414"
                        stroke="#000"
                        strokeWidth="1"
                      />
                      <circle
                        cx="15"
                        cy="11"
                        r="8.5"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                      />
                      <circle cx="10" cy="7.5" r="1.4" fill="#777" />
                      <circle cx="20" cy="7.5" r="1.4" fill="#777" />
                      <circle cx="15" cy="15" r="1.4" fill="#777" />
                    </g>
                  )}
                </motion.g>
              )}
            </AnimatePresence>
          </svg>

          <div className="flex flex-col gap-8 md:gap-12 relative z-10">
            {backgroundItems.map((item, idx) => {
              const isActive = idx === activeIndex;
              const isRight = idx % 2 === 1;
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  data-index={idx}
                  className={`flex ${
                    isRight
                      ? "justify-center md:justify-end"
                      : "justify-center md:justify-start"
                  }`}
                >
                  <div
                    className={`relative w-full md:w-[46%] rounded-2xl border-2 bg-black px-4 py-4 md:px-6 md:py-5 transition-colors duration-500 ${
                      isActive ? "border-red-500" : "border-white"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 md:gap-4 ${
                        isRight ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${oswaldMedium.className} text-xs md:text-sm transition-colors duration-500 ${
                              isActive ? "text-red-500" : "text-white"
                            }`}
                          >
                            {item.id}
                          </span>
                          <span
                            className={`${oswaldMedium.className} text-[12px] md:text-sm uppercase tracking-wide transition-colors duration-500 ${
                              isActive ? "text-red-500" : "text-white/50"
                            }`}
                          >
                            {item.step}
                          </span>
                        </div>
                        <h3
                          className={`${oswaldMedium.className} text-base md:text-xl transition-colors duration-500 ${
                            isActive ? "text-red-500" : "text-white"
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>

                      <div
                        ref={(el) => {
                          connectorRefs.current[idx] = el;
                        }}
                        className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full border-2 bg-black shrink-0 flex items-center justify-center transition-colors duration-500 ${
                          isActive ? "border-red-500" : "border-white"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                            isActive ? "bg-red-500" : "bg-white"
                          }`}
                        />
                        {isActive && (
                          <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-40" />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="absolute left-0 right-0 top-full mt-2 z-30 rounded-2xl border-2 border-red-500 bg-black px-4 py-4 md:px-6 md:py-5 shadow-[0_0_24px_rgba(239,68,68,0.15)]"
                        >
                          <p
                            className={`${poppinsRegular.className} text-sm md:text-base leading-relaxed text-white/80 text-center`}
                          >
                            {renderWithCitationHighlight(item.text)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}