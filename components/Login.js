"use client";
import { Fugaz_One } from "next/font/google";
import React, { useState } from "react";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";

const fugaz = Fugaz_One({
  weight: ["400"],
  variable: "--font-fugaz_one",
  subsets: ["latin"],
});

export default function Login() {
  const { signUp, login } = useAuth();
  const [showNameInput, setShowNameInput] = useState(true);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const onSubmit = async () => {
    if (!email || !password || password.length < 6 ) {
      return;
    }
    setAuthenticating(true);
    try {
      if (isRegister) {
        console.log("Signing up a new user");
        await signUp(email, password);
      } else {
        console.log("Logging in existing user");
        await login(email, password);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setShowNameInput(false)
      setAuthenticating(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-4">
      <h3 className={"text-4xl sm:text-5xl md:text-6xl " + fugaz.className}>
        {isRegister ? "Register" : "Log In"}
      </h3>
      <p>You&#39;re one step away!</p>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="w-full max-w-[400px] mx-auto px-3 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none duration-200 hover:border-indigo-600 focus:border-indigo-600"
        type="email"
        placeholder="Email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full max-w-[400px] mx-auto px-3 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none duration-200 hover:border-indigo-600 focus:border-indigo-600"
        type="password"
        placeholder="Password"
      />
      <div className="max-w-[400px] w-full mx-auto">
        <Button
          clickHandler={onSubmit}
          text={authenticating ? "Submitting" : "Submit"}
          full
        />
      </div>
      <p className="text-center">
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-indigo-600"
        >
          {isRegister ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}
