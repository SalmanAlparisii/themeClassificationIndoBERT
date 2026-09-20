"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  animate as fmAnimate,
  type MotionValue,
} from "framer-motion";
import {
  CABLE_END_X,
  CABLE_START_X,
  CABLE_STROKE_UNITS,
  CABLE_VIEWBOX,
  useCableLayout,
  type CableBreakpoint,
} from "@/lib/cableGeometry";

interface BackgroundCableProps {
  draw?: number;
  extend?: number;
  endY?: number;
  startX?: { red: number; blue: number };
}

const VB_W = CABLE_VIEWBOX.width;
const VB_H = CABLE_VIEWBOX.height;

interface CablePaths {
  red: string;
  blue: string;
  redMainOnly: string;
  blueMainOnly: string;
  redStart: { x: number; y: number };
  blueStart: { x: number; y: number };
}

function buildPaths(
  bp: CableBreakpoint,
  endY: number,
  startX?: { red: number; blue: number }
): CablePaths {
  const { red: rx, blue: bx } = CABLE_END_X[bp];
  const fallbackStart = CABLE_START_X[bp];
  const sr = startX?.red ?? fallbackStart.red;
  const sb = startX?.blue ?? fallbackStart.blue;
  const tail = Math.max(VB_H + 20, endY);
  const top = -160;

  if (bp === "lg") {
    const redMainOnly = `M ${sr} ${top} L ${sr} 140 C ${sr} 164 ${sr - 20} 180 ${
      sr - 46
    } 180 L ${rx + 30} 180 C ${rx + 4} 180 ${rx} 196 ${rx} 220 L ${rx} ${VB_H}`;
    const blueMainOnly = `M ${sb} ${top} L ${sb} 280 C ${sb} 304 ${sb - 20} 320 ${
      sb - 46
    } 320 L ${bx + 50} 320 C ${bx + 24} 320 ${bx} 336 ${bx} 360 L ${bx} ${VB_H}`;

    return {
      red: `${redMainOnly} L ${rx} ${tail}`,
      blue: `${blueMainOnly} L ${bx} ${tail}`,
      redMainOnly,
      blueMainOnly,
      redStart: { x: sr, y: top },
      blueStart: { x: sb, y: top },
    };
  }

  const redMainOnly = jogPath(sr, rx, 300, top);
  const blueMainOnly = jogPath(sb, bx, 400, top);

  return {
    red: `${redMainOnly} L ${rx} ${tail}`,
    blue: `${blueMainOnly} L ${bx} ${tail}`,
    redMainOnly,
    blueMainOnly,
    redStart: { x: sr, y: top },
    blueStart: { x: sb, y: top },
  };
}

function jogPath(sx: number, ex: number, yTurn: number, top: number) {
  if (Math.abs(ex - sx) < 12) {
    return `M ${sx} ${top} L ${sx} ${VB_H}`;
  }
  const dir = ex > sx ? 1 : -1;
  const r = 50;
  return (
    `M ${sx} ${top} L ${sx} ${yTurn - 40} ` +
    `C ${sx} ${yTurn} ${sx + dir * 18} ${yTurn} ${sx + dir * r} ${yTurn} ` +
    `L ${ex - dir * r} ${yTurn} ` +
    `C ${ex} ${yTurn} ${ex} ${yTurn + 18} ${ex} ${yTurn + 55} ` +
    `L ${ex} ${VB_H}`
  );
}

