"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  jockeyOneRegular,
  oswaldBold,
  oswaldMedium,
  poppinsMedium,
  poppinsRegular,
} from "@/app/layout";

interface TapeLabelData {
  eyebrow: string;
  title: string;
  tapeId: string;
  serial: string;
  total: number;
  themes: number;
  train: number;
  test: number;
  date: string;
  archiveCode: string;
  room: string;
  log: string;
}

interface ProcessStage {
  id: string;
  label: string;
  hex: string;
  dotClass: string;
  reelAsset: string;
  number: string;
}

interface ThemeSleeve {
  id: string;
  number: string;
  title: string;
  bgClass: string;
  textClass: string;
  vinylClass: string;
}

const cardShadow = "shadow-[0_2px_5px_rgba(0,0,0,0.05)]";
const tapeGridCols =
  "grid-cols-[minmax(160px,1.3fr)_1px_minmax(280px,2.2fr)_1px_minmax(120px,0.9fr)_1px_minmax(140px,1.1fr)_1px_minmax(140px,1fr)]";
const balancedData: TapeLabelData = {
  eyebrow: "01 · Tape Label",
  title: "Balanced Dataset",
  tapeId: "BD-1035",
  serial: "89",
  total: 1035,
  themes: 3,
  train: 940,
  test: 210,
  date: "29 DEC 2025",
  archiveCode: "ARC-001035",
  room: "A-12",
  log: "L-0392",
};

const unbalancedData: TapeLabelData = {
  eyebrow: "02 · Tape Label",
  title: "Unbalanced Dataset",
  tapeId: "UB-3000",
  serial: "90",
  total: 3000,
  themes: 3,
  train: 2400,
  test: 600,
  date: "29 DEC 2025",
  archiveCode: "ARC-003000",
  room: "A-12",
  log: "L-0393",
};

const processStages: ProcessStage[] = [
  { id: "raw", label: "Raw Data", hex: "#F8F5EF", dotClass: "bg-[#111111]", reelAsset: "/firstReelTape.svg", number: "1" },
  { id: "cleaning", label: "Cleaning", hex: "#7C2121", dotClass: "bg-[#7C2121]", reelAsset: "/secondReelTape.svg",  number: "2" },
  { id: "labeling", label: "Labeling", hex: "#7388D9", dotClass: "bg-[#7388D9]", reelAsset: "/thirdReelTape.svg",  number: "3" },
  { id: "splitting", label: "Splitting", hex: "#D8D8D8", dotClass: "bg-[#7A7A7A]", reelAsset: "/fourthReelTape.svg",  number: "4" },
  { id: "ready", label: "Ready", hex: "#111111", dotClass: "bg-[#111111]", reelAsset: "/fifthReelTape.svg", number: "5"},
];

const themeSleeves: ThemeSleeve[] = [
  {
    id: "love",
    number: "001",
    title: "Love",
    bgClass: "bg-[#7C2121]",
    textClass: "text-[#F8F5EF]",
    vinylClass: "bg-[#111111]",
  },
  {
    id: "self-reflection",
    number: "002",
    title: "Self Reflection",
    bgClass: "bg-[#7388D9]",
    textClass: "text-[#111111]",
    vinylClass: "bg-[#111111]",
  },
  {
    id: "social-justice",
    number: "003",
    title: "Social Justice",
    bgClass: "bg-[#F8F5EF]",
    textClass: "text-[#111111]",
    vinylClass: "bg-[#111111]",
  },
];

const stageDescriptions: Record<string, string> = {
  cleaning:
    "Cleaning adalah proses membersihkan data mentah dari simbol, emoji, singkatan, dan noise lain supaya lirik siap diproses ke tahap berikutnya.",
  labeling:
    "Labeling adalah proses memberi label tema — Cinta, Refleksi Diri, atau Keadilan Sosial — pada tiap baris lirik yang sudah bersih.",
  splitting:
    "Splitting adalah proses membagi dataset yang sudah berlabel menjadi data latih (train) dan data uji (test), agar performa model dapat dievaluasi secara adil.",
  ready:
    "Ready menandakan dataset telah melalui seluruh tahap pemrosesan dan siap digunakan untuk pelatihan model.",
};

