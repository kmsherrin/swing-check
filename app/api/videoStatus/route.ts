import { getSession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { videoUpload, analysisOutput, videoFrames } from "@/schema";
import { createClient } from "@supabase/supabase-js";
import { eq, and, sql } from "drizzle-orm";

const supabaseUrl = "https://faaqjcsayuwzdwbipxru.supabase.co";
const supabaseKey = process.env.SUPABASE_PASSWORD;

const supabase = createClient(supabaseUrl, supabaseKey!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const video_id = searchParams.get("videoId");

  const session = await getSession();

  console.log(session);

  if (!session) {
    return null;
  }

  console.log(video_id);

  // Generate signed URL for frames
  const { data: videoFramesSignedUrl, error: framesError } =
    await supabase.storage.from("frames").createSignedUrl(`${video_id}`, 3600);

  console.log(videoFramesSignedUrl);
  console.log(framesError);

  const { data: poseSignedUrl, error: poseError } = await supabase.storage
    .from("pose_frame")
    .createSignedUrl(`${video_id}.jpg`, 3600);

  const videoData = await db
    .select()
    .from(videoUpload)
    .leftJoin(analysisOutput, eq(analysisOutput.videoId, videoUpload.id))
    .where(eq(videoUpload.id, video_id!))
    .limit(1);

  videoData[0].framesSignedUrl = videoFramesSignedUrl?.signedUrl;
  videoData[0].poseSignedUrl = poseSignedUrl?.signedUrl;

  return Response.json(videoData[0]);
}
