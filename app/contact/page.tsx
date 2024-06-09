import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swing Check | Contact Us",
  description: "Question, query, problem? Get in touch with us.",
};

export default async function Contact() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <section className="w-full min-h-screen py-12 bg-gradient-to-tr from-muted to-card">
        <div className="container px-4 md:px-6 max-w-3xl">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Contact
            </h1>
            <p>
              Question, query, problem? Get in touch with us. Email us at
              shot.check.app@gmail.com (yes, we are still working on a proper
              support email)
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
