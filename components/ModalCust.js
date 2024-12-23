"use client";
import { Modal } from "flowbite-react";
import Button from "./Button";
import { Fugaz_One } from "next/font/google";

const fugaz = Fugaz_One({
  weight: ["400"],
  variable: "--font-fugaz_one",
  subsets: ["latin"],
});

export function ModalCust({ setOpenModal, openModal, comment }) {
  

  return (
    <>
      <Modal
        className="bg-indigo-400/[.01]"
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header className={"textGradient " + fugaz.className}>
          Your Comment on How You Felt This Day
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p
              className={
                "text-base leading-relaxed text-gray-500 dark:text-gray-400 " +
                fugaz.className
              }
            >
              {comment}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            text="Okay, I remember now"
            clickHandler={() => setOpenModal(false)}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}
