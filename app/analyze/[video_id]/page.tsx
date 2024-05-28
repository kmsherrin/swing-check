"use server";
import { AnalyzeVideo } from "@/components/analyze-video";
import { GoogleLoginButton } from "@/components/custom_ui/google-login-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { videoUpload, analysisOutput } from "@/schema";
import { eq } from "drizzle-orm";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const supabaseUrl = "https://faaqjcsayuwzdwbipxru.supabase.co";
const supabaseKey = process.env.SUPABASE_PASSWORD;

const supabase = createClient(supabaseUrl, supabaseKey!);

const getVideoData = async (video_id: string) => {
  "use server";
  // Generate signed URL for frames
  const { data: videoFramesSignedUrl, error: framesError } =
    await supabase.storage
      .from("frames")
      .createSignedUrl(`/${video_id}.mp4`, 3600);

  const { data: poseSignedUrl, error: poseError } = await supabase.storage
    .from("pose_frame")
    .createSignedUrl(`/${video_id}.jpg`, 3600);

  const data = await db
    .select()
    .from(videoUpload)
    .leftJoin(analysisOutput, eq(analysisOutput.videoId, videoUpload.id))
    .where(eq(videoUpload.id, video_id));

  const videoData = data[0];
  videoData.framesSignedUrl = videoFramesSignedUrl?.signedUrl;
  videoData.poseSignedUrl = poseSignedUrl?.signedUrl;

  return videoData;
};

export default async function VideoAnalyze({
  params,
}: {
  params: { video_id: string };
}) {
  console.log(params.video_id);

  const session = await getSession();
  console.log(session);
  const videoData = await getVideoData(params.video_id);
  console.log(videoData);

  if (!videoData) {
    return (
      <main className="flex flex-col items-center justify-start min-h-screen px-4 py-12 md:px-6 lg:px-8 bg-gradient-to-tr from-muted to-card">
        <div className="max-w-xl w-full space-y-6 gap-4 flex flex-col">
          <h1 className="text-5xl font-bold tracking-tight">
            Video not found.
          </h1>
          <Link href="/" className="text-primary underline">
            Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen px-4 py-12 md:px-6 lg:px-8 bg-gradient-to-tr from-muted to-card">
      <div className="max-w-3xl w-full space-y-6">
        {session?.user?.guest ? (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create an account to view your video analysis!
                </CardDescription>
              </CardContent>
              <CardFooter>
                <GoogleLoginButton />
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col gap-4 ">
            <AnalyzeVideo videoId={params.video_id} videoData={videoData} />
          </div>
        )}
      </div>
    </main>
  );
}
