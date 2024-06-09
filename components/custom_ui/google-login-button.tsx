"use client";

import { FaGoogle } from "react-icons/fa6";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

export const GoogleLoginButton = () => {
  return (
    <Button
      variant="outline"
      className="w-full flex gap-2"
      onClick={() => signIn("google")}
    >
      <FaGoogle />
      <span>Continue with Google</span>
    </Button>
  );
};
