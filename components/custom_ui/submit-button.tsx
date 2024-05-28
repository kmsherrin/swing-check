"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { JSXElementConstructor } from "react";

export function SubmitButton({
  normalElement,
  pendingElement,
  additionalClasses,
}: {
  normalElement: string | React.ReactNode;
  pendingElement: string | React.ReactNode;
  additionalClasses?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={additionalClasses}>
      {pending ? pendingElement : normalElement}
    </Button>
  );
}
