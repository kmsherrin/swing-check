import type { Metadata } from "next";
import { Inter, Poppins, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

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
            <Script>
              {`
                <!-- Facebook Pixel Code -->
                  <script>
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '{your-pixel-id-goes-here}');
                    fbq('track', 'PageView');
                  </script>
                  <noscript>
                    <img height="1" width="1" style="display:none" 
                        src="https://www.facebook.com/tr?id=1257494181782435&ev=PageView&noscript=1"/>
                  </noscript>
                  <!-- End Facebook Pixel Code -->
                `}
            </Script>

            <Footer />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
