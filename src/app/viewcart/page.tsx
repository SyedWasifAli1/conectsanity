"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Shophead from "@/components/Shophead";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

const ViewCart = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);


  
  const handleRemove = (id: string) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleQuantityChange = (id: string, increment: boolean) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: increment ? item.quantity + 1 : item.quantity - 1,
          }
        : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div>
        <Navbar bgColor="bg-white" />
        <Shophead headText="View Cart" linkChange="Cart" />
      </div>

      {/* Cart Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Cart Items */}
          <div className="w-full md:w-2/3 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Cart</h2>

            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b pb-4 mb-4">
                  <div className="flex items-center gap-4">
                    <Image
                      width={80}
                      height={80}
                      src={urlFor(item.imagePath).url()}
                      alt="Product"
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleQuantityChange(item._id, false)}
                        className="bg-gray-300 text-gray-700 p-2 rounded-full"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="w-16 p-2 border rounded text-center"
                        value={item.quantity}
                        readOnly
                      />
                      <button
                        onClick={() => handleQuantityChange(item._id, true)}
                        className="bg-gray-300 text-gray-700 p-2 rounded-full"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">Rs. {item.price * item.quantity}</p>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="flex justify-between mt-6">
              <Link href="/shop">
                <button className="text-gray-600 hover:text-gray-800">Continue Shopping</button>
              </Link>
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Summary Section */}
          <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Cart Summary</h2>
            <div className="flex justify-between text-gray-600 mb-4">
              <p>Subtotal</p>
              <p>
                Rs.{" "}
                {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
              </p>
            </div>
            <div className="flex justify-between text-gray-600 mb-4">
              <p>Shipping</p>
              <p>Free</p>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-800 mb-6">
              <p>Total</p>
              <p>
                Rs.{" "}
                {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
              </p>
            </div>

<Link href="/checkouts" passHref>
  <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
    Proceed to Checkout
  </button>
</Link>

          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewCart;
