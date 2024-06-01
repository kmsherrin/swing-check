import { AnalyseForm } from "@/components/analyze-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swing Check | Analyze",
  description:
    "Get your form dynamically analyzed with AI, receive feedback instantly and improve your game.",
  icons: {
    icon: "/swing-check-logo.ico",
  },
};

export default function Analyze() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen px-4 py-12 md:px-6 lg:px-8 bg-gradient-to-tr from-muted to-card">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-left">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Swing Analysis
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload a short video of your swing form and we'll analyze it for
            you. Try to keep yourself centered and well lit for the best
            results.
          </p>
          {/* <p className="mt-2 text-gray-600 dark:text-gray-400">
            A good video is key to getting the best feedback.
          </p> */}
        </div>

        <AnalyseForm />
      </div>
    </main>
  );
}
