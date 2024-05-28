import { getSession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { videoUpload, analysisOutput, videoFrames } from "@/schema";
import { createClient } from "@supabase/supabase-js";
import { eq, and, sql } from "drizzle-orm";

const supabaseUrl = "https://faaqjcsayuwzdwbipxru.supabase.co";
const supabaseKey = process.env.SUPABASE_PASSWORD;

const supabase = createClient(supabaseUrl, supabaseKey!);

export async function POST(request: Request) {

const { videoId } = await request.json();

  const session = await getSession();

  console.log(session);

  if (!session) {
    return null;
  }

  const updatedVideoData = await db.update(videoUpload).set({ userId: session?.user?.id }).where(eq(videoUpload.id, videoId));

  return Response.json(updatedVideoData);
}
