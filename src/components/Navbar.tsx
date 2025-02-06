/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { MdManageAccounts, MdOutlineShoppingCart } from "react-icons/md";
import { CiSearch, CiHeart } from "react-icons/ci";
import { TbMenu4 } from "react-icons/tb";
import { GiCrossedSabres } from "react-icons/gi";
import ShoppingCart from "./CartToggle";

const Navbarr = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <main>
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 text-gray-600 ${props.bgColor} shadow-md`}
        style={{ height: "80px" }}
      >
        <div className="container mx-auto flex items-center justify-between px-6 h-full">
          {/* Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex flex-1 justify-center space-x-12 text-lg font-semibold">
            <Link href={"/"} className="hover:text-gray-900">
              Home
            </Link>
            <Link href={"/shop"} className="hover:text-gray-900">
              Shop
            </Link>
            <Link href={"/contact"} className="hover:text-gray-900">
              Contact
            </Link>
          </nav>

          {/* Icons aligned to the right */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={"/searchbar"} className="text-[30px]">
              <CiSearch />
            </Link>
            <Link href={"/myaccount"} className="text-[30px]">
              <MdManageAccounts />
            </Link>
            <Link href={"/viewcart"} className="text-[30px]">
              <CiHeart />
            </Link>
            <div className="flex items-center">
              <ShoppingCart />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-3xl p-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              {isOpen ? <GiCrossedSabres /> : <TbMenu4 />}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar (Mobile Navigation) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <button
          className="absolute top-5 right-5 text-2xl"
          onClick={toggleSidebar}
        >
          <GiCrossedSabres />
        </button>

        <nav className="flex flex-col mt-16 space-y-6 text-lg font-semibold text-center">
          <Link href={"/"} className="block hover:text-gray-900" onClick={toggleSidebar}>
            Home
          </Link>
          <Link href={"/shop"} className="block hover:text-gray-900" onClick={toggleSidebar}>
            Shop
          </Link>
          <Link href={"/contact"} className="block hover:text-gray-900" onClick={toggleSidebar}>
            Contact
          </Link>
          <div className="flex justify-center gap-6 text-2xl mt-4">
            <Link href={"/myaccount"} onClick={toggleSidebar}>
              <MdManageAccounts />
            </Link>
            <Link href={"/checkouts"} onClick={toggleSidebar}>
              <CiHeart />
            </Link>
            <Link href={"/cart"} onClick={toggleSidebar}>
              <MdOutlineShoppingCart />
            </Link>
          </div>
        </nav>
      </div>

      {/* Overlay for Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Adjusted spacing to prevent content overlap */}
      <div style={{ height: "80px" }} />
    </main>
  );
};

export default Navbarr;
