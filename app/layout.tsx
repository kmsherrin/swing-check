import type { Metadata } from "next";
import { Inter, Poppins, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const work_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Swing Check",
  description:
    "Get your swing dynamically analyzed with AI, receive feedback instantly and improve your game.",
  icons: {
    icon: "/swing-check-logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={work_sans.className}>
        <Providers>
          <div className="flex min-h-screen w-full flex-col">
            <Navbar />

            {children}
            <GoogleAnalytics gaId="G-C9RTHY7JFJ" />

            <Footer />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
