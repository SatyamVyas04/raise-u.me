"use client";
import { useEffect } from "react";
import gsap from "gsap";

export default function Page() {
  useEffect(() => {
    const button = document.getElementById("uploadButton");

    if (button) {
      button.addEventListener("click", () => {
        gsap.to(button, { scale: 1.5, duration: 1, ease: "power2.out" });
        gsap.to(button, { scale: 1, duration: 1, delay: 0, ease: "power2.in" });
      });
    }
    
    // Clean up event listener on unmount
    return () => {
      if (button) {
        button.removeEventListener("click", () => {});
      }
    };
  }, []);

  return (
    <div className="bg-[#2a093800] h-screen w-full flex justify-center items-center">
      <div className="flex flex-col items-center">
        <p className="text-white text-6xl text-center">Resume Builder</p>
        <input
          className="bg-white text-black h-10 w-80 sm:w-96 mt-10 placeholder:text-lg placeholder:font-serif rounded-lg text-center"
          placeholder="Enter job description"
        />
        <p className="text-white mt-5 text-lg text-center">--- OR ---</p>
        <button
          id="uploadButton"
          className="bg-white text-black h-10 w-80 sm:w-96 mt-8 hover:border-4 transform active:scale-110 transition-transform duration-200 hover:border-blue-700"
        >
          Upload job description file
        </button>
      </div>
    </div>
  );
}
