import { getSession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { videoUpload, analysisOutput, userMetadata } from "@/schema";
import { createClient } from "@supabase/supabase-js";
import { eq, and, sql } from "drizzle-orm";
import { buffer } from 'micro';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {

    // get the raw body
    const rawBody = await request.text();;
    const sig = request.headers.get("stripe-signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
      } catch (err) {
        console.log(err);
        return new Response('Webhook Error', { status: 400 });
      }

    console.log(event);
    switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSessionCompleted = event.data.object;

          console.log(checkoutSessionCompleted.client_reference_id);

          if (checkoutSessionCompleted.amount_total === 200) {
              console.log("5 credits purchased");
              const userCreditsUpdate = await db
              .update(userMetadata)
              .set({ credits: sql`${userMetadata.credits} + ${5}`})
              .where(eq(userMetadata.userId, checkoutSessionCompleted.client_reference_id))
          }

          if (checkoutSessionCompleted.amount_total === 500) {
              console.log("20 credits purchased")
            const userCreditsUpdate = await db
                .update(userMetadata)
                .set({ credits: sql`${userMetadata.credits} + ${20}`})
                .where(eq(userMetadata.userId, checkoutSessionCompleted.client_reference_id))
          }
          break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    return Response.json({ message: 'success' });
  }