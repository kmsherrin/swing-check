"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signIn, useSession } from "next-auth/react";

import { FaGoogle } from "react-icons/fa6";
import { FaApple } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { toast } from "sonner";
import { GoogleLoginButton } from "./custom_ui/google-login-button";
import { FacebookLoginButton } from "./custom_ui/facebook-login-button";

export function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  const session = useSession();

  console.log(session?.data?.user);

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  useEffect(() => {
    if (session) {
      const { status } = session;

      if (status === "authenticated") {
        // Redirect to the dashboard
        window.location.href = "/account";
      }
    }
  }, [session]);

  console.log(session);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Create an account to start your video analysis!
          </CardDescription>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col gap-2 w-full">
            <GoogleLoginButton />
            <FacebookLoginButton />
          </div>
        </CardFooter>
      </Card>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        By creating an account you agree to the{" "}
        <Link href="/tos" className="text-primary">
          Swing Check Terms of Service
        </Link>
        .
      </p>
    </>
  );
}
