"use client";

import { useRouter } from "next/navigation";
import ContactForm from "./components/ContactForm";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <header className="flex justify-center py-8">
        <Image
          src={"/contact/logo.png"}
          width="64"
          height="64"
          alt="Logo"
          onClick={() => {
            router.back();
          }}
        />
      </header>
      <div className="flex flex-col items-center justify-center lg:pt-24">
        <h1 className="scroll-m-20 pb-12 text-center text-4xl font-extrabold tracking-tight text-balance">
          Formulaire de contact
        </h1>
        <ContactForm />
      </div>
    </>
  );
}
