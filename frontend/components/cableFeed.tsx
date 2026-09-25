"use client";

import { useEffect, useRef, useState } from "react";
import { useCableLayout } from "@/lib/cableGeometry";

interface Stub {
  left: number;
  top: number;
  height: number;
}
export default function CableFeed() {
  const layout = useCableLayout();
  const ref = useRef<HTMLDivElement>(null);
  const [stubs, setStubs] = useState<Stub[]>([]);

  useEffect(() => {
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

      const next = outlets.map((o) => {
        const r = o!.getBoundingClientRect();
        const top = r.top - base.top - Math.max(16, layout.widthPx);
        return {
          left: r.left + r.width / 2 - base.left,
          top,
          height: Math.max(0, sectionTop - top + 6),
        };
      });

      setStubs((prev) =>
        prev.length === next.length &&
        prev.every(
          (s, i) =>
            Math.abs(s.left - next[i].left) < 0.5 &&
            Math.abs(s.top - next[i].top) < 0.5 &&
            Math.abs(s.height - next[i].height) < 0.5
        )
          ? prev
          : next
      );
    };

    measure();
    const raf = requestAnimationFrame(measure);
    const t1 = window.setTimeout(measure, 300);
    const t2 = window.setTimeout(measure, 1200);
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [layout.widthPx]);

  const w = layout.widthPx;
  const boxW = w * 2;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[6] overflow-visible"
      aria-hidden="true"
    >
      {stubs.map((s, i) => {
        if (s.height <= 0) return null;
        const cx = boxW / 2;
        const common = {
          x1: cx,
          y1: 0,
          x2: cx,
          y2: s.height,
          strokeLinecap: "round" as const,
        };
        return (
          <svg
            key={i}
            className="absolute overflow-visible"
            style={{
              left: s.left - cx,
              top: s.top,
              width: boxW,
              height: s.height,
            }}
            width={boxW}
            height={s.height}
            viewBox={`0 0 ${boxW} ${s.height}`}
          >
            <line {...common} stroke="#000000" strokeWidth={w} />
            <line {...common} stroke="#ffffff" strokeWidth={w * 0.722} />
            <line
              {...common}
              stroke="#000000"
              strokeWidth={w * 0.5}
              transform={`translate(${-w * 0.14},${-w * 0.14})`}
            />
            <line
              {...common}
              stroke="#000000"
              strokeWidth={w * 0.278}
              transform={`translate(${w * 0.083},${w * 0.083})`}
            />
          </svg>
        );
      })}
    </div>
  );
}
