"use client";
import React, { useState } from "react";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fugaz_One } from "next/font/google";
import { UserModal } from "./Username";

const fugaz = Fugaz_One({
  weight: ["400"],
  variable: "--font-fugaz_one",
  subsets: ["latin"],
});

export default function Logout() {
  const { logout, currentUser, tempDisplayName } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const pathname = usePathname();

  if (!currentUser) {
    return null;
  }

  if (pathname === "/") {
    return (
      <>
        <Link href={"/dashboard"}>
          <Button text="Go to dashboard" />
        </Link>
      </>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <UserModal setOpenModal={setOpenModal} openModal={openModal} />
      <p
        onClick={() => setOpenModal(true)}
        className={"text-base textGradient cursor-pointer " + fugaz.className}
      >
        {currentUser.displayName || currentUser.email}
      </p>

      <Button text="Logout" clickHandler={logout} />
    </div>
  );
}
