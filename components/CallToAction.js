"use client";

import Link from "next/link";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";

export default function CallToAction() {
  const { currentUser } = useAuth();
  if (currentUser) {
    return (
      <div className="max-w-[600px] mx-auto w-full">
        <Link href={"/dashboard"}>
          <Button text="Go to dashboard" full dark />
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 w-fit mx-auto">
      <Link href={"/dashboard"}>
        <Button text="Sign up" />
      </Link>
      <Link href={"/dashboard"}>
        <Button text="Login" dark />
      </Link>
    </div>
  );
}