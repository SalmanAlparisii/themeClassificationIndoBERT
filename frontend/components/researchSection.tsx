"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  oswaldMedium,
  oswaldRegular,
  oswaldBold,
  jockeyOneRegular,
  poppinsRegular,
} from "@/app/layout";
import { SOCKET_HEIGHT_RATIO, useCableLayout } from "@/lib/cableGeometry";

type LabelColor = "green" | "gray" | "red";

interface ResearchSection {
  id: string;
  serial: string;
  label: string;
  color: LabelColor;
}

const sections: ResearchSection[] = [
  { id: "gap", serial: "01", label: "Research Gap", color: "green" },
  { id: "indobert", serial: "02", label: "Why IndoBERT", color: "gray" },
  { id: "theme", serial: "03", label: "Why Theme Classification", color: "red" },
];

const colorStyles: Record<LabelColor, { bg: string; text: string }> = {
  green: { bg: "bg-[#BFE3B0]", text: "text-black" },
  gray: { bg: "bg-[#D9D9D9]", text: "text-black" },
  red: { bg: "bg-[#E23B32]", text: "text-white" },
};


function ReelDot() {
  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-2.5 shrink-0 items-center justify-center rounded-full border-2 border-white/70 bg-black sm:h-6 sm:w-3 md:h-7 md:w-3.5 lg:h-8 lg:w-4"
    >
      <span className="h-1 w-1 rounded-full bg-white/70 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2" />
    </span>
  );
}

function SocketPort({ active, width }: { active: boolean; width: number }) {
  const w = Math.max(8, Math.round(width * 1.08));
  const h = Math.max(4, Math.round(width * SOCKET_HEIGHT_RATIO));

  return (
    <motion.span
      aria-hidden="true"
      className="relative block rounded-full bg-black"
      style={{ width: w, height: h }}
      initial={false}
      animate={
        active
          ? { scaleX: [1, 1.12, 1], scaleY: [1, 0.82, 1] }
          : { scaleX: 1, scaleY: 1 }
      }
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

function SocketRow({
  plugged,
  remeasureSignal,
}: {
  plugged: boolean;
  remeasureSignal?: number;
}) {
  const layout = useCableLayout();
  const rowRef = useRef<HTMLDivElement>(null);
  const [lefts, setLefts] = useState<number[]>([]);

  useEffect(() => {
    const update = () => {
      const el = rowRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next = layout.endpoints.map((e) => e.viewportX - rect.left);
      setLefts((prev) =>
        prev.length === next.length &&
        prev.every((v, i) => Math.abs(v - next[i]) < 0.5)
          ? prev
          : next
      );
    };

    update();
    const raf = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    let cancelled = false;
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) requestAnimationFrame(update);
      });
    }
    const ro = new ResizeObserver(update);
    ro.observe(rowRef.current ?? document.body);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
      ro.disconnect();
    };
  }, [layout, remeasureSignal]);

  return (
    <div
      ref={rowRef}
      data-cable-socket-row
      className="pointer-events-none absolute inset-x-0 z-20"
      style={{ top: -Math.round(layout.widthPx * SOCKET_HEIGHT_RATIO * 0.5) }}
      aria-hidden="true"
    >
      {lefts.map((left, i) => (
        <span
          key={i}
          className="absolute"
          style={{ left, transform: "translateX(-50%)" }}
        >
          <SocketPort active={plugged} width={layout.widthPx} />
        </span>
      ))}
    </div>
  );
}

interface MarqueeBannerProps {
  plugged?: boolean;
}