interface DatasetPreview {
  headers: string[];
  rows: string[][];
}

const stageDatasetPreview: Record<string, DatasetPreview> = {
  raw: {
    headers: ["No", "Lirik"],
    rows: [
      ["1", "Ku ingiiin kamuuu tauuu... :) <3 wkwk"],
      ["2", "sunyi ini kembali menemaniku lg :("],
      ["3", "..."],
    ],
  },
  cleaning: {
    headers: ["No", "Lirik"],
    rows: [
      ["1", "Ku ingin kamu tahu"],
      ["2", "sunyi ini kembali menemaniku lagi"],
      ["3", "..."],
    ],
  },
  labeling: {
    headers: ["No", "Lirik", "Tema"],
    rows: [
      ["1", "Ku ingin kamu tahu", "Cinta"],
      ["2", "sunyi ini kembali menemaniku lagi", "Refleksi Diri"],
      ["3", "...", "..."],
    ],
  },
  splitting: {
    headers: ["No", "Lirik", "Tema", "Split"],
    rows: [
      ["1", "Ku ingin kamu tahu", "Cinta", "Train"],
      ["2", "sunyi ini kembali menemaniku lagi", "Refleksi Diri", "Test"],
      ["3", "...", "...", "..."],
    ],
  },
  ready: {
    headers: ["No", "Lirik", "Tema", "Split"],
    rows: [
      ["1", "Ku ingin kamu tahu", "Cinta", "Train"],
      ["2", "sunyi ini kembali menemaniku lagi", "Refleksi Diri", "Test"],
      ["3", "...", "...", "..."],
    ],
  },
};

