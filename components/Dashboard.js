"use client";
import { Fugaz_One } from "next/font/google";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Loading from "./Loading";
import Login from "./Login";
import Button from "./Button";

const fugaz = Fugaz_One({
  weight: ["400"],
  variable: "--font-fugaz_one",
  subsets: ["latin"],
});

export default function Dashboard() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [comment, setComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState({});
  const now = new Date();

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleMoodSelect = (moodValue) => {
    setSelectedMood(moodValue);
  };

  const handleSubmit = async () => {
    if (selectedMood === null) {
      setErrorMsg("Select a mood before saving");
      return;
    }
    await handleSetMood(selectedMood, comment);
    setComment("");
    setSelectedMood(null);
  };

  function countValues() {
    let total_number_of_days = 0;
    let sum_moods = 0;
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          const dayData = data[year][month][day];
          const mood = typeof dayData === "object" ? dayData.mood : dayData;

          if (typeof mood === "number") {
            total_number_of_days++;
            sum_moods += mood;
          }
        }
      }
    }
    return {
      num_days: total_number_of_days,
      average_mood:
        total_number_of_days > 0
          ? (sum_moods / total_number_of_days).toFixed(2)
          : 0,
    };
  }

  const statuses = {
    ...countValues(),
    time_remaining: `${23 - now.getHours().toString().padStart(2, "0")}H ${
      60 - now.getMinutes().toString().padStart(2, "0")
    }M`,
  };

  async function handleSetMood(mood, comment = "") {
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    try {
      const newData = { ...userDataObj };
      if (!newData?.[year]) {
        newData[year] = {};
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }

      newData[year][month][day] = {
        mood,
        comment: comment || "",
      };

      // update the current state
      setData(newData);
      // update the global state
      setUserDataObj(newData);

      const docRef = doc(db, "users", currentUser.uid);
      const res = await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: {
                mood: mood,
                comment: comment || "",
              },
            },
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.log("Failed to set data: ", err.message);
    }
  }

  const moods = {
    "&-*@#$": "😭",
    Sad: "😢",
    Existing: "😶",
    Good: "😃",
    Elated: "😍",
  };

  useEffect(() => {
    if (!currentUser || !userDataObj) {
      return;
    }
    setData(userDataObj);
  }, [currentUser, userDataObj]);

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="grid grid-cols-3 sm:grid-cols-3 bg-indigo-50 text-indigo-500 rounded-lg gap-4 p-2 ">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div
              className=" flex flex-col gap-1 sm:gap-2 justify-normal sm:justify-center items-start sm:items-center"
              key={statusIndex}
            >
              <p className="font-medium capitalize text-xs sm:text-sm truncate">
                {status.replaceAll("_", " ")}
              </p>
              <p className={"text-base sm:text-lg " + fugaz.className}>
                {statuses[status]}
                {status === "num_days" ? " 🔥" : ""}
                {status === "num_days" > 10 ? "🔥" : ""}
              </p>
            </div>
          );
        })}
      </div>
      <h4
        className={
          "text-5xl sm:text-6xl md:text-7xl text-center " + fugaz.className
        }
      >
        How do you <span className="textGradient">feel</span> today?
      </h4>
      <div className="flex items-stretch flex-wrap gap-4">
        {Object.keys(moods).map((mood, moodIndex) => {
          const currentMoodValue = moodIndex + 1;
          return (
            <button
              onClick={() => {
                handleMoodSelect(currentMoodValue);
                setErrorMsg("");
              }}
              className={`p-4 px-5 rounded-2xl purpleShadow duration-200 
                ${
                  selectedMood === currentMoodValue
                    ? "bg-indigo-200 ring-2 ring-indigo-500"
                    : "bg-indigo-50 hover:bg-[lavender]"
                } 
                text-center flex flex-col gap-2 flex-1 items-center`}
              key={moodIndex}
            >
              <p className="text-4xl sm:text-5xl md:text-6xl mb-4">
                {moods[mood]}
              </p>
              <p
                className={
                  "text-indigo-500 text-xs sm:text-sm md:text-base " +
                  fugaz.className
                }
              >
                {mood}
              </p>
            </button>
          );
        })}
      </div>
      <Calendar completeData={data} />
      <div className="w-full flex flex-col items-center justiy-center sm:items-start mt-4 space-y-4">
        <textarea
          className="w-full p-2 border-2 border-indigo-400 focus:ring-0 focus:outline-none focus:border-indigo-600 focus:border-2 rounded-lg"
          placeholder="Would you like to describe how you felt on this day? (Optional)"
          value={comment}
          onChange={handleCommentChange}
        />
        <Button
          text={selectedMood ? "Save" : "Select Your Mood First"}
          clickHandler={handleSubmit}
          disabled={selectedMood === null}
        />
        {errorMsg ? (
          <p className={"text-red-500 font-semibold " + fugaz.className}>
            {errorMsg}
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
