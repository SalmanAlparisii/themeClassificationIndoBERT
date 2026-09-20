"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jockeyOneRegular, oswaldMedium, poppinsRegular } from "@/app/layout";
import BackgroundCable from "@/components/backgroundCable";
import { CABLE_VIEWBOX, PLUG_INSERTION_RATIO, useCableLayout, viewportXToCableX, CABLE_END_X } from "@/lib/cableGeometry";

type BackgroundItem = { id: string; step: string; title: string; text: string; description: string };

const backgroundItems: BackgroundItem[] = [
  { id: "01", step: "Masalah", title: "Ledakan\nPada Musik Digital", description: "Identifikasi", text: "Perkembangan teknologi informasi dan komunikasi dalam beberapa tahun terakhir telah membawa perubahan besar terhadap industri musik, khususnya dalam cara generasi muda mengonsumsi musik (Noviani et al., 2020). Perkembangan platform musik digital memberikan kemudahan bagi pengguna untuk mengakses dan menemukan lagu dalam jumlah yang sangat besar, sehingga pilihan musik menjadi semakin beragam dibandingkan sebelumnya. Namun, banyaknya pilihan juga dapat membuat proses pencarian menjadi lebih kompleks ketika pengguna ingin menemukan lagu berdasarkan perasaan, pengalaman, atau makna tertentu. Kondisi tersebut menunjukkan perlunya suatu pendekatan yang mampu mengorganisasi kumpulan lagu berdasarkan karakteristik tertentu agar pengguna dapat menemukan musik yang sesuai dengan kebutuhan mereka secara lebih terarah." },
  { id: "02", step: "Tantangan", title: "Klasifikasi Tema & Tantangannya", description: "Tantangan", text: "Salah satu pendekatan yang dapat digunakan untuk mengatasi permasalahan tersebut adalah klasifikasi, yaitu proses pengelompokan objek berdasarkan karakteristik tertentu ke dalam beberapa kelas (Indriani et al., 2017). Pada lirik lagu, klasifikasi dapat digunakan untuk mengelompokkan lagu berdasarkan karakteristik maupun makna yang terkandung di dalamnya. Namun, klasifikasi tema memiliki tantangan yang berbeda dengan klasifikasi sentimen. Klasifikasi sentimen umumnya berfokus pada polaritas seperti positif dan negatif (Basbeth & Fudholi, 2024), sedangkan tema berusaha mengidentifikasi gagasan atau subjek utama dalam sebuah karya (Fang, 2023). Tantangan semakin besar karena tema dapat disampaikan secara implisit melalui hubungan antar kata dan konteks kalimat, sehingga pendekatan yang hanya memperhatikan kemunculan kata belum tentu mampu memahami makna sebenarnya." },
  { id: "03", step: "Fokus", title: "Tema sebagai Fokus Penelitian", description: "Fokus Penelitian", text: "Tema menjadi penting karena memberikan gambaran mengenai gagasan utama dan pesan yang ingin disampaikan melalui sebuah lagu (Khuzaimatus Sa'adah et al., 2023). Dalam lirik, makna tidak selalu disampaikan secara langsung, tetapi dapat muncul melalui hubungan antar kata, konteks kalimat, maupun penggunaan bahasa yang bersifat kiasan (Asriati & Asmayanti, 2021), sehingga identifikasi tema membutuhkan pemahaman terhadap konteks dan hubungan semantik dalam teks. Penelitian (Du, 2024) menunjukkan adanya beberapa thematic clusters yang dominan dalam kumpulan lirik, di antaranya love, social justice, dan personal reflection. Temuan tersebut menjadi dasar pemilihan tiga kategori dalam penelitian ini, yaitu cinta, keadilan sosial, dan refleksi diri, yang juga relevan dengan kecenderungan pengguna dalam menemukan musik berdasarkan tema dan kondisi emosional (Fang, 2023)." },
  { id: "04", step: "Keterbatasan", title: "Keterbatasan Metode Sebelumnya", description: "Keterbatasan", text: "Identifikasi tema pada lirik lagu sebelumnya banyak dilakukan menggunakan pendekatan kualitatif dengan menganalisis teks secara langsung untuk menemukan gagasan dan pesan utama (Khuzaimatus Sa'adah et al., 2023). Meskipun pendekatan tersebut mampu memberikan pemahaman yang mendalam, proses manual menjadi kurang efisien ketika jumlah data semakin besar. Perkembangan machine learning kemudian memungkinkan proses klasifikasi dilakukan secara otomatis menggunakan metode seperti Naïve Bayes (Andriani, 2025) dan TWCNB (Pratiwi, 2014). Namun, metode tradisional masih memiliki keterbatasan dalam memahami hubungan antar kata dan konteks karena representasi fiturnya cenderung mengasumsikan fitur sebagai sesuatu yang independen (Peretz et al., 2024). Keterbatasan tersebut menjadi semakin penting ketika sistem harus memahami makna implisit dan pola bahasa yang kompleks dalam lirik lagu." },
  { id: "05", step: "Solusi", title: "Deep\nLearning & IndoBERT", description: "Pendekatan", text: "Keterbatasan metode tradisional mendorong penggunaan pendekatan deep learning yang mampu mempelajari representasi data secara lebih kompleks. Deep learning dapat mempelajari representasi pada berbagai tingkat abstraksi sehingga tidak sepenuhnya bergantung pada fitur yang ditentukan secara manual (LeCun et al., 2015). Dalam pemrosesan bahasa alami, BERT menjadi salah satu pendekatan penting karena mampu memahami representasi kata berdasarkan konteks dari dua arah (Devlin et al., 2019). Untuk bahasa Indonesia, pendekatan tersebut dikembangkan melalui IndoBERT yang dirancang untuk memahami karakteristik bahasa Indonesia. (Koto et al., 2020) menunjukkan bahwa IndoBERT memperoleh F1-score 84,13 pada tugas analisis sentimen, lebih tinggi dibandingkan Naïve Bayes sebesar 70,95 dan LSTM sebesar 71,62. Hasil tersebut menunjukkan potensi transformer dalam memahami konteks bahasa dan menjadi dasar penggunaan IndoBERT untuk klasifikasi tema lirik lagu." },
];

