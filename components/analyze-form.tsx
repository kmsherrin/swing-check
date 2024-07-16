"use client";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Cuboid,
  Loader2,
  SquarePlay,
  TriangleAlert,
  UploadIcon,
  X,
} from "lucide-react";
import { videoSubmission } from "@/actions/submit_video";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useSession } from "next-auth/react";

import { createClient } from "@supabase/supabase-js";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import { videoDatabaseEntry } from "@/actions/submit_video_to_db";
import { GoogleLoginButton } from "./custom_ui/google-login-button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FacebookLoginButton } from "./custom_ui/facebook-login-button";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON!
);

const getUserCredits = async () => {
  const response = await fetch(`/api/userCredits`, { cache: "no-store" });
  return response.json();
};

export const AnalyseForm = () => {
  const router = useRouter();
  const [animationParent] = useAutoAnimate();
  const [message, formAction] = useFormState(videoSubmission, null);

  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const [selectedClub, setSelectedClub] = useState<string>("driver");

  const [videoTooLarge, setVideoTooLarge] = useState(false);

  const { data: userSessionData } = useSession() as ExtendedSession;

  const [videoIsUploading, setVideoIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    data: userCredits,
    error,
    isLoading: userCreditsLoading,
    isFetching: userCreditsFetching,
    isRefetching: userCreditsIsRefetching,
    refetch,
  } = useQuery({
    queryKey: ["userCredits"], // Add the initialData property with the value null
    queryFn: () => getUserCredits(),
  });

  useEffect(() => {
    if (selectedFile) {
      if (selectedFile.size > 20000000) {
        setVideoTooLarge(true);
      } else {
        setVideoTooLarge(false);
      }
    } else {
      setVideoTooLarge(false);
    }
  }, [selectedFile]);

  useEffect(() => {
    console.log(message);

    if (message?.success) {
      initiateUpload({
        path: message?.data?.path,
        token: message?.data?.token,
      });
    }

    if (message?.error) {
      toast({
        title: "❌ Error",
        description: message.error,
        variant: "default",
      });
      setUploadError(message.error);
    }
  }, [message]);

  const initiateUpload = async ({
    path,
    token,
  }: {
    path: string;
    token: string;
  }) => {
    setVideoIsUploading(true);
    const { data, error } = await supabase.storage
      .from("videos")
      .uploadToSignedUrl(path, token, selectedFile);

    if (error) {
      setUploadError(
        "Error uploading video, please try again later or contact support."
      );
      return;
    }

    const result = await videoDatabaseEntry({
      userId: userSessionData?.user?.id,
      isGuest: userSessionData?.user?.guest,
      videoPath: data?.path!,
      userEnteredVideoName: selectedFile?.name!,
      additionalData: {
        clubUsed: selectedClub,
      },
    });

    console.log(result);

    toast({
      title: "✅ Success",
      description: "Video uploaded successfully",
      variant: "default",
    });

    setVideoIsUploading(false);
    setSelectedFile(null);

    router.push("/analyze/" + result?.data?.videoId);
  };

  return (
    <div ref={animationParent} className="grid gap-4">
      {!userSessionData?.user ? (
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
                {/* <FacebookLoginButton /> */}
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
      ) : (
        <>
          <div className="flex gap-2 items-center justify-center py-4">
            <TriangleAlert className="w-20 text-[#bab246] mr-" />
            <p className="my-0 p-0 text-sm text-gray-500 dark:text-gray-400">
              Due to high-demand, we're limiting analysis to paid credit users.
            </p>
          </div>

          <p>
            Current credits:{" "}
            <b>
              {!userCredits || userCreditsIsRefetching
                ? "loading..."
                : userCredits}
            </b>
          </p>
          {userCredits && parseInt(userCredits!) === 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Out of credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    You have no credits left, please purchase more to continue.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  {/* <Link href={"/account/credits"}>
                    <Button>Purchase credits</Button>
                  </Link> */}
                  <div>
                    <div className="flex flex-col gap-4">
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
                      Payments are processed securely by Stripe. You will be
                      taken to Stripe to complete payment.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </>
          ) : null}
          <Card>
            <CardContent
              className="flex flex-col items-center justify-center space-y-6 p-8"
              ref={animationParent}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <UploadIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Upload Video
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Click the button or drag and drop your video file.
                </p>
              </div>
              {selectedFile && (
                <div className="relative flex flex-col items-center justify-center py-4 border rounded-md p-4">
                  <Button
                    variant={"ghost"}
                    className="absolute top-1 right-1 text-primary"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X />
                  </Button>
                  <SquarePlay className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                  <p>{selectedFile.name}</p>
                  <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {(selectedFile.size / 1000000).toFixed(2)} MB
                  </p>
                </div>
              )}
              {videoTooLarge && (
                <div className="flex items-center justify-center space-x-2">
                  <Cuboid className="h-5 w-5 text-red-500" />
                  <p className="text-red-500 sm:text-nowrap font-medium">
                    Video too large, max is 10MB
                  </p>
                </div>
              )}
              {!selectedFile ? (
                <div className="w-full">
                  <form className="flex items-center justify-center">
                    <Input
                      accept="video/*"
                      className="sr-only"
                      id="video-upload"
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      disabled={!userCredits || parseInt(userCredits!) < 1}
                    />

                    <label
                      className={`inline-flex items-center justify-center w-full cursor-pointer bg-primary rounded-md text-white font-medium h-12 px-6 ${!userCredits || parseInt(userCredits!) < 1 ? "brightness-50 cursor-not-allowed" : ""}`}
                      htmlFor="video-upload"
                    >
                      <UploadIcon className="mr-2 h-5 w-5" />
                      Select Video
                    </label>
                  </form>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Max file size 10MB, keep it short and sweet.
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  <form
                    className="flex flex-col items-center justify-center gap-4"
                    action={formAction}
                  >
                    <input
                      hidden
                      name="is_guest"
                      value={userSessionData?.user?.guest}
                    />
                    <input
                      hidden
                      name="email"
                      value={userSessionData?.user?.email}
                    />
                    <input
                      hidden
                      name="user_id"
                      value={userSessionData?.user?.id}
                    />
                    <input hidden name="video_file" value={selectedFile.name} />
                    <input hidden name="video_type" value={selectedFile.type} />
                    <div className="flex gap-2 items-center">
                      <label className="font-semibold">Club used:</label>

                      <Select
                        required
                        name="club_used"
                        onValueChange={(e) => setSelectedClub(e)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a club" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Clubs</SelectLabel>
                            <SelectItem value="driver">Driver</SelectItem>
                            <SelectItem value="3-wood">3 Wood</SelectItem>
                            <SelectItem value="5-wood">5 Wood</SelectItem>
                            <SelectItem value="2-iron">2 Iron</SelectItem>
                            <SelectItem value="3-iron">3 Iron</SelectItem>
                            <SelectItem value="4-iron">4 Iron</SelectItem>
                            <SelectItem value="5-iron">5 Iron</SelectItem>
                            <SelectItem value="6-iron">6 Iron</SelectItem>
                            <SelectItem value="7-iron">7 Iron</SelectItem>
                            <SelectItem value="8-iron">8 Iron</SelectItem>
                            <SelectItem value="9-iron">9 Iron</SelectItem>
                            <SelectItem value="pitching-wedge">
                              Pitch Wedge
                            </SelectItem>
                            <SelectItem value="sand-wedge">
                              Sand Wedge
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className={`inline-flex items-center justify-center w-full px-6 font-medium h-12 ${!videoTooLarge ? "" : "brightness-50 cursor-not-allowed"}`}
                      disabled={
                        videoTooLarge ||
                        videoIsUploading ||
                        userCreditsFetching ||
                        userCreditsLoading ||
                        !userCredits ||
                        parseInt(userCredits!) < 1
                      }
                    >
                      {videoIsUploading ? (
                        <>
                          <Loader2 className="animate-spin" />
                        </>
                      ) : (
                        <>
                          <span
                            className={`flex items-center gap-2 ${!videoTooLarge && "animate-bounce"}`}
                          >
                            <UploadIcon className="mr-2 h-5 w-5" />
                            Upload and Analyze!
                          </span>
                        </>
                      )}
                    </Button>
                  </form>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Max file size 10MB, keep it short and sweet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* <div className="flex items-center justify-center">
          <Progress className="w-full" value={20} />
        </div> */}
    </div>
  );
};