function Pipe({
  d,
  progress,
  color,
  pathRef,
  scale,
}: {
  d: string;
  progress: MotionValue<number>;
  color: string;
  pathRef?: React.Ref<SVGPathElement>;
  scale: number;
}) {
  const opacity = useTransform(progress, (p) => (p > 0.001 ? 1 : 0));
  const common = {
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { pathLength: progress, opacity },
  };
  return (
    <>
      <motion.path
        ref={pathRef}
        d={d}
        stroke="#000000"
        strokeWidth={36 * scale}
        {...common}
      />
      <motion.path d={d} stroke="#ffffff" strokeWidth={26 * scale} {...common} />
      <motion.path
        d={d}
        stroke="#000000"
        strokeWidth={18 * scale}
        transform={`translate(${-5 * scale},${-5 * scale})`}
        {...common}
      />
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={10 * scale}
        transform={`translate(${3 * scale},${3 * scale})`}
        {...common}
      />
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

function JackPlug({
  x,
  y,
  isHorizontal,
  visible,
  size,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  isHorizontal: MotionValue<number>;
  visible: boolean;
  size: number;
}) {
  const left = useTransform(x, (v) => `${(v / VB_W) * 100}%`);
  const top = useTransform(y, (v) => `${(v / VB_H) * 100}%`);

  const horizontalOpacity = useTransform(isHorizontal, (v) =>
    v < 0.15 ? 0 : (v - 0.15) / 0.85
  );
  const verticalOpacity = useTransform(isHorizontal, (v) =>
    v > 0.85 ? 0 : (0.85 - v) / 0.85
  );

  const body = Math.round(size * 1.3);
  const stroke = Math.max(2, Math.round(size * 0.1));
  const radius = Math.max(3, Math.round(size * 0.24));

  return (
    <motion.div
      className="absolute"
      style={{ left, top }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="absolute block border-black bg-white"
        style={{
          opacity: verticalOpacity,
          width: size,
          height: body,
          left: -size / 2,
          top: -body - size * 0.1,
          borderWidth: stroke,
          borderRadius: radius,
        }}
      />
      <motion.span
        className="absolute block border-black bg-white"
        style={{
          opacity: horizontalOpacity,
          width: body,
          height: size * 0.92,
          left: -size * 0.1,
          top: -size * 0.46,
          borderWidth: stroke,
          borderRadius: radius,
        }}
      />
      <span
        className="absolute flex items-center justify-center rounded-full border-black bg-[#0d0d0d]"
        style={{
          width: size,
          height: size,
          left: -size / 2,
          top: -size / 2,
          borderWidth: stroke,
        }}
      >
        <span
          className="block rounded-full bg-[#3a3a3a]"
          style={{ width: size * 0.34, height: size * 0.34 }}
        />
      </span>
    </motion.div>
  );
}

function useMainFraction(
  fullPathRef: React.RefObject<SVGPathElement | null>,
  mainPathRef: React.RefObject<SVGPathElement | null>,
  d: string,
  dMain: string,
  k: number
) {
  const [fraction, setFraction] = useState(1);
  useEffect(() => {
    const full = fullPathRef.current;
    const main = mainPathRef.current;
    if (!full || !main) return;
    const totalLen = full.getTotalLength();
    const mainLen = main.getTotalLength();
    if (totalLen > 0) setFraction(Math.min(1, mainLen / totalLen));
  }, [fullPathRef, mainPathRef, d, dMain, k]);
  return fraction;
}

function useTip(
  pathRef: React.RefObject<SVGPathElement | null>,
  progress: MotionValue<number>,
  fallback: { x: number; y: number },
  k: number,
  d: string
) {
  const x = useMotionValue(fallback.x);
  const y = useMotionValue(fallback.y);
  const isHorizontal = useMotionValue(0);

  const recompute = () => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    if (!len) return;

    const clamped = Math.max(0, Math.min(1, progress.get()));
    const curLen = len * clamped;
    const pt = el.getPointAtLength(curLen);
    x.set(pt.x);
    y.set(pt.y);

    const eps = Math.min(2, curLen);
    const prevPt = el.getPointAtLength(Math.max(0, curLen - eps));
    const dx = pt.x - prevPt.x;
    const dyScreen = (pt.y - prevPt.y) * k;
    const denom = Math.abs(dx) + Math.abs(dyScreen);
    if (denom > 0) {
      isHorizontal.set(Math.abs(dx) / denom);
    }
  };

  useMotionValueEvent(progress, "change", recompute);
  useEffect(() => {
    recompute();
    const raf = requestAnimationFrame(recompute);
    return () => cancelAnimationFrame(raf);
  }, [k, fallback.x, fallback.y, d]);

  return { x, y, isHorizontal };
}

export default function BackgroundCable({
  draw = 0,
  extend = 0,
  endY,
  startX,
}: BackgroundCableProps) {
  const layout = useCableLayout();
  const bp = layout.bp;
  const { ref, k } = useAspectCorrection();

  const resolvedEndY = endY ?? VB_H + 120;
  const startRed = startX?.red;
  const startBlue = startX?.blue;
  const paths = useMemo(
    () =>
      buildPaths(
        bp,
        resolvedEndY,
        startRed != null && startBlue != null
          ? { red: startRed, blue: startBlue }
          : undefined
      ),
    [bp, resolvedEndY, startRed, startBlue]
  );
  const { red, blue, redMainOnly, blueMainOnly, redStart, blueStart } = paths;

  const strokeScale = layout.strokeUnits / CABLE_STROKE_UNITS;
  const plugSize = layout.widthPx;

  const redPathRef = useRef<SVGPathElement>(null);
  const bluePathRef = useRef<SVGPathElement>(null);
  const redMainMeasureRef = useRef<SVGPathElement>(null);
  const blueMainMeasureRef = useRef<SVGPathElement>(null);

  const redFraction = useMainFraction(
    redPathRef,
    redMainMeasureRef,
    red,
    redMainOnly,
    k
  );
  const blueFraction = useMainFraction(
    bluePathRef,
    blueMainMeasureRef,
    blue,
    blueMainOnly,
    k
  );

  const redProgress = useMotionValue(0);
  const blueProgress = useMotionValue(0);

  useEffect(() => {
    const target = Math.min(1, draw * redFraction + extend * (1 - redFraction));
    const c = fmAnimate(redProgress, target, { duration: 0.25, ease: "linear" });
    return () => c.stop();
  }, [draw, extend, redFraction, redProgress]);

  useEffect(() => {
    const target = Math.min(1, draw * blueFraction + extend * (1 - blueFraction));
    const c = fmAnimate(blueProgress, target, { duration: 0.25, ease: "linear" });
    return () => c.stop();
  }, [draw, extend, blueFraction, blueProgress]);

  const redTip = useTip(redPathRef, redProgress, redStart, k, red);
  const blueTip = useTip(bluePathRef, blueProgress, blueStart, k, blue);

  const started = draw > 0.02;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[5] overflow-visible"
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={redMainOnly}
          ref={redMainMeasureRef}
          visibility="hidden"
          fill="none"
          stroke="none"
        />
        <path
          d={blueMainOnly}
          ref={blueMainMeasureRef}
          visibility="hidden"
          fill="none"
          stroke="none"
        />
        <Pipe
          d={red}
          progress={redProgress}
          color="#000000"
          pathRef={redPathRef}
          scale={strokeScale}
        />
        <Pipe
          d={blue}
          progress={blueProgress}
          color="#000000"
          pathRef={bluePathRef}
          scale={strokeScale}
        />
      </svg>

      <div className="absolute inset-0 overflow-visible">
        <JackPlug
          x={redTip.x}
          y={redTip.y}
          isHorizontal={redTip.isHorizontal}
          visible={started}
          size={plugSize}
        />
        <JackPlug
          x={blueTip.x}
          y={blueTip.y}
          isHorizontal={blueTip.isHorizontal}
          visible={started}
          size={plugSize}
        />
      </div>
    </div>
  );
}