function MarqueeBanner({ plugged: pluggedProp }: MarqueeBannerProps) {
  const [autoPlugged, setAutoPlugged] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pluggedProp !== undefined) return;
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAutoPlugged(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pluggedProp]);

  const plugged = pluggedProp ?? autoPlugged;
  const [socketRemeasure, setSocketRemeasure] = useState(0);

  useEffect(() => {
    if (!plugged) return;
    // scale/opacity settle di 0.28s, tapi borderColor masih jalan sampai 1s.
    // onAnimationComplete nunggu SEMUA properti selesai (1s) baru remeasure,
    // jadi kelihatan lambat. Ukur ulang lebih awal begitu scale sudah settle.
    const t = window.setTimeout(() => setSocketRemeasure((n) => n + 1), 320);
    return () => window.clearTimeout(t);
  }, [plugged]);

  const item = (
    <span className="mx-2 flex shrink-0 items-center gap-2 rounded-md px-3 py-2 sm:gap-2.5 sm:px-4 sm:py-2.5 md:gap-3 md:px-5 md:py-3 lg:px-6 lg:py-3.5">
      <span className="h-2.5 w-2.5 shrink-0 border-2 border-white sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4" aria-hidden="true" />
      <span
        className={`${oswaldBold.className} text-2xl uppercase text-white sm:text-2xl md:text-3xl lg:text-4xl`}
      >
        Beyond Genre, Find The Theme
      </span>
      <ReelDot />
    </span>
  );

  return (
    <div ref={wrapperRef} className="-mx-4 md:-mx-8">
      <div className="relative -ml-[2%] w-[104%] -rotate-1 mt-4">
        <motion.div
          className="relative border-t-4 border-b-4 bg-[#111111]"
          initial={false}
          onAnimationComplete={() => setSocketRemeasure((n) => n + 1)}
          animate={
            plugged
              ? {
                  opacity: 1,
                  scale: 1,
                  borderColor: [
                    "rgba(255,255,255,0)",
                    "rgba(255,255,255,1)",
                    "rgba(255,255,255,0.12)",
                    "rgba(255,255,255,1)",
                    "rgba(255,255,255,0.12)",
                    "rgba(255,255,255,1)",
                  ],
                }
              : {
                  opacity: 0,
                  scale: 0.985,
                  borderColor: "rgba(255,255,255,0)",
                }
          }
          transition={{
            opacity: { duration: 0.28, ease: "easeOut" },
            scale: { duration: 0.28, ease: "easeOut" },
            borderColor: {
              duration: 1,
              times: [0, 0.28, 0.42, 0.56, 0.7, 1],
              ease: "easeInOut",
            },
          }}
        >
          <SocketRow plugged={plugged} remeasureSignal={socketRemeasure} />

          <style jsx global>{`
            @keyframes research-marquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
            .research-marquee-track {
              animation: research-marquee 22s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .research-marquee-track {
                animation: none;
              }
            }
          `}</style>
          <div className="overflow-x-hidden">
            <div className="research-marquee-track flex w-max">
              <div className="flex shrink-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={`a-${i}`}>{item}</span>
                ))}
              </div>
              <div className="flex shrink-0" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={`b-${i}`}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StudioBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="research-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M64 0H0V64" fill="none" stroke="#ffffff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#research-grid)" />
      </svg>

      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <span
        className={`${oswaldRegular.className} absolute left-6 top-24 hidden text-[10px] uppercase tracking-[0.3em] text-white/20 md:block`}
      >
        Ch. 01 · Lvl -6dB
      </span>
      <span
        className={`${oswaldRegular.className} absolute right-8 top-1/2 hidden text-[10px] uppercase tracking-[0.3em] text-white/20 md:block`}
      >
        Rec · ±0dB
      </span>
      <span
        className={`${oswaldRegular.className} absolute bottom-16 left-10 hidden text-[10px] uppercase tracking-[0.3em] text-white/15 lg:block`}
      >
        Analog Archive
      </span>
    </div>
  );
}

