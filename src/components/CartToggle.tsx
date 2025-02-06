/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from "@/sanity/lib/image";

function ShoppingCart() {
    // State to toggle cart visibility
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    // Toggle cart visibility
    const toggleCart = () => {
        setIsCartVisible(!isCartVisible);
    };

    // Fetch cart from localStorage
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(cart);
    }, []);

    // Remove item from cart
    const removeFromCart = (id: string) => {
        // Filter out the item with the matching id
        const updatedCart = cartItems.filter((item) => item._id !== id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
    };

    // Calculate subtotal
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="relative">
            {/* Cart Icon */}
            <button
                onClick={toggleCart}
                className="text-black p-2 mt-2 rounded"
                aria-label="Toggle Shopping Cart"
            >
                <AiOutlineShoppingCart aria-label="Shopping Cart" size={30} />
            </button>

            {/* Cart Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transition-transform duration-300 ${isCartVisible ? 'translate-x-0' : 'translate-x-full'} sm:w-[400px] md:w-[450px] lg:w-[500px]`}
            >
                <div className="p-4 overflow-y-auto h-full flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
                        <hr />

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-600">Your cart is empty.</p>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                         <Link href={`/shop/${item._id}`}>
                                        <div className="flex">
                                            <Image
                                                src={urlFor(item.imagePath).url()}
                                                height={100}
                                                width={100}
                                                alt={item.name}
                                                className="object-cover"
                                            />
                                            <div className="ml-4">
                                                <h3 className="mt-8 font-medium">{item.name}</h3>
                                                <p className="my-2">
                                                    {item.quantity} x <span className="text-yellow-600">Rs. {item.price}</span>
                                                </p>
                                            </div>
                                        </div>
                                        </Link>
                                        <div 
                                            onClick={() => removeFromCart(item._id)} 
                                            className="bg-gray-500 h-[30px] w-[30px] text-white rounded-full flex justify-center items-center cursor-pointer"
                                        >
                                            <span className="p-0.5 text-xl font-medium">x</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Bottom Section (Subtotal + Buttons) */}
                    <div className="mt-auto">
                        <div className="flex justify-between">
                            <p>Subtotal</p>
                            <p className="ml-8 my-2">
                                {cartItems.length > 0 && (
                                    <span className="text-yellow-600">Rs. {calculateSubtotal()}</span>
                                )}
                            </p>
                        </div>
                        <hr />
                        <div className="mt-4 flex justify-around mx-auto gap-4">
                            <Link href='/viewcart'>
                                <button className="rounded-full text-black hover:text-white bg-white hover:bg-gray-800 px-8 py-2 border border-black">
                                    View Cart
                                </button>
                            </Link>
                            <Link href='/checkouts'>
                                <button className="rounded-full text-black hover:text-white bg-white hover:bg-gray-800 px-8 py-2 border border-black">
                                    Checkout
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Close Cart Button */}
                <button
                    onClick={toggleCart}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close Cart"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default ShoppingCart;
