"use server";

import { db } from "@/lib/drizzle";
import { userMetadata, videoUpload } from "@/schema";
import { eq, and, desc, asc, or, ilike, sql } from "drizzle-orm";

import { google } from "googleapis";
const { PubSub } = require("@google-cloud/pubsub");

const credential = JSON.parse(
  Buffer.from(
    process.env.GOOGLE_SHOT_CHECK_PUBSUB_ACCNT_B64!,
    "base64"
  ).toString()
);

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key,
  },
});

export const videoDatabaseEntry = async ({
  userId,
  isGuest,
  videoPath,
  userEnteredVideoName,
  additionalData
}: {
  userId: string;
  isGuest: boolean;
  videoPath: string;
  userEnteredVideoName: string;
  additionalData: Record<string, any>;
}) => {
  const projectId = "shot-check";
  const pubsub = new PubSub({ projectId, auth });

  let guestUserId = null;
  let user = null;
  if (isGuest) {
    guestUserId = userId;
  } else {
    user = userId;
  }

  const videoInsertion = await db
    .insert(videoUpload)
    .values({
      userId: user,
      guestUserId: guestUserId,
      videoPath: videoPath,
      originalVideoName: userEnteredVideoName,
      type: 'swing-check',
      additionalData: additionalData
    })
    .returning();

  console.log(videoInsertion);

  if (!videoInsertion) {
    return {
      error: "Error uploading video",
    };
  }

  const dataBuffer = Buffer.from(
    JSON.stringify({
      videoPath: videoPath,
      videoId: videoInsertion[0].id,
    })
  );

  const messageId = await pubsub
    .topic("videos-uploaded")
    .publishMessage({ data: dataBuffer });

  console.log(`Pubsub message ID is : ${messageId}`);

  return {
    success: "Video uploaded successfully",
    data: {
      videoId: videoInsertion[0].id,
    },
  };
};
