import { Fugaz_One } from "next/font/google";
import React from "react";
import Calendar from "./Calendar";
import CallToAction from "./CallToAction";

const fugaz = Fugaz_One({
  weight: ["400"],
  variable: "--font-fugaz_one",
  subsets: ["latin"],
});

export default function Hero() {
  return (
    <div className="py-4 md:py-12 flex flex-col gap-8 sm:gap-10">
      <h2
        className={
          "text-5xl sm:text-6xl md:text-7xl text-center " + fugaz.className
        }
      >
        <span className="textGradient">Mooday</span> helps you track your{" "}
        <span className="textGradient">daily</span> mood!
      </h2>
      <p className="text-lg sm:text-xl md:text-3xl text-center w-full mx-auto max-w-[800px]">
        Create your mood record and see how you feel on{" "}
        <span className="font-semibold">every day of every year</span>
      </p>
      <CallToAction />
      <Calendar demo />
    </div>
  );
}