function ExcelPreview({ data }: { data: DatasetPreview }) {
  return (
    <div className="overflow-x-auto border border-[#B8B8B8]">
      <table className="w-full border-collapse text-left text-[11px] sm:text-xs">
        <thead>
          <tr className="bg-[#111111] text-white">
            {data.headers.map((h) => (
              <th key={h} className={`${oswaldMedium.className} border border-[#B8B8B8]/40 px-2 py-1 uppercase tracking-wide`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-[#F8F5EF]"}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`${poppinsRegular.className} truncate border border-[#B8B8B8] px-2 py-1 text-[#111111]`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function generateBarcodeWidths(seed: string, count: number): number[] {
  const widths: number[] = [];
  for (let i = 0; i < count; i++) {
    const ch = seed.charCodeAt(i % seed.length);
    widths.push(1 + ((ch + i * 7) % 3));
  }
  return widths;
}

function Barcode({
  seed,
  barClass = "bg-[#111111]",
  height,
  bars = 26,
  className,
  widthClassName,
}: {
  seed: string;
  barClass?: string;
  height?: number;
  bars?: number;
  className?: string;
  widthClassName?: string;
}) {
  const widths = generateBarcodeWidths(seed, bars);
  const style = className ? undefined : { height: height ?? 28 };

  return (
    <div
      aria-hidden="true"
      className={`flex items-stretch gap-[3%] ${widthClassName ?? ""} ${className ?? ""}`}
      style={style}
    >
      {widths.map((w, i) => (
        <span
          key={i}
          className={barClass}
          style={{ flex: `${w} 0 0`, height: "100%" }}
        />
      ))}
    </div>
  );
}

function TapeLabelStrip({ data, dark = false }: { data: TapeLabelData; dark?: boolean }) {
  const barcodeClass = dark ? "bg-[#F8F5EF]" : "bg-[#111111]";
  const solidTextClass = dark ? "text-[#F8F5EF]" : "text-[#111111]";
  const dividerClass = dark ? "bg-white/25" : "bg-[#111111]/15";
  const tapeNumber = data.eyebrow.split(" · ")[0];

  const stats = [
    { label: "Total Data", value: data.total },
    { label: "Themes", value: data.themes },
    { label: "Train", value: data.train },
    { label: "Test", value: data.test },
  ];

  const meta = [
    { l: "Master", v: "A", smOrder: 0, lgOrder: 0 },
    { l: "Lib", v: "DS", smOrder: 3, lgOrder: 1 },
    { l: "Cat", v: data.tapeId, smOrder: 1, lgOrder: 2 },
    { l: "Room", v: data.room, smOrder: 4, lgOrder: 3 },
    { l: "Log", v: data.log, smOrder: 2, lgOrder: 4 },
    { l: "Side", v: "A", smOrder: 5, lgOrder: 5 },
  ];

  return (
    <div
      className={`group relative isolate flex aspect-[1600/430] items-stretch overflow-hidden rounded-[3px] transition-transform duration-300 ease-out hover:-translate-y-0.5 sm:aspect-[2200/460] lg:aspect-[3072/256]`}
    >
      <Image
        src={dark ? "/blackLabelTapeSm.webp" : "/whiteLabelTapeSm.webp"}
        alt=""
        fill
        priority
        className="z-0 object-cover sm:hidden"
      />
      <Image
        src={dark ? "/blackLabelMd.webp" : "/whiteLabelMd.webp"}
        alt=""
        fill
        priority
        className="z-0 hidden object-cover sm:block lg:hidden"
      />
      <Image
        src={dark ? "/blackLabel.webp" : "/whiteLabelTape.webp"}
        alt=""
        fill
        priority
        className="z-0 hidden object-cover lg:block"
      />
      <div className={`absolute inset-0 z-[1]`} />

      <div className="relative z-10 flex w-[20px] shrink-0 flex-col items-center mt-0.5 gap-2 sm:w-8 sm:mt-2 lg:w-[50px] lg:mt-4">
        <span
          className={`${oswaldBold.className} text-base font-bold sm:text-lg lg:text-3xl`}
        >
          {tapeNumber}
        </span>
      </div>

      <div
        className="relative z-10 grid grid-cols-[1.3fr_1px_2.2fr_1px_0.9fr_1px_1.1fr_1px_1fr] min-w-0 flex-1 items-center whitespace-nowrap
          gap-x-1 py-1 pl-2 pr-2.5
          sm:gap-x-3 sm:pl-5 sm:pr-6
          lg:gap-x-4 lg:pl-8 lg:pr-10"
      >

        <div className="min-w-0 text-center">
          <span
            className={`${oswaldBold.className} block truncate text-[9px] font-bold uppercase tracking-wider sm:text-[12px] lg:text-lg ${solidTextClass}`}
          >
            {data.eyebrow}
          </span>
          <div className="flex flex-wrap items-baseline justify-center gap-x-1.5 lg:block">
            <span
              className={`${oswaldMedium.className} truncate text-[9px] uppercase tracking-tight sm:text-[12px] lg:block lg:text-sm ${solidTextClass}`}
            >
              {data.title}
            </span>
            <span
              className={`${poppinsMedium.className} truncate text-[9px] font-bold uppercase tracking-wide before:mr-1.5 before:opacity-50 before:content-['·'] sm:text-[12px] lg:mt-1 lg:block lg:text-sm lg:before:hidden ${solidTextClass}`}
            >
              Tape {data.tapeId} · Serial {data.serial}
            </span>
          </div>
        </div>

        <div className={`h-full w-px ${dividerClass}`} />
        <div className="grid min-w-0 grid-cols-2 items-center justify-items-center gap-y-1 sm:gap-y-2 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0 text-center">
              <span
                className={`${oswaldMedium.className} block truncate text-[10px] uppercase tracking-wider sm:text-[12px] lg:text-sm font  ${solidTextClass}`}
              >
                {stat.label}
              </span>
              <span
                className={`${oswaldBold.className} block truncate text-2xl font-bold leading-none sm:text-[28px] lg:text-4xl ${solidTextClass}`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className={`h-full w-px ${dividerClass}`} />

        <div className="min-w-0 text-center">
          <span
            className={`${oswaldBold.className} block truncate text-[10px] font-bold uppercase tracking-wider sm:text-[12px] lg:text-lg ${solidTextClass}`}
          >
            Rec. Date
          </span>
          <span
            className={`${poppinsMedium.className} mt-1 block truncate text-[11px] sm:text-[12px] lg:text-sm ${solidTextClass}`}
          >
            {data.date}
          </span>
        </div>

        <div className={`h-full w-px ${dividerClass}`} />
        <div className="flex min-w-0 w-full flex-col items-stretch justify-center gap-x-0 lg:grid lg:grid-cols-2 lg:place-items-center lg:w-auto lg:gap-x-4 lg:gap-y-1">          {meta.map((m) => (
            <div
              key={m.l}
              className="flex min-w-0 w-full flex-row items-baseline justify-between gap-x-2
                lg:order-[var(--lg-order)] lg:w-auto lg:flex-row lg:items-center lg:justify-start lg:gap-1"
              style={
                {
                  "--lg-order": m.lgOrder,
                } as CSSProperties
              }
            >
              <span
                className={`${oswaldMedium.className} shrink-0 text-[10px] font-bold uppercase tracking-wide sm:text-[12px] lg:text-sm ${solidTextClass}`}
              >
                {m.l}
              </span>
              <span
                className={`${poppinsMedium.className} truncate text-[11px] uppercase tracking-wide sm:text-[12px] lg:text-xs ${solidTextClass}`}
              >
                {m.v}
              </span>
            </div>
          ))}
        </div>

        <div className={`h-full w-px ${dividerClass}`} />
        <div className="flex min-w-0 flex-col items-center justify-self-center gap-1">
          <Barcode
            seed={data.serial}
            barClass={barcodeClass}
            bars={30}
            className="h-[16px] sm:h-[28px] lg:h-[34px]"
            widthClassName="w-[50px] sm:w-[95px] lg:w-[130px]"
          />
          <span
            className={`${poppinsMedium.className} truncate text-[9px] font-bold uppercase tracking-wide sm:text-[12px] lg:text-sm ${solidTextClass}`}
          >
            {data.archiveCode}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DatasetSection() {
  const [popupIndex, setPopupIndex] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14 lg:px-12">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1
              className={`${jockeyOneRegular.className} text-[64px] leading-[0.85] tracking-tight text-[#111111] sm:text-[80px] md:text-[90px]`}
            >
              Dataset
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="rounded-lg h-4 w-4 bg-[#7C2121]"></div>
              <span className={`${oswaldMedium.className} block text-lg uppercase tracking-wider text-[#7C2121]`}>
                Studio Tape Library
              </span>
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-6 md:w-auto md:flex-1 md:justify-center lg:gap-30">
            <div className="text-center">
              <span
                className={`${oswaldMedium.className} block whitespace-nowrap text-[clamp(0.6rem,1.6vw,0.875rem)] uppercase text-[#111111]`}
              >
                Library Code
              </span>
              <span
                className={`${poppinsMedium.className} whitespace-nowrap text-[clamp(0.85rem,2.2vw,1.125rem)] font-bold text-[#111111]`}
              >
                DS-2025
              </span>
            </div>
            <div className="text-center">
              <span
                className={`${oswaldMedium.className} block whitespace-nowrap text-[clamp(0.6rem,1.6vw,0.875rem)] uppercase text-[#111111]`}
              >
                Archive Room
              </span>
              <span
                className={`${poppinsMedium.className} whitespace-nowrap text-[clamp(0.85rem,2.2vw,1.125rem)] text-[#111111] font-bold`}
              >
                A-12
              </span>
            </div>
            <div className="text-center">
              <span
                className={`${oswaldMedium.className} block whitespace-nowrap text-[clamp(0.6rem,1.6vw,0.875rem)] uppercase text-[#111111]`}
              >
                Catalog No.
              </span>
              <span
                className={`${poppinsMedium.className} whitespace-nowrap text-[clamp(0.85rem,2.2vw,1.125rem)] text-[#111111] font-bold`}
              >
                ARC-0925
              </span>
            </div>
          </div>

          <span
            className={`${oswaldBold.className} inline-flex justify-center items-center border-2 border-[#7C2121] lg:px-3 lg:py-2 px-1 py-1 text-base md:text-lg lg:text-xl uppercase tracking-wider text-[#7C2121]`}
          >
            Recording Archive
          </span>
        </header>

        <section aria-label="Balanced dataset" className="mt-3 md:mt-6">
          <TapeLabelStrip data={balancedData} />
        </section>

        <section aria-label="Unbalanced dataset" className="mt-3">
          <TapeLabelStrip data={unbalancedData} dark />
        </section>

        <div className="mt-3 md:mt-6 lg:flex lg:items-stretch lg:gap-x-10">
          <div className="lg:min-w-0 lg:flex-1">
            <section aria-label="Data process tape path">
              <div className="mb-5 flex items-center gap-2">
                <span className={`${oswaldMedium.className} text-3xl uppercase tracking-wider text-[#111111] font-bold`}>
                  03
                </span>
                <span className={`${oswaldMedium.className} text-xl uppercase tracking-wider text-[#111111]`}>
                  Data Process
                </span>
              </div>
              <div className="rounded-2xl border-t-2 border-b-2 border-l-2 border-r-6 border-black bg-white overflow-visible">
                <div className="flex items-center">
                  {processStages.map((stage, i) => (
                    <div
                      key={stage.id}
                      className="flex items-center flex-1"
                    >
                      <div className="flex flex-col items-center mt-4 p-2 flex-1">
                        <Image
                          src={stage.reelAsset}
                          alt={stage.label}
                          width={112}
                          height={112}
                          className="h-20 w-45 shrink-0 drop-shadow-sm"
                        />
                        <div className={`${jockeyOneRegular.className}text-black text-xl font-bold`}>
                          {stage.number}
                        </div>
                        <span
                          className={`${oswaldMedium.className} text-sm uppercase tracking-wide text-[#111111] sm:text-lg`}
                        >
                          {stage.label}
                        </span>
                      </div>
                      {i < processStages.length - 1 && (
                        <button
                          type="button"
                          aria-label={`Lihat perbandingan ${processStages[i].label} dan ${processStages[i + 1].label}`}
                          onClick={() => setPopupIndex(i)}
                          className="
                            relative
                            z-10
                            shrink-0
                            -mx-8
                            mb-4
                            h-8
                            w-8
                            sm:-mx-12
                            sm:h-8
                            sm:w-18
                            md:-mx-10
                            md:h-12
                            md:w-12
                            cursor-pointer
                            bg-transparent
                            p-0
                            border-0
                          "
                        >
                          <Image
                            src="/tapeRoll.svg"
                            alt=""
                            aria-hidden="true"
                            fill
                            className="pointer-events-none object-contain"
                          />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section aria-label="Theme distribution" className="mt-6 md:mt-8 overflow-visible">
              <div className="mb-5 flex items-center gap-2">
                <span className={`${oswaldMedium.className} text-3xl uppercase tracking-wider font-bold text-[#111111]`}>
                  04
                </span>
                <span className={`${oswaldMedium.className} text-xl uppercase tracking-wider text-[#111111]`}>
                  Theme Distribution
                </span>
              </div>
              <div className="flex flex-wrap gap-8 sm:gap-12 md:gap-20 lg:justify-start justify-center overflow-visible">
                {themeSleeves.map((sleeve) => (
                  <article
                    key={sleeve.id}
                    aria-label={`${sleeve.title} archive sleeve`}
                    className="group relative overflow-visible cursor-grab active:cursor-grabbing h-[clamp(110px,calc(71.268px+10.3286vw),220px)] w-[clamp(110px,calc(71.268px+10.3286vw),220px)]"
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute z-0 top-1/2 -translate-y-1/2 h-[clamp(95px,calc(59.789px+9.3897vw),195px)] w-[clamp(95px,calc(59.789px+9.3897vw),195px)] right-[clamp(-42px,calc(-24.972px-3.4742vw),-38px)] rounded-full ${sleeve.vinylClass} shadow-[0_2px_5px_rgba(0,0,0,0.05)] transition-[right,box-shadow] duration-300 ease-out group-hover:right-[clamp(-88px,calc(-31.211px-3.9437vw),-46px)] group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.25)] group-active:right-[clamp(-94px,calc(-34.507px-4.1315vw),-50px)]`}
                    >
                      <div className="absolute inset-[3.6%] rounded-full border border-white/10" />
                      <div className="absolute inset-[9.2%] rounded-full border border-white/10" />
                      <div className="absolute inset-[15.9%] rounded-full border border-white/10" />
                      <div className="absolute left-1/2 top-1/2 h-[32.8%] w-[32.8%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
                      <div className="absolute left-1/2 top-1/2 h-[6.2%] w-[6.2%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8F5EF]" />
                    </div>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 40 40"
                      className="pointer-events-none absolute -right-8 top-1/2 z-20 h-7 w-7 -translate-y-1/2 translate-x-0 text-[#111111] opacity-0 transition-all duration-300 ease-out group-hover:translate-x-3 group-hover:opacity-100 group-active:translate-x-5 sm:-right-9 sm:h-8 sm:w-8 lg:-right-11 lg:h-9 lg:w-9 lg:group-hover:translate-x-4 lg:group-active:translate-x-6"
                    >
                      <path
                        d="M14 20V9a2 2 0 1 1 4 0v8M18 17V7a2 2 0 1 1 4 0v10M22 17v-6a2 2 0 1 1 4 0v8M26 19v-3a2 2 0 1 1 4 0v6c0 5-3 9-8 9h-3c-3 0-5-1-7-3l-5-5a2 2 0 0 1 3-3l3 2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div
                      className={`relative z-10 flex h-full w-full flex-col justify-between border-2 border-[#111111] p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25),0_2px_5px_rgba(0,0,0,0.05)] transition-shadow duration-300 ease-out group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25),0_6px_14px_rgba(0,0,0,0.1)] sm:p-3 lg:p-3.5 ${sleeve.bgClass}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`${oswaldMedium.className} block text-[10px] font-bold uppercase tracking-wide ${sleeve.textClass} sm:text-xs`}>
                            Theme Archive
                          </span>
                          <span className={`${poppinsMedium.className} mt-0.5 hidden text-[10px] font-bold uppercase tracking-wide ${sleeve.textClass} sm:block`}>
                            Cat DS2025 · Master
                          </span>
                        </div>
                        <span className={`${poppinsMedium.className} text-[9px] font-bold uppercase tracking-wide ${sleeve.textClass} sm:text-[10px]`}>
                          Side A
                        </span>
                      </div>
                      <span className={`${oswaldBold.className} text-base uppercase leading-tight ${sleeve.textClass} sm:text-lg lg:text-xl`}>
                        {sleeve.title}
                      </span>
                      <div className="flex items-end justify-between">
                        <span className={`${poppinsMedium.className} text-[9px] font-bold tracking-wide ${sleeve.textClass} sm:text-[10px]`}>
                          {sleeve.number}
                        </span>
                        <Barcode
                          seed={sleeve.id}
                          barClass={sleeve.textClass === "text-[#F8F5EF]" ? "bg-[#F8F5EF]" : "bg-[#111111]"}
                          height={16}
                          bars={12}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
          <section
            aria-label="Source information"
            className="mt-6 flex flex-col lg:mt-0 lg:w-[260px] lg:shrink-0"
          >
            <div className="mb-5 flex items-center gap-2">
              <span className={`${oswaldMedium.className} text-3xl uppercase tracking-wider text-[#111111] font-bold`}>
                05
              </span>
              <span className={`${oswaldMedium.className} text-xl uppercase tracking-wider text-[#111111]`}>
                Source Information
              </span>
            </div>
            <div
              className={`relative flex flex-1 flex-col border-[#111111] pt-2 pb-6 sm:pt-4 sm:pb-8 lg:p-8 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]
                bg-[url('/archieveInformationSm.svg')] bg-cover bg-center bg-no-repeat
                sm:bg-[url('/archieveInformationMd.svg')]
                lg:bg-[url('/achieveInformation.svg')]
                ${cardShadow}`}
            >
              <dl className="space-y-2 sm:space-y-3 lg:space-y-4 text-sm">
                <div>
                  <dt className={`${oswaldMedium.className} text-base sm:text-lg lg:text-xl uppercase tracking-wide font-bold text-[#111111]`}>
                    Source
                  </dt>
                  <dd className={`${poppinsMedium.className} mt-0.5 text-xs sm:text-sm text-[#111111]`}>Genius</dd>
                </div>
                <div className="border-t border-dotted border-[#B8B8B8] pt-2 sm:pt-3 lg:pt-4">
                  <dt className={`${oswaldMedium.className} text-base sm:text-lg lg:text-xl uppercase tracking-wide font-bold text-[#111111]`}>
                    Access Date
                  </dt>
                  <dd className={`${poppinsMedium.className} mt-0.5 text-xs sm:text-sm text-[#111111]`}>29 December 2025</dd>
                </div>
                <div className="border-t border-dotted border-[#B8B8B8] pt-2 sm:pt-3 lg:pt-4">
                  <dt className={`${oswaldMedium.className} text-base sm:text-lg lg:text-xl uppercase tracking-wide font-bold text-[#111111]`}>
                    Catalog Note
                  </dt>
                  <dd className={`${poppinsRegular.className} mt-0.5 text-xs sm:text-sm text-[#111111]`}>
                    Lyrics &amp; Metadata Archive
                  </dd>
                </div>
                <div className="border-t border-dotted border-[#B8B8B8] pt-2 sm:pt-3 lg:pt-4">
                  <dt className={`${oswaldMedium.className} text-base sm:text-lg lg:text-xl uppercase tracking-wide font-bold text-[#111111]`}>
                    Dataset Version
                  </dt>
                  <dd className={`${poppinsMedium.className} mt-0.5 text-xs sm:text-sm text-[#111111]`}>v 1.0</dd>
                </div>
              </dl>
              <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:pt-4 lg:pt-6 mb-3 sm:mb-4 lg:mb-6">
                <span className={`${poppinsRegular.className} text-[9px] sm:text-[10px] lg:text-[12px] uppercase tracking-wide text-[#111111] font-bold`}>
                  Log · ARC-001035
                </span>
                <span
                  className={`${oswaldBold.className} inline-block -rotate-[7deg] border-2 rounded-xs border-[#111111] px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-[12px] lg:text-[14px] uppercase tracking-wide text-[#111111] -mt-2`}
                >
                  Checked
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
      {popupIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setPopupIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden border-2 border-[#111111] bg-[#FFFFFF] shadow-[0_12px_30px_rgba(0,0,0,0.35)] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-[#111111] bg-[#111111] px-5 py-3 sm:px-8">
              <div className="flex items-center gap-3">
                <span className={`${oswaldBold.className} text-lg text-[#FFFFFF] sm:text-4xl`}>
                  {String(popupIndex + 1).padStart(2, "0")}
                </span>
                <div className="h-6 w-px bg-white/25 sm:h-8" />
                <div>
                  <span className={`${oswaldMedium.className} block text-4xl text-[#FFFFFF] sm:text-4xl`}>
                    {processStages[popupIndex + 1].label}
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setPopupIndex(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#FFFFFF] text-lg font-bold text-[#FFFFFF] transition-colors hover:bg-[#FFFFFF] hover:text-[#111111]"
              >
                ×
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto px-5 py-6 sm:px-8 sm:pt-8 sm:pb-12">
              <p className={`${poppinsRegular.className} max-w-3xl text-sm leading-relaxed text-[#111111]/80 sm:text-base`}>
                {stageDescriptions[processStages[popupIndex + 1].id]}
              </p>
              <h3 className={`${jockeyOneRegular.className} mt-3 text-3xl leading-none text-[#111111] sm:text-4xl`}>
                Before &amp; After
              </h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col">
                  <span
                    className={`${oswaldBold.className} text-left text-[11px] font-bold uppercase tracking-widest text-[#7A7A7A] sm:text-xs`}
                  >
                    Before
                  </span>
                  <div className="mt-2 border-2 border-dashed border-[#111111]/65 bg-white p-3 sm:p-4">
                    <ExcelPreview data={stageDatasetPreview[processStages[popupIndex].id]} />
                  </div>
                  <span className={`${oswaldMedium.className} mt-2 text-center text-sm uppercase text-[#111111]`}>
                    {processStages[popupIndex].label}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span
                    className={`${oswaldBold.className} text-left text-[11px] font-bold uppercase tracking-widest text-[#7C2121] sm:text-xs`}
                  >
                    After
                  </span>
                  <div className="mt-2 border-2 border-[#111111] bg-white p-3 shadow-[3px_3px_0_0_#7C2121] sm:p-4">
                    <ExcelPreview data={stageDatasetPreview[processStages[popupIndex + 1].id]} />
                  </div>
                  <span className={`${oswaldMedium.className} mt-2 text-center text-sm uppercase text-[#111111]`}>
                    {processStages[popupIndex + 1].label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

