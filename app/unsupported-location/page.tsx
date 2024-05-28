import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Unsupported Location",
  description: "Sorry, this service not available in your area.",
};

export default function UnsupportedLocation() {
  return (
    <main className="flex p-8 min-h-screen flex-col items-center justify-start md:p-24 gap-4 text-center">
      <Image src="/ICON_SAD.png" width={300} height={300} alt="Logo" />
      <h1 className="text-xl font-semibold">
        Sorry, this service not available in your area.
      </h1>
      <p>
        Please{" "}
        <Link className="text-primary" href="/contact">
          get in contact
        </Link>{" "}
        if you believe you are seeing this message in error.
      </p>
    </main>
  );
}
