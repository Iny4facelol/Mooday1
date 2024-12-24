"use client";
import React, { useState } from "react";
import { gradients, baseRating } from "@/utils";
import ChevronLeft from "./Icons/ChevronLeft";
import ChevronRight from "./Icons/ChevronRight";
import { Fugaz_One } from "next/font/google";

import { ModalCust } from "./ModalCust";
const months = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sept",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

const fugaz = Fugaz_One({
  weight: ["400"],
  variable: "--font-fugaz_one",
  subsets: ["latin"],
});

const monthsArr = Object.keys(months);

const now = new Date();

const dayList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export default function Calendar({ demo, completeData }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState(null);
  const now = new Date();
  const currMonth = now.getMonth();
  const [selectedMonth, setSelectedMonth] = useState(
    Object.keys(months)[currMonth]
  );
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const numericMonth = monthsArr.indexOf(selectedMonth);
  const data = completeData?.[selectedYear]?.[numericMonth] || {};

  console.log(data);

  const handleDayClick = (dayData) => {
    if (dayData?.comment) {
      setSelectedDayData(dayData);
      setOpenModal(true);
    }
  };

  function handleIncrementMonth(val) {
    // value +1 -1
    // if we hit the bounds of the months, then we can just adjust the year that is displayed instead
    if (numericMonth + val < 0) {
      // set month value = 11 and decrement the year
      setSelectedYear((curr) => curr - 1);
      setSelectedMonth(monthsArr[monthsArr.length - 1]);
    } else if (numericMonth + val > 11) {
      // set month val = 0 and increment the year
      setSelectedYear((curr) => curr + 1);
      setSelectedMonth(monthsArr[0]);
    } else {
      setSelectedMonth(monthsArr[numericMonth + val]);
    }
  }

  // const year = 2024;
  // const month = "November";
  const monthNow = new Date(
    selectedYear,
    Object.keys(months).indexOf(selectedMonth),
    1
  );
  const firstDayOfMonth = monthNow.getDay();
  const daysInMonth = new Date(
    selectedYear,
    Object.keys(selectedMonth).indexOf(selectedMonth) + 1,
    0
  ).getDate();

  const getEmojiForDay = (dayData) => {
    const rating = dayData?.mood || dayData;

    switch (rating) {
      case 1:
        return "😭";
      case 2:
        return "😥";
      case 3:
        return "😶";
      case 4:
        return "😃";
      case 5:
        return "😍";
      default:
        return "";
    }
  };

  const getMoodValue = (dayData) => {
    return dayData?.mood || dayData;
  };

  const daysToDisplay = firstDayOfMonth + daysInMonth;
  const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => handleIncrementMonth(-1)}
          className="mr-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:opacity-60"
        >
          <ChevronLeft />
        </button>
        <p className={"text-center capitalize textGradient " + fugaz.className}>
          {selectedMonth}, {selectedYear}
        </p>
        <button
          onClick={() => handleIncrementMonth(+1)}
          className="ml-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:opacity-60"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10">
        {[...Array(numRows).keys()].map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="grid grid-cols-7 gap-1">
              {dayList.map((dayOfWeek, dayOfWeekOfIndex) => {
                let dayIndex =
                  rowIndex * 7 + dayOfWeekOfIndex - (firstDayOfMonth - 1);
                let dayDisplay =
                  dayIndex > daysInMonth
                    ? false
                    : row === 0 && dayOfWeekOfIndex < firstDayOfMonth
                    ? false
                    : true;
                let isToday = dayIndex === now.getDate();

                if (!dayDisplay) {
                  return <div className="bg-white" key={dayOfWeekOfIndex} />;
                }

                const dayData = data[dayIndex];
                let color = demo
                  ? gradients.indigo[baseRating[dayIndex]]
                  : dayIndex in data
                  ? gradients.indigo[getMoodValue(dayData)]
                  : "white";

                return (
                  <div
                    style={{ background: color }}
                    className={
                      "text-xs sm:text-sm border border-solid p-2 px-4 flex items-center justify-center gap-1 sm:gap-2 rounded-lg w-full " +
                      (isToday
                        ? "border-indigo-400 first-letter: "
                        : "border-indigo-100 ") +
                      (color === "white" ? "text-indigo-400" : "text-white") +
                      (dayData?.comment ? " cursor-pointer" : "")
                    }
                    key={dayOfWeekOfIndex}
                    onClick={() => handleDayClick(dayData)}
                  >
                    <p className="font-semibold">{dayIndex}</p>
                    <p>
                      {getEmojiForDay(dayData)}{" "}
                      {dayData?.comment && <span className="text-xs">💭</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <ModalCust
        setOpenModal={setOpenModal}
        openModal={openModal}
        comment={selectedDayData?.comment}
      />
    </div>
  );
}
