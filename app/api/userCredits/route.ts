import { getSession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { videoUpload, analysisOutput, userMetadata } from "@/schema";
import { createClient } from "@supabase/supabase-js";
import { eq, and, sql } from "drizzle-orm";

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    
    // get the session;
    const session = await getSession();

    // if there is no session, return null;

    if (!session) {
        return null;
    }

    // Get user credits from the database
    const userCredits = await db
        .select()
        .from(userMetadata)
        .where(eq(userMetadata.userId, session.user.id))
        .limit(1);

    // return the user credits
    return Response.json(userCredits[0].credits);
  }