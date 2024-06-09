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
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
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
  const userData = await db.select().from(users).where(eq(users.id, user.id));

  return userData[0];
}

export const metadata: Metadata = {
  title: "Swing Check | Account",
  description:
    "Get your swing dynamically analyzed with AI, receive feedback instantly and improve your game.",
  icons: {
    icon: "/swing-check-logo.ico",
  },
};

export default async function Account() {
  const userData = await getData();
  console.log(userData);

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="/account/videos" className="">
            Your Videos
          </Link>
          <Link href="/account/credits">Credits</Link>
        </nav>
        <div className="grid gap-6">
          <p>Hi, {userData?.name}</p>

          <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/account/videos">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Your Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Find your previous analyzed videos here.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/account/credits">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Purchase and add credits to your account, allowing you to
                    analyze more videos.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
