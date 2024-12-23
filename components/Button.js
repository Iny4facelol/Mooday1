import { Fugaz_One } from "next/font/google";

const fugaz = Fugaz_One({
  weight: ["400"],
  variable: "--font-fugaz_one",
  subsets: ["latin"],
});

export default function Button({ text, dark, full, clickHandler }) {
  return (
    <button
      onClick={clickHandler}
      className={
        "rounded-full hover:opacity-60 overflow-hidden border-2 border-solid border-indigo-600 " +
        (dark ? "text-white bg-indigo-600 " : "text-indigo-600 ") +
        (full ? "grid place-items-center w-full" : "")
      }
    >
      <p
        className={
          "px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3 " + fugaz.className
        }
      >
        {text}
      </p>
    </button>
  );
}
