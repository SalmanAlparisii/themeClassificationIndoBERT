"use client";

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
  "grid-cols-[minmax(170px,1.3fr)_1px_minmax(300px,2.2fr)_1px_minmax(130px,0.9fr)_1px_minmax(150px,1.1fr)_1px_minmax(150px,1fr)]";

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

// reelAsset maps each stage to its matching /public SVG (firstReel..fifthReel)
const processStages: ProcessStage[] = [
  { id: "raw", label: "Raw Data", hex: "#F8F5EF", dotClass: "bg-[#111111]", reelAsset: "/firstReel.svg" },
  { id: "cleaning", label: "Cleaning", hex: "#7C2121", dotClass: "bg-[#7C2121]", reelAsset: "/secondReel.svg" },
  { id: "labeling", label: "Labeling", hex: "#7388D9", dotClass: "bg-[#7388D9]", reelAsset: "/thirdReel.svg" },
  { id: "splitting", label: "Splitting", hex: "#D8D8D8", dotClass: "bg-[#7A7A7A]", reelAsset: "/fourthReel.svg" },
  { id: "ready", label: "Ready", hex: "#111111", dotClass: "bg-[#111111]", reelAsset: "/fifthReel.svg" },
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
  height = 28,
  bars = 26,
}: {
  seed: string;
  barClass?: string;
  height?: number;
  bars?: number;
}) {
  const widths = generateBarcodeWidths(seed, bars);
  return (
    <div aria-hidden="true" className="flex items-center gap-[1.5px]" style={{ height }}>
      {widths.map((w, i) => (
        <span key={i} className={barClass} style={{ width: w, height: "100%" }} />
      ))}
    </div>
  );
}

