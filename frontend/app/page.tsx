import Navbar from "@/components/ui/layout/navbar";
import Image from "next/image";
import VinylPlayer from "@/components/vinylPlayer";
import { jockeyOneRegular, oswaldMedium } from "./layout";
import { poppinsRegular } from "./layout";
import { poppinsMedium } from "./layout";
import { poppinsExtraLightItalic } from "./layout";

export default function Home() {
  return (
    <div className="relative">
      <Navbar/>
        <div className="relative z-20 border-2 border-black mt-3 md:mt-4 rounded-2xl w-fit mx-4 md:mx-8 bg-[#F5F5F5] px-2 md:px-4">
          <h1 className={`${jockeyOneRegular.className} text-4xl sm:text-5xl md:text-6xl lg:text-8xl p-2 md:p-3`}>Theme Classification</h1>
        </div>
        <div className="relative z-20 border-2 border-black mt-3 md:mt-4 rounded-2xl w-fit mx-4 md:mx-8 bg-[#F5F5F5] px-2 md:px-4">
          <h1 className={`${jockeyOneRegular.className} text-4xl sm:text-5xl md:text-6xl lg:text-8xl p-2 md:p-3`}>Song Lyrics with IndoBERT</h1>
        </div>

        <VinylPlayer className="relative mt-6 mx-auto lg:absolute lg:right-8 lg:top-4 z-0"/>

        <div className="mt-4 max-w-[850px] mx-4 md:mx-10">
          <h1 className={`${poppinsRegular.className} text-2xl p-3`}>The method for classifying theme songs into well-known popular themes is based on listeners' search behavior</h1>
        </div>
        <div className="mt-5 mx-4 md:mx-10 w-fit items-center sm:flex-row  sm:items-center gap-4 sm:pl-3">
          <h1 className={`${oswaldMedium.className} text-3xl font-bold sm:text-left pl-0`}>
            Dont Forget to Try
          </h1>
          <div className="rounded-4xl bg-black text-white py-1 px-3 sm:mx-2 text-center cursor-pointer border-black hover:bg-red-500 hover:transition-all hover:text-white hover:shadow-lg">
            <button className={`${poppinsMedium.className} text-2xl font-bold p-3 cursor-pointer`}>Start Now</button>
          </div>
        </div>
        <div className="flex items-end mx-10 gap-2">
          <div className="flex flex-col items-center">
            <div className={`${poppinsExtraLightItalic.className} pt-4 pb-1 text-sm md:text-xl`}>For Educational Purpose</div>
            <div className="border-4 rounded-xl border-black w-fit">
              <div className={`${oswaldMedium.className} text-3xl p-2`}>
                Thanks For Watchout
              </div>
            </div>
          </div>

          <Image
            src="/likeTheme.svg"
            alt="Like Theme Logo"
            width={30}
            height={30}
          />
        </div>
    </div>
  );
}