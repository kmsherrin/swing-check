"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export const PaymentHandlerModal = () => {
  const queryClient = useQueryClient();

  const params = useSearchParams();
  const success = params.get("success");
  const cancelled = params.get("canceled");

  const [successModal, setSuccessModal] = useState(false);
  const [failedModal, setFailedModal] = useState(false);

  useEffect(() => {
    if (success === "true") {
      setSuccessModal(true);

      // get the fbq from the window object
      const fbq = window.fbq;
      if (fbq) {
        fbq("track", "Purchase", {});
      }

      // get the gtag from the window object
      const gtag = window.gtag;
      if (gtag) {
        gtag("event", "purchase", {
          value: 1.0,
          currency: "USD",
        });
      }
    }
    if (cancelled === "true") {
      setFailedModal(true);
    }
  }, [success, cancelled]);

  return (
    <div>
      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Success</DialogTitle>
          </DialogHeader>
          <DialogDescription className="min-h-20">
            Thank you for your purchase, your credits are being added to your
            account. Enjoy the coaching and we look forward to your
            improvements!
          </DialogDescription>
          <DialogFooter>
            <Button>Go To Analyze Video!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={failedModal} onOpenChange={setFailedModal}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Cancelled</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            It appears that your payment was cancelled. Please get in contact if
            you are having issues or need help.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};
