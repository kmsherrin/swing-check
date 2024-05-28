"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { useRouter } from "next/navigation";

import { signIn, useSession } from "next-auth/react";
import { useEffect, type ReactNode } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// import { ModalProvider } from "@/components/modal/provider";

// const fetchUserLocation = async () => {
//   try {
//     const response = await fetch("https://ipapi.co/json/");
//     const data = await response.json();
//     return data.country_code;
//   } catch (error) {
//     console.error("Error fetching location:", error);
//     return null;
//   }
// };

export default function GuestSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { status, update, data } = useSession();
  useEffect(() => {
    console.log(status);
    console.log(data);

    if (status === "unauthenticated") {
      // login as anonymous
      signIn("credentials", {})
        .then(async () => {
          await update();
          /* do nothing */
          console.info("Logged in as anonymous");
        })
        .catch((error) => {
          console.error("Failed to login as anonymous", error);
        });
    }
  }, [status]);

  return <>{children}</>;
}

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <GuestSessionProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster className="dark:hidden" />
              <Toaster theme="dark" className="hidden dark:block" />
              {children}
              {/* <ModalProvider>{children}</ModalProvider> */}
            </TooltipProvider>
          </QueryClientProvider>
        </GuestSessionProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
