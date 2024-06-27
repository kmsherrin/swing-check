"use client";

import { FaFacebook, FaGoogle } from "react-icons/fa6";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

export const FacebookLoginButton = () => {
  return (
    <Button
      variant="outline"
      className="w-full flex gap-2"
      onClick={() => signIn("facebook")}
    >
      <FaFacebook />
      <span>Continue with Facebook</span>
    </Button>
  );
};
