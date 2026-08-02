import Navbar from "@/components/ui/layout/navbar";
import BackgroundSection from "@/components/backgroundSection";
import VinylPlayer from "@/components/vinylPlayer";
import { jockeyOneRegular, oswaldMedium } from "./layout";
import { poppinsRegular } from "./layout";
import { poppinsMedium } from "./layout";
import { poppinsExtraLightItalic } from "./layout";
import ResearchSection from "@/components/researchSection";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />

      <div className="relative z-20 border-2 border-black mt-3 md:mt-4 rounded-2xl w-fit mx-4 md:mx-8 bg-[#F5F5F5] px-2 md:px-4">
        <h1 className={`${jockeyOneRegular.className} text-3xl sm:text-5xl md:text-6xl lg:text-8xl p-2 md:p-3`}>
          Theme Classification
        </h1>
      </div>
      <div className="relative z-20 border-2 border-black mt-3 md:mt-4 rounded-2xl w-fit mx-4 md:mx-8 bg-[#F5F5F5] px-2 md:px-4">
        <h1 className={`${jockeyOneRegular.className} text-3xl sm:text-5xl md:text-6xl lg:text-8xl p-2 md:p-3`}>
          Song Lyrics with IndoBERT
        </h1>
      </div>

      <VinylPlayer className="relative mt-6 mx-auto lg:absolute lg:right-8 lg:top-4 z-0" />

      <div className="relative z-10 mt-4 max-w-[850px] lg:max-w-[550px] mx-4 md:mx-10">
        <h1 className={`${poppinsRegular.className} text-base sm:text-lg md:text-xl lg:text-2xl pb-3 pr-3 pt-3 text-center lg:text-left`}>
          The method for classifying theme songs into well-known popular themes is based on listeners&apos; search behavior
        </h1>
      </div>

      <div className="relative z-10 mt-3 mx-4 md:mx-10 lg:pr-[540px] flex flex-row lg:flex-col items-start justify-between lg:justify-start gap-3 lg:gap-2">
        <div className="flex flex-col items-center lg:gap-2">
          <h1 className={`${oswaldMedium.className} text-lg sm:text-2xl md:text-2xl lg:text-3xl font-bold text-center lg:mb-2`}>
            Dont Forget to Try
          </h1>
          <div className="rounded-3xl lg:rounded-4xl bg-black text-white text-center cursor-pointer border-black hover:bg-red-500 hover:transition-all hover:text-white hover:shadow-lg">
            <button className={`${jockeyOneRegular.className} text-base sm:text-xl md:text-xl lg:text-2xl font-bold px-4 py-1.5 lg:px-5 lg:py-3 cursor-pointer`}>
              Start Now
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className={`${poppinsExtraLightItalic.className} text-xs sm:text-lg md:text-base lg:text-lg`}>
            For Educational Purpose
          </div>
          <div className="relative w-fit">
            <div className="border-2 sm:border-4 rounded-xl border-black w-fit">
              <div className={`${oswaldMedium.className} text-base sm:text-lg md:text-lg lg:text-xl p-1.5 lg:p-2`}>
                Thanks For Watchout
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackgroundSection></BackgroundSection>
      <ResearchSection></ResearchSection>
    </div>
  );
}