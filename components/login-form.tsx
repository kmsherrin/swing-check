"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

      if (status === "authenticated" && session?.data?.user?.guest === false) {
        // Redirect to the dashboard
        window.location.href = "/account";
      }
    }
  }, [session]);

  console.log(session);

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Select an authentication method below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button
            variant="outline"
            className="w-full flex gap-2"
            onClick={() => signIn("google")}
          >
            <FaGoogle />
            <span>Login with Google</span>
          </Button>

        </div>
        {/*
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
        */}
      </CardContent>
    </Card>
  );
}