const totalPoints = backgroundItems.length;

function renderWithCitationHighlight(text: string) {
  const regex = /(\([^)]+\d{4}\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <span key={index} className="relative inline-block">
          <span className="absolute inset-x-0 top-[12%] bottom-[12%] -z-10 rounded-sm bg-[#6D84D7]/30" />
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function BackgroundSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [introProgress, setIntroProgress] = useState(0);
  const [textPadTop, setTextPadTop] = useState(0);
  const [leftPadTop, setLeftPadTop] = useState(0);
  const stickyRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const updateTextPadRef = useRef<() => void>(() => {});
  const updateLeftPadRef = useRef<() => void>(() => {});
  const introHeight = 160;
  const contentHeight = totalPoints * 100;
  const extensionHeight = 80;
  const endHeight = 10;
  const coreHeight = introHeight + contentHeight + extensionHeight;

  const [extendProgress, setExtendProgress] = useState(0);
  const [cableEndY, setCableEndY] = useState(CABLE_VIEWBOX.height + 120);
  const [cableStartX, setCableStartX] = useState<
    { red: number; blue: number } | undefined
  >(undefined);
  const cableLayout = useCableLayout();

  useEffect(() => {
    const observedEls = new Set<Element>();
    const observeOnce = (el: Element | null) => {
      if (el && !observedEls.has(el)) {
        observedEls.add(el);
        ro.observe(el);
      }
    };

    const measure = () => {
      const core = coreRef.current;
      const sticky = stickyRef.current;
      if (!core || !sticky) return;

      const stickyHeight = sticky.getBoundingClientRect().height;
      if (stickyHeight <= 0) return;

      const redOutlet = document.querySelector<HTMLElement>(
        '[data-cable-outlet="red"]'
      );
      const blueOutlet = document.querySelector<HTMLElement>(
        '[data-cable-outlet="blue"]'
      );
      if (redOutlet && blueOutlet) {
        const toX = (el: HTMLElement) => {
          const r = el.getBoundingClientRect();
          return viewportXToCableX(r.left + r.width / 2, cableLayout);
        };
        // Di md ke bawah, paksa titik mulai kabel ke X yang PERSIS SAMA dengan
        // CABLE_END_X (titik yang juga dipakai CableFeed untuk stub di atas),
        // supaya sambungannya lurus & konsisten, tanpa belokan internal lagi.
        const next =
          cableLayout.bp === "lg"
            ? { red: toX(redOutlet), blue: toX(blueOutlet) }
            : { red: CABLE_END_X[cableLayout.bp].red, blue: CABLE_END_X[cableLayout.bp].blue };
        setCableStartX((prev) =>
          prev &&
          Math.abs(prev.red - next.red) < 0.5 &&
          Math.abs(prev.blue - next.blue) < 0.5
            ? prev
            : next
        );
        observeOnce(redOutlet);
        observeOnce(blueOutlet);
      }

      const socket = document.querySelector<HTMLElement>(
        "[data-cable-socket-row]"
      );
      if (!socket) return;
      observeOnce(socket);

      const scrollY = window.scrollY;
      const coreBottom = core.getBoundingClientRect().bottom + scrollY;
      const socketRect = socket.getBoundingClientRect();
      const socketCenter = socketRect.top + scrollY + socketRect.height * 0.5;
      const seated =
        socketCenter + cableLayout.widthPx * PLUG_INSERTION_RATIO;

      const gapPx = seated - coreBottom;
      const units = (gapPx / stickyHeight) * CABLE_VIEWBOX.height;
      const next = CABLE_VIEWBOX.height + Math.max(20, units);

      setCableEndY((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
    };

    const ro = new ResizeObserver(measure);

    measure();
    const raf = requestAnimationFrame(measure);
    const t1 = window.setTimeout(measure, 300);
    const t2 = window.setTimeout(measure, 1200);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    let cancelled = false;
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) requestAnimationFrame(measure);
      });
    }

    observeOnce(document.body);
    observeOnce(coreRef.current);
    observeOnce(stickyRef.current);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      ro.disconnect();
    };
  }, [cableLayout]);


  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("background-section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const totalScrollDistance = section.offsetHeight - window.innerHeight;
      if (totalScrollDistance <= 0) return;
      const totalProgress = Math.min(1, Math.max(0, -rect.top / totalScrollDistance));

      const introRatio = introHeight / coreHeight;
      const contentRatio = contentHeight / coreHeight;

      if (totalProgress < introRatio) {
        const progress = totalProgress / introRatio;
        setIntroProgress(Math.min(1, Math.max(0, progress)));
        setActiveIndex(0);
        setExtendProgress(0);
        return;
      }
      setIntroProgress(1);

      if (totalProgress < introRatio + contentRatio) {
        const backgroundProgress = (totalProgress - introRatio) / contentRatio;
        const index = Math.min(totalPoints - 1, Math.floor(backgroundProgress * totalPoints));
        setActiveIndex(index);
        setExtendProgress(0);
        return;
      }

      setActiveIndex(totalPoints - 1);
      const extensionRatio = 1 - introRatio - contentRatio;
      const extProgress =
        extensionRatio > 0 ? (totalProgress - introRatio - contentRatio) / extensionRatio : 1;
      setExtendProgress(Math.min(1, Math.max(0, extProgress)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      const grid = gridRef.current;
      const sticky = stickyRef.current;
      if (!grid || !sticky) return;
      if (window.innerWidth < 1024) {
        setTextPadTop(0);
        return;
      }
      const gridTop = grid.getBoundingClientRect().top - sticky.getBoundingClientRect().top;
      const cableClearance = sticky.getBoundingClientRect().height * 0.34 + 28;
      setTextPadTop(Math.max(0, cableClearance - gridTop));
    };
    updateTextPadRef.current = update;
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    const align = () => {
      const grid = gridRef.current;
      const text = textRef.current;
      if (!grid || !text) return;
      if (window.innerWidth < 1024) {
        setLeftPadTop(0);
        return;
      }
      setLeftPadTop(Math.max(0, text.getBoundingClientRect().top - grid.getBoundingClientRect().top));
    };
    updateLeftPadRef.current = align;
    const raf = requestAnimationFrame(align);
    window.addEventListener("resize", align);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", align);
    };
  }, [textPadTop, activeIndex]);

  const handlePointsAnimComplete = () => {
    updateTextPadRef.current?.();
    updateLeftPadRef.current?.();
  };

  useEffect(() => {
    const grid = gridRef.current;
    const text = textRef.current;
    if (!grid || !text) return;
    const ro = new ResizeObserver(() => {
      updateTextPadRef.current?.();
      updateLeftPadRef.current?.();
    });
    ro.observe(grid);
    ro.observe(text);
    return () => ro.disconnect();
  }, []);

  const activeItem = backgroundItems[activeIndex];

  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const bgWipe = easeInOut(clamp01(introProgress / 0.4));
  const cableDraw = clamp01((introProgress - 0.44) / 0.44);
  const titleVisible = introProgress >= 0.46;
  const pointsVisible = introProgress >= 0.9;

   return (
    <section 
      id="background-section" 
      className="relative z-10 w-full bg-white" 
      style={{ minHeight: `${coreHeight + endHeight}vh` }}
    >
      <div ref={coreRef} style={{ height: `${coreHeight}vh` }} className="relative">
        <div ref={stickyRef} className="sticky top-0 z-10 flex min-h-screen w-full overflow-visible bg-[#111111]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-0 bg-white"
            style={{
              height: `${bgWipe * 100}%`,
              transition: "height 420ms cubic-bezier(0.22, 1, 0.36, 1)",
              willChange: "height",
            }}
          />
          <div className="absolute inset-0 mx-auto w-full max-w-[1600px]">
            <BackgroundCable
              draw={cableDraw}
              extend={extendProgress}
              endY={cableEndY}
              startX={cableStartX}
            />
          </div>
          <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-10 sm:px-14 md:px-24 lg:px-20 ">          
            <motion.div
              className="relative z-30 pt-4"
              initial={false}
              animate={{ opacity: titleVisible ? 1 : 0, y: titleVisible ? 0 : 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className={`${jockeyOneRegular.className} text-[2.5rem] leading-[0.85] tracking-[-0.03em] text-black sm:text-[3rem] md:text-[4rem] lg:text-[8rem]`}>Background</h2>
            </motion.div>
            <motion.div
              className="relative z-20 flex w-full flex-1 flex-col pb-4"
              initial={false}
              animate={{ opacity: pointsVisible ? 1 : 0, y: pointsVisible ? 0 : 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ pointerEvents: pointsVisible ? "auto" : "none" }}
              onAnimationComplete={handlePointsAnimComplete}
            >
              <div className="mb-1 mt-1 flex shrink-0 items-center lg:mb-3 lg:mt-2" />            
              <div ref={gridRef} className="mt-1 grid min-h-0 grid-cols-1 gap-2 lg:mt-4 lg:gap-10 lg:grid-cols-[0.85fr_1.6fr]">              
                <div className="flex flex-col items-start" style={{ paddingTop: leftPadTop }}>
                  <div className="flex items-baseline gap-4 mt-1">
                    <AnimatePresence mode="wait">
                      <motion.span key={activeItem.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={`${oswaldMedium.className} text-2xl font-bold leading-none text-[#8f2525] md:text-3xl`}>{activeItem.id}.</motion.span>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      <motion.span key={activeItem.step} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className={`${oswaldMedium.className} text-base text-black/60 md:text-2xl`}>{activeItem.step}</motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="mt-6 overflow-hidden lg:mt-10">
                    <AnimatePresence mode="wait">
                      <motion.h3 key={activeItem.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className={`${jockeyOneRegular.className} max-w-[430px] text-[1.75rem] leading-[0.95] tracking-[-0.02em] whitespace-pre-line text-black sm:text-[2.25rem] md:text-[2.75rem] lg:text-[5rem]`}>{activeItem.title}</motion.h3>
                    </AnimatePresence>
                    <motion.div className="mt-5 h-[4px] bg-[#8f2525]" animate={{ width: 80 }} />
                  </div>
                </div>
                <div className="flex items-center" style={{ paddingTop: textPadTop }}>
                  <div ref={textRef} className="overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p key={activeItem.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className={`${poppinsRegular.className} max-w-[790px] text-sm leading-[1.4] text-black/70 sm:text-base sm:leading-[1.5] md:leading-[1.6] lg:text-lg lg:leading-[1.9]`}>{renderWithCitationHighlight(activeItem.text)}</motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div 
        className="relative w-full bg-white" 
        style={{ height: `${endHeight}vh` }} 
        aria-hidden="true"
      />
    </section>
  );
}