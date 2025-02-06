/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2021-08-31'
});

export async function addOrderToSanity(cart: any) {
  try {
    console.log("Cart Data:", cart);
    const order = {
      _type: "order",
      items: cart.map((item: any) => ({
        _type: "orderItem", // ✅ Correct `_type`
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: new Date().toISOString(),
    };

    console.log("Order Payload:", order);

    const response = await client.create(order);
    console.log("Sanity Response:", response);

    return { success: true };
  } catch (error: any) {
    console.error("Sanity Error:", error.message);
    return { error: error.message };
  }
}