interface TapeLabelProps {
  label: string;
  serial: string;
  color: LabelColor;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function TapeLabel({ label, serial, color, isOpen, onToggle, children }: TapeLabelProps) {
  const styles = colorStyles[color];
  const panelId = `tape-panel-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="overflow-hidden border-2 border-black bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`flex h-[50px] w-full items-center justify-between px-4 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black ${styles.bg} ${styles.text}`}
      >
        <span className={`${oswaldBold.className} text-2xl  md:text-4xl`}>
          {label}
        </span>

        <span className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-black"
          >
            <img
              src={isOpen ? "/buttonOn.svg" : "/buttonOff.svg"}
              alt=""
              className="h-6 w-6"
            />
          </span>
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="relative min-h-[280px] border-t-2 border-black px-5 py-2 md:min-h-[340px] md:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResearchAccordion() {
  const [openId, setOpenId] = useState<string>("theme");

  function toggle(id: string) {
    setOpenId((current) => (current === id ? "" : id));
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section) => (
        <TapeLabel
          key={section.id}
          label={section.label}
          serial={section.serial}
          color={section.color}
          isOpen={openId === section.id}
          onToggle={() => toggle(section.id)}
        >
          {section.id === "gap" && (
            <p className={`${poppinsRegular.className} mx-auto text-center text-[14px] text-black/80 md:text-base mb-2 lg:text-base`}>
              Penelitian klasifikasi lirik lagu selama ini masih berfokus
              pada analisis sentimen atau genre, sementara pengelompokan
              berdasarkan tema eksplisit cinta, keadilan sosial, dan
              refleksi diri belum banyak dieksplorasi khusus untuk lirik
              berbahasa Indonesia. Kesenjangan inilah yang mendasari
              penelitian ini.
            </p>
          )}

          {section.id === "indobert" && (
            <p className={`${poppinsRegular.className} mx-auto text-center text-[14px] text-black/80 md:text-base mb-2 lg:text-base`}>
              IndoBERT dipilih karena mampu memahami konteks bahasa Indonesia
              secara dua arah, menangkap makna implisit yang tidak dapat
              ditangkap model tradisional seperti Naïve Bayes atau TWCNB,
              dengan performa klasifikasi yang secara konsisten lebih
              tinggi.
            </p>
          )}

          {section.id === "theme" && (
            <p className={`${poppinsRegular.className} mx-auto text-center text-[14px] text-black/80 md:text-base mb-2 lg:text-base`}>
              Salah satu pendekatan yang relevan adalah klasifikasi tema
              lirik lagu karena pengguna tidak hanya mencari musik
              berdasarkan genre, tetapi juga berdasarkan makna dan tema
              yang terkandung dalam lirik.
            </p>
          )}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              className="group pointer-events-auto flex w-[87.5%] items-center justify-between gap-3 rounded-lg border-2 border-black bg-black px-4 py-1 text-white transition-colors duration-300"
            >
              <img
                src="/gearIcon.svg"
                alt=""
                aria-hidden="true"
                className="h-8 w-8 md:h-12 md:w-12"
              />
              <span className={`${oswaldMedium.className} text-2xl md:text-3xl`}>
                {section.label}
              </span>
              <img
                src="/gearIcon.svg"
                alt=""
                aria-hidden="true"
                className="h-8 w-8 md:h-12 md:w-12"
              />
            </button>
          </div>
        </TapeLabel>
      ))}
    </div>
  );
}

function CassettePanel() {
  return (
    <div className="relative mx-auto w-full max-w-[1000px] px-10">
      <div className="relative border-2 border-black bg-[#E5E5E5] p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] md:p-7">
        <div className="rounded-2xl border-2 border-black bg-white p-3 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] md:p-5">
          <ResearchAccordion />
        </div>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="relative z-20 px-4 md:px-8">
        <MarqueeBanner />
      </div>
      <div className="relative -mt-2 min-h-screen overflow-hidden bg-[#111111] px-4 pb-8 pt-0 md:-mt-4 md:px-8 md:pb-12 md:pt-0">
        <StudioBackground />
        <h1
          className={`${jockeyOneRegular.className} mt-6 mb-2 text-center text-5xl font-black text-white sm:mt-8 sm:mb-2 md:mt-10 md:mb-2 md:text-6xl lg:mt-12 lg:mb-4 lg:text-[72px]`}
        >
          Research
        </h1>
        <CassettePanel />
      </div>
    </div>
  );
}