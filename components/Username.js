"use client";

import { useAuth } from "@/context/AuthContext";
import { Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import Button from "./Button";
import { Fugaz_One, Open_Sans } from "next/font/google";

const fugaz = Fugaz_One({
  weight: ["400"],
  variable: "--font-fugaz_one",
  subsets: ["latin"],
});

const opensans = Open_Sans({
  weight: ["400"],
  subsets: ["latin"],
});

export function UserModal({ setOpenModal, openModal }) {
  const { updateUserDisplayName } = useAuth();
  const [name, setName] = useState("");


  return (
    <>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3
              className={"text-xl font-medium textGradient " + fugaz.className}
            >
              Want to change your display name?
            </h3>
            <div>
              <input
                onChange={(e) => setName(e.target.value)}
                className={"w-full text-lg font-semibold rounded-3xl p-2 border-2 border-indigo-400 focus:ring-0 focus:outline-none focus:border-indigo-600 focus-visible:outline-none " + opensans.className }
                id="name"
                placeholder="Your desired name"
                required
              />
            </div>
            <div className="flex gap-2 justify-center items-center">
              <Button
                text="Accept"
                clickHandler={() => {
                  console.log("NOMBRE",name);
                  updateUserDisplayName(name);
                  setOpenModal(false);
                }}
              />
              <Button text="Cancel" clickHandler={() => setOpenModal(false)} />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
