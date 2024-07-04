import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/lib/drizzle";
import { userMetadata, users } from "@/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentHandlerModal } from "@/components/custom_ui/payment_handler_modal";
import { Metadata } from "next";

async function getData() {
  "use server";

  const currentSession = await getSession();

  console.log(currentSession);

  if (!currentSession?.user) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("You must be logged in to view this page");
  }

  const { user } = currentSession;

  // use drizzle to get the user data
  const userData = await db
    .select()
    .from(users)
    .leftJoin(userMetadata, eq(userMetadata.userId, user.id))
    .where(eq(users.id, user.id));

  return userData[0];
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export const metadata: Metadata = {
  title: "Swing Check | Credits",
  description:
    "Get your swing dynamically analyzed with AI, receive feedback instantly and improve your game.",
  icons: {
    icon: "/swing-check-logo.ico",
  },
};

export default async function Credits() {
  // get the search params

  const userData = await getData();

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>

      <PaymentHandlerModal />

      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="/account/videos" className="">
            Your Videos
          </Link>
          <Link href="/account/credits" className="font-semibold text-primary">
            Credits
          </Link>
        </nav>
        <div className="grid gap-6">
          <h1 className="text-4xl font-semibold">Credits </h1>
          <p>Hi, {userData?.user?.name}</p>
          <p>
            You currently have <b>{userData?.user_metadata?.credits}</b>{" "}
            credits.
          </p>
          <div>
            <div className="flex flex-col xl:flex-row gap-4">
              <form
                method="POST"
                action="/api/stripe/checkout/"
                className="w-full"
              >
                <input type="hidden" name="creditAmount" value="sub" />
                <Button type="submit" className="px-8 md:px-40 w-full">
                  Subscribe
                </Button>
              </form>
              <form
                method="POST"
                action="/api/stripe/checkout/"
                className="w-full"
              >
                <input type="hidden" name="creditAmount" value="5" />
                <Button type="submit" className="px-8 md:px-40 w-full">
                  Purchase 5 credits for $2
                </Button>
              </form>
              <form
                method="POST"
                action="/api/stripe/checkout/"
                className="w-full"
              >
                <input type="hidden" name="creditAmount" value="20" />
                <Button type="submit" className="px-8 md:px-40 w-full">
                  Purchase 20 credits for $5
                </Button>
              </form>
            </div>
            <p className="max-w-[600px] text-gray-500 text-sm dark:text-gray-400">
              Payments are processed securely by Stripe. You will be taken to
              Stripe to complete payment.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
