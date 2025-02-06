/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Delivery from "@/components/Delivery";
import Navbar from "@/components/Navbar";
import Shophead from "@/components/Shophead";
import React, { useEffect, useState } from "react";
import { TbPointFilled } from "react-icons/tb";
import { loadStripe } from "@stripe/stripe-js";
import { Elements,PaymentElement, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { addOrderToSanity } from "./sanityaction";
import { processPayment } from "./action"; // Import the function from action.ts
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation"; 
// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ cart }: { cart: any[] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {

    
    
      const response = await processPayment(calculateTotal());
      if (response.error) throw new Error(response.error);

      const clientSecret = response.clientSecret;
      if (!clientSecret) throw new Error("Stripe client secret is missing!");

      setClientSecret(clientSecret);

      if (!stripe || !elements) throw new Error("Stripe or Elements is not initialized");

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("CardElement is not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // name: "fullName", // ✅ Full Name
            email: "syd@gmail.com", // ✅ Email
            // phone: "276876", // ✅ Phone Number
            // address: {
            //   line1: "karachi", // ✅ Address
            //   city: "karachi", // ✅ City
            //   state: "karchi", // ✅ State
            //   postal_code: "72937", // ✅ Postal Code
            //   country: "PK", // ✅ Country
            // },
          },
        },
      });

      if (error) throw new Error(error.message);

      if (paymentIntent?.status === "succeeded") {
        setSuccess("Payment successful! ✅");
        await addOrderToSanity(cart);
        localStorage.removeItem("cart");

        // ✅ Redirect to Home after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        throw new Error("Payment failed!");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  async function fetchOrders() {
    try {
      const orders = await client.fetch(`*[_type == "order"]{
        _id,
        createdAt,
        items[] {
          name,
          quantity,
          price
        }
      }`);
  
      console.log("Fetched Orders:", orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }
  
  // Call the function
  fetchOrders();
  
  return (
    <section className="flex flex-col items-center w-full px-4 py-8 bg-slate-100">
      <div className="container flex flex-col md:flex-row gap-8">
        {/* Left Side: Billing Details */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-3xl font-semibold text-black">Billing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input className="w-full p-3 border rounded-md" type="text" placeholder="John" />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input className="w-full p-3 border rounded-md" type="text" placeholder="Doe" />
            </div>
          </div>

          {/* Stripe Card Input */}
          <div className="p-4 border rounded-md bg-white">
            <CardElement />
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full md:w-1/2 space-y-8">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-semibold text-black">Order Summary</h2>
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between mt-4">
                <span className="text-gray-700">{item.name} x{item.quantity}</span>
                <span className="text-black">RS {item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between mt-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-black">RS {calculateTotal()}</span>
            </div>
            <div className="flex justify-between mt-2 font-bold">
              <span className="text-black">Total</span>
              <span className="text-yellow-600">RS {calculateTotal()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TbPointFilled className="text-2xl text-black" />
              <span>Direct Bank Transfer</span>
            </div>
            <p className="text-sm text-gray-500">
              Make your payment directly into our bank account. Your order will not be shipped until the funds have cleared.
            </p>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded-full" />
              <span>Agree to Terms and Conditions</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

const CheckoutPage = () => {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  return (
    <main>
      {/* Header */}
      <section>
        <Navbar bgColor="bg-white" />
        <Shophead headText="Check Outs" linkChange="Check" />
      </section>

      {/* ✅ FIX: Wrap CheckoutForm Inside <Elements> */}
      <Elements stripe={stripePromise}>
        <CheckoutForm cart={cart} />
      </Elements>

      {/* Delivery Section */}
      <section>
        <Delivery />
      </section>
    </main>
  );
};

export default CheckoutPage;
