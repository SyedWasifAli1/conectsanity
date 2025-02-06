/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia", // Use the latest stable API version
});

export async function processPayment(amount: number) {
  try {
    if (amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Failed to generate client secret");
    }

    return { clientSecret: paymentIntent.client_secret };
  } catch (error: any) {
    console.error("Stripe Payment Error:", error);
    return { error: error.message || "Payment processing failed" };
  }
}
