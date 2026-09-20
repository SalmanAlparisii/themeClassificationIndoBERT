"use client";

import { useEffect, useState } from "react";

export type CableBreakpoint = "sm" | "md" | "lg";

export const CABLE_VIEWBOX = { width: 1600, height: 1000 } as const;

export const CABLE_MAX_WIDTH = 1600;

export const CABLE_STROKE_UNITS = 36;

export const CABLE_WIDTH_PX: Record<CableBreakpoint, number> = {
  sm: 16,
  md: 22,
  lg: 30,
};

export const CABLE_END_X: Record<CableBreakpoint, { red: number; blue: number }> = {
  lg: { red: 60, blue: 570 },
  md: { red: 120, blue: 1480 },
  sm: { red: 70, blue: 1530 },
};

export const VINYL_OUTLET_FRACTION = { red: 0.26, blue: 0.76 } as const;

export const CABLE_START_X: Record<CableBreakpoint, { red: number; blue: number }> = {
  lg: { red: 1180, blue: 1420 },
  md: { red: 620, blue: 1020 },
  sm: { red: 560, blue: 1040 },
};

export const SOCKET_HEIGHT_RATIO = 0.34;

export const PLUG_INSERTION_RATIO = 0.85;

export function viewportXToCableX(viewportX: number, layout: CableLayout) {
  return layout.scaleX > 0 ? (viewportX - layout.originX) / layout.scaleX : 0;
}

/** Kebalikan dari viewportXToCableX: konversi X di ruang cable (viewBox,
 * 0..1600) ke X viewport (px) sesungguhnya. Dipakai supaya CableFeed (stub)
 * dan BackgroundCable (kabel panjang) bisa nyambung persis di X yang sama. */
export function cableXToViewportX(cableX: number, layout: CableLayout) {
  return layout.originX + cableX * layout.scaleX;
}

export function getCableBreakpoint(width: number): CableBreakpoint {
  return width < 768 ? "sm" : width < 1024 ? "md" : "lg";
}

export interface CableEndpoint {
  key: "red" | "blue";
  x: number;
  viewportX: number;
}

export interface CableLayout {
  bp: CableBreakpoint;
  viewportWidth: number;
  columnWidth: number;
  originX: number;
  scaleX: number;
  widthPx: number;
  strokeUnits: number;
  endpoints: CableEndpoint[];
}

export function computeCableLayout(viewportWidth: number): CableLayout {
  const bp = getCableBreakpoint(viewportWidth);
  const columnWidth = Math.min(viewportWidth, CABLE_MAX_WIDTH);
  const originX = (viewportWidth - columnWidth) / 2;
  const scaleX = columnWidth / CABLE_VIEWBOX.width;
  const widthPx = CABLE_WIDTH_PX[bp];
  const strokeUnits = scaleX > 0 ? widthPx / scaleX : CABLE_STROKE_UNITS;
  const ends = CABLE_END_X[bp];

  return {
    bp,
    viewportWidth,
    columnWidth,
    originX,
    scaleX,
    widthPx,
    strokeUnits,
    endpoints: (["red", "blue"] as const).map((key) => ({
      key,
      x: ends[key],
      viewportX: originX + ends[key] * scaleX,
    })),
  };
}

function layoutWidth() {
  if (typeof document === "undefined") return CABLE_MAX_WIDTH;
  return document.documentElement.clientWidth || window.innerWidth;
}

export function useCableLayout(): CableLayout {
  const [layout, setLayout] = useState<CableLayout>(() =>
    computeCableLayout(CABLE_MAX_WIDTH)
  );

  useEffect(() => {
    const update = () => {
      const next = computeCableLayout(layoutWidth());
      setLayout((prev) =>
        prev.viewportWidth === next.viewportWidth ? prev : next
      );
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return layout;
}
