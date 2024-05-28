"use server";

import { db } from "@/lib/drizzle";
import { product, productCategory, restaurant } from "@/schema";
import { eq, and, desc, asc, or, ilike } from "drizzle-orm";

import { redirect } from "next/navigation";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://faaqjcsayuwzdwbipxru.supabase.co";
const supabaseKey = process.env.SUPABASE_PASSWORD;

const supabase = createClient(supabaseUrl, supabaseKey!);

export const videoSubmission = async (prevState, formData) => {
  const videoUuid = crypto.randomUUID();

  console.log(formData);

  const videoType = formData.get("video_type");

  // Check video mp4
  if (videoType !== "video/mp4") {
    return {
      error: "Invalid video type",
    };
  }

  const { data, error } = await supabase.storage
    .from("videos")
    .createSignedUploadUrl(`/${videoUuid}.${videoType.split("/")[1]}`);

  if (error) {
    console.error(error);
    return {
      error: "Error uploading video",
    };
  }

  return {
    success: "Video uploaded successfully",
    data: {
      preSignedUrl: data?.signedUrl,
      token: data?.token,
      path: data?.path,
    },
  };
};
