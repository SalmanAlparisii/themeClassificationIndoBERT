"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface BackgroundCableProps {
  draw?: number;
}

function useCableBreakpoint() {
  const [bp, setBp] = useState<"sm" | "md" | "lg">("lg");
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp(w < 768 ? "sm" : w < 1024 ? "md" : "lg");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

const CABLE_PATHS = {
  lg: {
    red: "M 1180 -105 L 1180 140 C 1180 164 1160 180 1134 180 L 90 180 C 64 180 60 196 60 220 L 60 997",
    blue: "M 1420 -105 L 1420 280 C 1420 304 1400 320 1374 320 L 620 320 C 594 320 570 336 570 360 L 570 985",
    redStart: { x: 1180, y: -110 }, redEnd: { x: 60, y: 997 },
    blueStart: { x: 1420, y: -110 }, blueEnd: { x: 570, y: 985 },
  },
  md: {
    red: "M 120 0 L 120 1000",
    blue: "M 1480 0 L 1480 1000",
    redStart: { x: 120, y: -200 }, redEnd: { x: 120, y: 1000 },
    blueStart: { x: 1480, y: -200 }, blueEnd: { x: 1480, y: 1000 },
  },
  sm: {
    red: "M 70 0 L 70 1000",
    blue: "M 1530 0 L 1530 1000",
    redStart: { x: 70, y: -200 }, redEnd: { x: 70, y: 1000 },
    blueStart: { x: 1530, y: -200 }, blueEnd: { x: 1530, y: 1000 },
  },
};

function Pipe({ d, draw, color }: { d: string; draw: number; color: string }) {
  const p = Math.max(0, Math.min(1, draw));
  const common = {
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    initial: false,
    animate: { pathLength: p, opacity: p > 0.001 ? 1 : 0 },
    transition: { duration: 0.12, ease: "linear" as const },
  };
  return (
    <>
      <motion.path d={d} stroke="#000000" strokeWidth={36} {...common} />
      <motion.path d={d} stroke="#ffffff" strokeWidth={26} {...common} />
      <motion.path d={d} stroke="#000000" strokeWidth={18} transform="translate(-5,-5)" {...common} />
      <motion.path d={d} stroke={color} strokeWidth={10} transform="translate(3,3)" {...common} />
    </>
  );
}

function useAspectCorrection() {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setK((height / width) * 1.6);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, k };
}

function JackPlug({ x, y, edge, visible, k = 1 }: { x: number; y: number; edge: "top" | "bottom"; visible: boolean; k?: number }) {
  const isTop = edge === "top";
  const bodyY = isTop ? 6 : -52;
  return (
    <motion.g initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} transform={`translate(${x},${y})`}>
      <g transform={`scale(${k},1)`}>
        <rect x={-17} y={bodyY} width={34} height={46} rx={8} fill="#ffffff" stroke="#000000" strokeWidth={3} />
        <circle cx={0} cy={0} r={17} fill="#0d0d0d" stroke="#000000" strokeWidth={3} />
        <circle cx={0} cy={0} r={6} fill="#3a3a3a" />
      </g>
    </motion.g>
  );
}

export default function BackgroundCable({ draw = 0 }: BackgroundCableProps) {
  const bp = useCableBreakpoint();
  const { ref, k } = useAspectCorrection();
  const { red, blue, redStart, redEnd, blueStart, blueEnd } = CABLE_PATHS[bp];

  const started = draw > 0.02;
  const finished = draw > 0.985;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-[5] overflow-visible" aria-hidden="true">
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="none" style={{ overflow: "visible" }} className="absolute inset-0 h-full w-full shadow-2xl">
        <Pipe d={red} draw={draw} color="#000000" />
        <Pipe d={blue} draw={draw} color="#000000" />
        <JackPlug x={redStart.x} y={redStart.y} edge="top" visible={started} k={k} />
        <JackPlug x={blueStart.x} y={blueStart.y} edge="top" visible={started} k={k} />
        <JackPlug x={redEnd.x} y={redEnd.y} edge="bottom" visible={finished} k={k} />
        <JackPlug x={blueEnd.x} y={blueEnd.y} edge="bottom" visible={finished} k={k} />
      </svg>
    </div>
  );
}
