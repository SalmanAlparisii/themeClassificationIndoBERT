import Navbar from "@/components/ui/layout/navbar";
import Image from "next/image";
import { jockeyOneRegular, oswaldMedium } from "./layout";
import { poppinsRegular } from "./layout";
import { poppinsMedium } from "./layout";
import { poppinsExtraLightItalic } from "./layout";

export default function Home() {
  return (
    <div>
      <Navbar/>
        <div className="border-2 border-black mt-4 rounded-2xl w-fit mx-8 bg-[#F5F5F5] px-4">
          <h1 className={`${jockeyOneRegular.className} text-8xl p-3`}>Theme Classification</h1>
        </div>
        <div className="border-2 border-black mt-4 rounded-2xl w-fit mx-8 bg-[#F5F5F5] px-4">
          <h1 className={`${jockeyOneRegular.className} text-8xl p-3`}>Song Lyrics with IndoBERT</h1>
        </div>
        <div className="mt-4 max-w-[850px] mx-10">
          <h1 className={`${poppinsRegular.className} text-2xl p-3`}>The method for classifying theme songs into well-known popular themes is based on listeners' search behavior</h1>
        </div>
        <div className="mt-4 mx-10 flex-col justify-center w-fit">
          <h1 className={`${oswaldMedium.className} text-3xl font-bold pl-3`}>Dont Forget to Try</h1>
            <div className="mt-4 rounded-4xl bg-black text-white py-1 px-3 mx-2 text-center cursor-pointer border-black hover:bg-red-500 hover:transition-all hover:text-white hover:shadow-lg">
              <button className={`${poppinsMedium.className} text-2xl font-bold p-3 cursor-pointer`}>Start Now</button>
            </div>
        </div>
        <div className="mt-4 max-w-[850px] mx-10">
          <div className={`${poppinsExtraLightItalic.className} text-xl pl-3 pt-3 pr-3 pb-1`}>For Educational Purpose</div>
        </div>
        <div className="flex items-end mx-10">
      <div className="border-4 rounded-xl border-black w-fit">
        <div className={`${oswaldMedium.className} text-3xl p-2`}>
          Thanks For Watchout
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

