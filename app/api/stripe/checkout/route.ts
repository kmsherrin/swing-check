

import { getSession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { videoUpload, analysisOutput, userMetadata } from "@/schema";
import { createClient } from "@supabase/supabase-js";
import { eq, and, sql } from "drizzle-orm";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const dynamic = 'force-dynamic'

let productMap;
if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
    productMap = {
        '5': "price_1PPbX7I34yPL9MVz6Inr57yk",
        '20': "price_1PPbYLI34yPL9MVz93Cf1Rsd",
        'sub': "price_1PVAQwI34yPL9MVzZx7Z386e"
    }
} else {
      productMap = {
        '5': "price_1PPbX7I34yPL9MVz6Inr57yk",
        '20': "price_1PPbYLI34yPL9MVz93Cf1Rsd",
        'sub': "price_1PVAQwI34yPL9MVzZx7Z386e"
    }
}

export async function POST(request: Request) {

    if (!stripe) {
        return new Response("Failed to load stripe", { status: 500 });
    }

    const urlOrigin = request.headers.get("origin");

    // get credit amount from form data
    const formData = await request.formData();
    const creditAmount = formData.get("creditAmount");

    console.log(creditAmount)

    // get the session;
    const session = await getSession();

    // if there is no session, return null;

    if (!session) {
        return Response.error("You must be logged in to purchase credits");
    }

    const stripeSession = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: productMap[creditAmount],
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${urlOrigin}/account/credits?success=true`,
        cancel_url: `${urlOrigin}/account/credits?canceled=true`,
        automatic_tax: {enabled: true},
        client_reference_id: session.user.id,
      });


    return Response.redirect(stripeSession.url, 303);
  }