function TapeLabelStrip({ data, dark = false }: { data: TapeLabelData; dark?: boolean }) {
  const barcodeClass = dark ? "bg-[#F8F5EF]" : "bg-[#111111]";
  const solidTextClass = dark ? "text-[#F8F5EF]" : "text-[#111111]";
  const dividerClass = dark ? "bg-white/25" : "bg-[#111111]/15";
  const tapeNumber = data.eyebrow.split(" · ")[0];

  return (
    <div
      className={`group relative isolate flex aspect-[3072/256] items-stretch overflow-hidden rounded-[3px] transition-transform duration-300 ease-out hover:-translate-y-0.5`}
    >
      <Image
        src={dark ? "/blackLabel.webp" : "/whiteLabelTape.webp"}
        alt=""
        fill
        priority
        className="z-0 object-cover"
      />
      <div className={`absolute inset-0 z-[1]`} />

      <div className="relative z-10 flex w-[50px] shrink-0 flex-col items-center mt-4 gap-2">
        <span className={`${oswaldBold.className} text-3xl font-bold`}>{tapeNumber}</span>
      </div>

      <div
        className={`relative z-10 grid ${tapeGridCols} flex-1 items-center gap-x-4 whitespace-nowrap py-3 pl-6 pr-10 sm:gap-x-4 sm:pl-8 sm:pr-8`}
      >
        <div className="min-w-0 text-center">
          <span className={`${oswaldBold.className} block text-lg font-bold uppercase tracking-wider ${solidTextClass}`}>
            {data.eyebrow}
          </span>
          <span className={`${oswaldMedium.className} block text-sm uppercase tracking-tight ${solidTextClass}`}>
            {data.title}
          </span>
          <span className={`${poppinsMedium.className} mt-1 block text-sm font-bold uppercase tracking-wide ${solidTextClass}`}>
            Tape {data.tapeId} · Serial {data.serial}
          </span>
        </div>

        <div className={`h-full w-px ${dividerClass}`} />

        <div className="grid grid-cols-4 items-center justify-items-center gap-6">
          {[
            { label: "Total Data", value: data.total },
            { label: "Themes", value: data.themes },
            { label: "Train", value: data.train },
            { label: "Test", value: data.test },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className={`${oswaldMedium.className} block text-sm uppercase tracking-wider ${solidTextClass}`}>
                {stat.label}
              </span>
              <span className={`${oswaldBold.className} block text-3xl font-bold leading-none sm:text-4xl ${solidTextClass}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className={`h-full w-px ${dividerClass}`} />

        <div className="text-center">
          <span className={`${oswaldBold.className} block text-lg font-bold uppercase tracking-wider ${solidTextClass}`}>
            Rec. Date
          </span>
          <span className={`${poppinsMedium.className} mt-1 block text-sm ${solidTextClass}`}>
            {data.date}
          </span>
        </div>

        <div className={`h-full w-px ${dividerClass}`} />

        <div className="grid grid-cols-2 place-items-center gap-x-4 gap-y-1">
          {[
            { l: "Master", v: "A" },
            { l: "Lib", v: "DS" },
            { l: "Cat", v: data.tapeId },
            { l: "Room", v: data.room },
            { l: "Log", v: data.log },
            { l: "Side", v: "A" },
          ].map((m) => (
            <div key={m.l} className="flex items-center gap-1">
              <span className={`${oswaldMedium.className} text-sm font-bold uppercase tracking-wide ${solidTextClass}`}>
                {m.l}
              </span>
              <span className={`${poppinsMedium.className} text-xs uppercase tracking-wide ${solidTextClass}`}>
                {m.v}
              </span>
            </div>
          ))}
        </div>

        <div className={`h-full w-px ${dividerClass}`} />
        <div className="flex flex-col items-center justify-self-center gap-1">
          <Barcode seed={data.serial} barClass={barcodeClass} height={34} bars={30} />
          <span className={`${poppinsMedium.className} text-sm font-bold uppercase tracking-wide ${solidTextClass}`}>
            {data.archiveCode}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DatasetSection() {
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
          <div className="flex items-center gap-4 mt-3 ">
            <div className="rounded-lg h-4 w-4 bg-[#7C2121]"></div>  
            <span className={`${oswaldMedium.className} block text-lg uppercase tracking-wider text-[#7C2121]`}>
              Studio Tape Library
            </span>
          </div>
          </div>

          <div className="flex w-full flex-wrap justify-between gap-6 md:w-[520px] md:gap-0 items-center">
            <div className="text-center">
              <span className={`${oswaldMedium.className} block text-sm uppercase text-[#111111]`}>
                Library Code
              </span>
              <span className={`${poppinsMedium.className} text-lg font-bold text-[#111111]`}>DS-2025</span>
            </div>
            <div className="text-center">
              <span className={`${oswaldMedium.className} block text-sm uppercase text-[#111111]`}>
                Archive Room
              </span>
              <span className={`${poppinsMedium.className} text-lg text-[#111111] font-bold`}>A-12</span>
            </div>
            <div className="text-center">
              <span className={`${oswaldMedium.className} block text-sm uppercase text-[#111111]`}>
                Catalog No.
              </span>
              <span className={`${poppinsMedium.className} text-lg text-[#111111] font-bold`}>ARC-0925</span>
            </div>
            <span
              className={`${oswaldBold.className} inline-flex items-center border-2 border-[#7C2121] px-3 py-2 text-xl uppercase tracking-wider text-[#7C2121]`}
            >
              Recording Archive
            </span>
          </div>
        </header>

        <section aria-label="Balanced dataset" className="mt-3 md:mt-6">
          <TapeLabelStrip data={balancedData} />
        </section>

        <section aria-label="Unbalanced dataset" className="mt-3">
          <TapeLabelStrip data={unbalancedData} dark />
        </section>

        <div className="relative mt-3 md:mt-6">
          <div className="lg:pr-[292px]">
            {/* ==========================================================
                03 · Data Process — rebuilt with the reel + rollTape SVG
                assets: one reel image per stage (color already baked
                into each asset), rollTape.svg as the round "button"
                connector placed right after every reel, a label under
                each reel, and next.svg as the closing arrow.
                ========================================================== */}
            <section aria-label="Data process tape path">
              <div className="mb-5 flex items-center gap-2">
                <span className={`${oswaldMedium.className} text-3xl uppercase tracking-wider text-[#111111] font-bold`}>
                  03
                </span>
                <span className={`${oswaldMedium.className} text-xl uppercase tracking-wider text-[#111111]`}>
                  Data Process
                </span>
              </div>

              <div className="flex items-center">
                {processStages.map((stage, i) => (
                  <div key={stage.id} className="flex items-center">
                    <div className="flex flex-col items-center mt-4">
                      <Image
                        src={stage.reelAsset}
                        alt={stage.label}
                        width={112}
                        height={112}
                        className="h-20 w-45 shrink-0 drop-shadow-sm"
                      />
                      <span
                        className={`${oswaldMedium.className} text-xs uppercase tracking-wide text-[#7A7A7A] sm:text-sm`}
                      >
                        {stage.label}
                      </span>
                    </div>

                    {i < processStages.length - 1 && (
                      <Image
                        src="/rollTape.svg"
                        alt=""
                        aria-hidden="true"
                        width={128}
                        height={40}
                        className="-mx-8 mb-4 h-20 w-30 sm:-mx-10 sm:h-18 sm:w-34 z-10"
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
            <section aria-label="Theme distribution" className="mt-6 md:mt-8">
              <div className="mb-5 flex items-center gap-2">
                <span className={`${oswaldMedium.className} text-3xl uppercase tracking-wider font-bold text-[#111111]`}>
                  04
                </span>
                <span className={`${oswaldMedium.className} text-xl uppercase tracking-wider text-[#111111]`}>
                  Theme Distribution
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-30 sm:justify-start">
                {themeSleeves.map((sleeve) => (
                  <article
                    key={sleeve.id}
                    aria-label={`${sleeve.title} archive sleeve`}
                    className="group relative h-[190px] w-[190px] cursor-grab active:cursor-grabbing"
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute right-[-63px] top-1/2 h-[168px] w-[168px] -translate-y-1/2 rounded-full ${sleeve.vinylClass} shadow-[0_2px_5px_rgba(0,0,0,0.05)] transition-[right,box-shadow] duration-300 ease-out group-hover:right-[-76px] group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.25)] group-active:right-[-82px]`}
                    >
                      <div className="absolute inset-[7px] rounded-full border border-white/10" />
                      <div className="absolute inset-[18px] rounded-full border border-white/10" />
                      <div className="absolute inset-[31px] rounded-full border border-white/10" />
                      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
                      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8F5EF]" />
                    </div>

                    <svg
                      aria-hidden="true"
                      viewBox="0 0 40 40"
                      className="pointer-events-none absolute -right-11 top-1/2 z-20 h-9 w-9 -translate-y-1/2 translate-x-0 text-[#111111] opacity-0 transition-all duration-300 ease-out group-hover:translate-x-4 group-hover:opacity-100 group-active:translate-x-6"
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
                      className={`relative z-10 flex h-full w-full flex-col justify-between border-2 border-[#111111] p-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25),0_2px_5px_rgba(0,0,0,0.05)] transition-shadow duration-300 ease-out group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25),0_6px_14px_rgba(0,0,0,0.1)] ${sleeve.bgClass}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`${oswaldMedium.className} block text-xs uppercase tracking-wide ${sleeve.textClass}`}>
                            Theme Archive
                          </span>
                          <span className={`${poppinsRegular.className} mt-0.5 block text-[10px] uppercase tracking-wide ${sleeve.textClass} opacity-80`}>
                            Cat DS2025 · Master
                          </span>
                        </div>
                        <span className={`${poppinsRegular.className} text-[10px] uppercase tracking-wide ${sleeve.textClass} opacity-80`}>
                          Side A
                        </span>
                      </div>

                      <span className={`${oswaldBold.className} text-xl uppercase leading-tight ${sleeve.textClass}`}>
                        {sleeve.title}
                      </span>

                      <div className="flex items-end justify-between">
                        <span className={`${poppinsRegular.className} text-[10px] tracking-wide ${sleeve.textClass}`}>
                          {sleeve.number}
                        </span>
                        <Barcode
                          seed={sleeve.id}
                          barClass={sleeve.textClass === "text-[#F8F5EF]" ? "bg-[#F8F5EF]" : "bg-[#111111]"}
                          height={20}
                          bars={16}
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
            className={`relative mt-6 flex flex-col rounded-[3px] border-2 border-[#111111] bg-[#F8F5EF] p-8 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] ${cardShadow} lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[260px] rounded-xl`}
          >
            <span
              aria-hidden="true"
              className="absolute -top-3 left-[38%] h-6 w-24 -translate-x-1/2 -rotate-[4deg] skew-x-[-2deg] border border-[#D8D8D8] bg-[#F8F5EF]/75 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
            />
            <span
              aria-hidden="true"
              className="absolute -top-2 right-8 h-5 w-14 rotate-[6deg] border border-[#D8D8D8]/80 bg-[#F8F5EF]/60"
            />

            <span className={`${oswaldMedium.className} mb-1 block text-3xl uppercase tracking-wider text-[#111111]`}>
              05 
            </span>
            <span className={`${oswaldMedium.className} mb-6 block text-xl uppercase tracking-wider text-[#111111]`}>
              Source Information
            </span>

            <dl className="space-y-4 text-sm">
              <div>
                <dt className={`${oswaldMedium.className} text-xl uppercase tracking-wide font-bold text-[#111111]`}>
                  Source
                </dt>
                <dd className={`${poppinsMedium.className} mt-0.5 text-sm text-[#111111]`}>Genius</dd>
              </div>
              <div className="border-t border-dotted border-[#B8B8B8] pt-4">
                <dt className={`${oswaldMedium.className} text-xl uppercase tracking-wide font-bold text-[#111111]`}>
                  Access Date
                </dt>
                <dd className={`${poppinsMedium.className} mt-0.5 text-sm text-[#111111]`}>29 December 2025</dd>
              </div>
              <div className="border-t border-dotted border-[#B8B8B8] pt-4">
                <dt className={`${oswaldMedium.className} text-xl uppercase tracking-wide font-bold text-[#111111]`}>
                  Catalog Note
                </dt>
                <dd className={`${poppinsRegular.className} mt-0.5 text-sm text-[#111111]`}>
                  Lyrics &amp; Metadata Archive
                </dd>
              </div>
            </dl>

            <div className="mt-auto flex items-center justify-between pt-10">
              <span className={`${poppinsRegular.className} text-[10px] uppercase tracking-wide text-[#7A7A7A]`}>
                Log · ARC-001035
              </span>
              <span
                className={`${oswaldBold.className} inline-block -rotate-[7deg] border-2 border-[#7C2121]/70 px-3 py-1 text-[10px] uppercase tracking-wide text-[#7C2121]/70`}
              >
                Checked
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}