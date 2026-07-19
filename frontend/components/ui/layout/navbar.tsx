"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { jockeyOneRegular, ppEditorialNew } from "@/app/layout";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menus = ["Dashboard", "Background", "Research", "Dataset", "Methodology", "Result", "Try Model"];

  return (
    <header className="relative bg-white rounded-xl mx-4 md:mx-8 my-2">
      <div className={`flex items-center h-[60px] lg:justify-start justify-between w-full ${jockeyOneRegular.className}`}>
        <div className="flex items-center flex-shrink-0">
          <Image src="/likeTheme.svg" alt="Like Theme Logo" width={80} height={80} />
          <h1 className={`-ml-3 text-3xl italic leading-none translate-y-[2px] ${ppEditorialNew.className}`}>LikeTheme</h1>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-2xl ml-12">
          {menus.map((menu) => (
            <a key={menu} href="#" className="hover:text-red-500 transition-colors">{menu}</a>
          ))}
        </nav>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden mx-4">
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {isOpen && (
        <nav className={`absolute top-full left-0 right-0 z-50 flex flex-col gap-1 bg-white border border-black/10 rounded-b-xl shadow-lg px-5 py-5 text-lg lg:hidden ${jockeyOneRegular.className}`}>
          {menus.map((menu) => (
            <div key={menu} className="group rounded-lg px-3 py-2 transition-shadow duration-200 hover:shadow-md active:shadow-md">
              <a href="#" className="transition-colors group-hover:text-red-500 group-active:text-red-500">{menu}</a>
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;