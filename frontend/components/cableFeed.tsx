"use client";

import { useEffect, useRef, useState } from "react";
import { CABLE_END_X, cableXToViewportX, useCableLayout } from "@/lib/cableGeometry";

interface Stub {
  left: number;
  /** titik X akhir kabel, tepat sebelum masuk background section. Di "lg"
   * sama dengan `left` (lurus vertikal, tidak diubah). Di sm/md dipaksa ke
   * CABLE_END_X (dikonversi ke px) — X yang SAMA PERSIS dipakai BackgroundCable
   * sebagai titik mulainya, supaya sambungan kabel lurus & konsisten. */
  targetX: number;
  top: number;
  height: number;
  /** jarak dari atas stub ke tepi bawah panel vinyl */
  overlap: number;
}

/**
 * Potongan kabel yang menyambungkan lubang keluar di bawah panel vinyl
 * ke bagian atas background section, supaya alur kabel terlihat utuh dan
 * tidak "tiba-tiba muncul" di tengah halaman.
 *
 * Digambar dengan satuan px murni (bukan viewBox yang di-stretch), jadi
 * ketebalannya persis sama dengan kabel di background section.
 *
 * Di "lg" kabel tetap lurus vertikal (tidak diubah). Di "sm"/"md" kabel
 * turun sebentar lalu melengkung (rounded corner) menuju tepi layar, lalu
 * lurus turun — berhenti di X yang sama persis dengan titik mulai
 * BackgroundCable, supaya sambungannya konsisten & tidak berbelok lagi
 * di dalam background section.
 */

function buildStubPath(
  sx: number,
  ex: number,
  yTurn: number,
  endY: number,
  radius: number
) {
  if (Math.abs(ex - sx) < 1) {
    return `M ${sx} 0 L ${sx} ${endY}`;
  }
  const dir = ex > sx ? 1 : -1;
  const r = Math.max(
    6,
    Math.min(radius, Math.abs(ex - sx) / 2, yTurn - 2, endY - yTurn - 2)
  );
  return (
    `M ${sx} 0 L ${sx} ${yTurn - r} ` +
    `C ${sx} ${yTurn} ${sx + dir * r * 0.4} ${yTurn} ${sx + dir * r} ${yTurn} ` +
    `L ${ex - dir * r} ${yTurn} ` +
    `C ${ex} ${yTurn} ${ex} ${yTurn} ${ex} ${yTurn + r} ` +
    `L ${ex} ${endY}`
  );
}

export default function CableFeed() {
  const layout = useCableLayout();
  const ref = useRef<HTMLDivElement>(null);
  const [stubs, setStubs] = useState<Stub[]>([]);

  useEffect(() => {
    const observedEls = new Set<Element>();
    const observeOnce = (el: Element | null) => {
      if (el && !observedEls.has(el)) {
        observedEls.add(el);
        ro.observe(el);
      }
    };

    const measure = () => {
      const el = ref.current;
      if (!el) return;

      const outlets = (["red", "blue"] as const).map((key) =>
        document.querySelector<HTMLElement>(`[data-cable-outlet="${key}"]`)
      );
      const section = document.getElementById("background-section");
      if (!section || outlets.some((o) => !o)) return;

      const base = el.getBoundingClientRect();
      const sectionTop = section.getBoundingClientRect().top - base.top;
      const jogged = layout.bp !== "lg";

      const next = (["red", "blue"] as const).map((key, i) => {
        const o = outlets[i]!;
        const r = o.getBoundingClientRect();
        // mulai sedikit di dalam panel supaya ujungnya tertutup panel
        const overlap = Math.max(16, layout.widthPx);
        const top = r.top - base.top - overlap;
        const left = r.left + r.width / 2 - base.left;
        const targetX = jogged
          ? cableXToViewportX(CABLE_END_X[layout.bp][key], layout) - base.left
          : left;
        return {
          left,
          targetX,
          top,
          height: Math.max(0, sectionTop - top + 6),
          overlap,
        };
      });

      setStubs((prev) =>
        prev.length === next.length &&
        prev.every(
          (s, i) =>
            Math.abs(s.left - next[i].left) < 0.5 &&
            Math.abs(s.targetX - next[i].targetX) < 0.5 &&
            Math.abs(s.top - next[i].top) < 0.5 &&
            Math.abs(s.height - next[i].height) < 0.5
        )
          ? prev
          : next
      );

      outlets.forEach((o) => observeOnce(o));
      observeOnce(section);
    };

    const ro = new ResizeObserver(measure);

    measure();
    const raf = requestAnimationFrame(measure);
    const t1 = window.setTimeout(measure, 300);
    const t2 = window.setTimeout(measure, 1200);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    // Font web (Jockey One / Oswald) sering selesai dimuat setelah jadwal
    // di atas, mengubah tinggi konten di atas #background-section secara
    // halus. Tanpa ini, potongan kabel bisa "beku" salah sampai di-resize.
    let cancelled = false;
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) requestAnimationFrame(measure);
      });
    }

    observeOnce(document.body);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      ro.disconnect();
    };
  }, [layout]);

  const w = layout.widthPx;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[6] overflow-visible"
      aria-hidden="true"
    >
      {stubs.map((s, i) => {
        if (s.height <= 0) return null;

        const pad = w * 1.2;
        const svgLeft = Math.min(s.left, s.targetX) - pad;
        const svgWidth = Math.abs(s.targetX - s.left) + pad * 2;
        const sx = s.left - svgLeft;
        const ex = s.targetX - svgLeft;

        // belok tidak lama setelah keluar dari collar, sisa perjalanan yang
        // jauh lebih panjang ada lurus di pinggir layar
        const yTurn = Math.min(s.height * 0.4, Math.max(s.overlap + 56, 90));
        const radius = Math.min(28, w * 1.4);
        const d = buildStubPath(sx, ex, yTurn, s.height, radius);

        // collar / pangkal plug tempat kabel keluar dari panel — tetap di
        // posisi outlet asli (sx)
        const collarW = w * 0.86;
        const collarH = w * 1.55;
        const collarY = s.overlap - collarH * 0.35;

        return (
          <svg
            key={i}
            className="absolute overflow-visible"
            style={{
              left: svgLeft,
              top: s.top,
              width: svgWidth,
              height: s.height,
            }}
            width={svgWidth}
            height={s.height}
            viewBox={`0 0 ${svgWidth} ${s.height}`}
          >
            <path
              d={d}
              fill="none"
              stroke="#000000"
              strokeWidth={w}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={d}
              fill="none"
              stroke="#ffffff"
              strokeWidth={w * 0.722}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={d}
              fill="none"
              stroke="#000000"
              strokeWidth={w * 0.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(${-w * 0.14},${-w * 0.14})`}
            />
            <path
              d={d}
              fill="none"
              stroke="#000000"
              strokeWidth={w * 0.278}
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(${w * 0.083},${w * 0.083})`}
            />

            <rect
              x={sx - collarW / 2}
              y={collarY}
              width={collarW}
              height={collarH}
              rx={w * 0.22}
              fill="#D3D3D3"
              stroke="#000000"
              strokeWidth={Math.max(1.5, w * 0.1)}
            />
          </svg>
        );
      })}
    </div>
  );
}
