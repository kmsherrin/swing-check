"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export const SignoutButton = () => {
  return (
    <Button
      variant={"secondary"}
      onClick={() => signOut}
      className="h-[22  px] w-full"
    >
      Sign out
    </Button>
  );
};
