"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { IoIosArrowForward } from "react-icons/io";
import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  imagePath: string;
  description: string;
  price: number;
  category: string;
};

async function fetchProductById(id: string): Promise<Product | null> {
  const query = `*[_type == "product" && _id == $id][0]{
    _id, 
    name, 
    "imagePath": image.asset->url,  
    description, 
    price, 
    category
  }`;
  return client.fetch(query, { id });
}

const addToCart = (product: Product) => {
  const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
  const productIndex = existingCart.findIndex((item: Product) => item._id === product._id);

  if (productIndex === -1) {
    existingCart.push({ ...product, quantity: 1 });
  } else {
    existingCart[productIndex].quantity += 1;
  }

  localStorage.setItem("cart", JSON.stringify(existingCart));
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id as string).then((data) => {
        setProduct(data);
      });
    }
  }, [id]);

  if (!product) {
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  }

  return (
    <main className="container mx-auto p-6">
      <Navbar bgColor="bg-white" />
      {/* Section 1: Breadcrumb */}
      <section className="flex w-full md:w-[1363px] items-center gap-9 border border-[2px] border-[#9F9F9F]">
        <div className="w-[82px] h-[24px] mx-10 flex gap-2">
          <Link href="/">
            <p className="font-['Poppins'] text-[16px] text-[#9F9F9F]">Home</p>
          </Link>
          <span className="pt-1">
            <IoIosArrowForward />
          </span>
          <Link href="/shop">
            <p className="font-['Poppins'] text-[16px] text-[#9F9F9F]">Shop</p>
          </Link>
          <span className="pt-1">
            <IoIosArrowForward />
          </span>
        </div>
        <div className="text-black border-l-[2px] border-[#9F9F9F] ml-8 flex items-center">
          <p className="font-['Poppins'] text-[16px] text-black ml-5">{product.name}</p>
        </div>
      </section>

      {/* Section 2: Product Detail */}
      <section className="flex flex-col md:flex-row mt-10 gap-10">
        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse gap-4 md:flex-row w-full md:w-[553px]">
          <div className="flex gap-3 md:flex-col space-y-4">
            <span className="w-[76px] h-[80px] rounded-[10px] mt-4 bg-[#FFF9E5]">
              <Image
                src={"/shop-pro-11.png"}
                width={83}
                height={55}
                alt="Image"
                className="rounded-lg"
              />
            </span>
            {/* More Images */}
          </div>

          {/* Right: Main Product Image */}
          <div className="w-[80%] md:w-[481px]">
            <div className="md:w-[423px] rounded-[10px] bg-[#FFF9E5]">
              <Image
                src={urlFor(product.imagePath).url()}
                width={481}
                height={391}
                alt="Product Image"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Right: Product Information */}
        <div className="w-full md:w-[606px] flex flex-col gap-5">
          <h2 className="text-2xl md:text-[42px] font-['Poppins'] text-black">{product.name}</h2>
          <h2 className="text-2xl text-[#9F9F9F]">Rs. {product.price}</h2>
          <div className="flex items-center gap-2 text-yellow-500">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaRegStarHalfStroke />
            <span className="ml-5 text-[#9F9F9F]">5 Customer Reviews</span>
          </div>
          <p className="text-black mt-3">{product.description}</p>

          {/* Size Selection */}
          <div className="mt-5">
            <h3 className="text-[#9F9F9F]">Size</h3>
            <div className="flex gap-4 items-center mt-2">
              <p className="bg-[#FBEBB5] px-4 py-2 rounded-[5px]">L</p>
              <p className="bg-[#FAF4F4] px-4 py-2 rounded-[5px]">XL</p>
              <p className="bg-[#FAF4F4] px-4 py-2 rounded-[5px]">XS</p>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            className="mt-5 bg-black text-white px-6 py-2 rounded-lg"
          >
            Add to Cart
          </button>
        </div>
      </section>

      {/* Section 3: Additional Info */}
      <section className="flex gap-10 md:w-[90%] md:flex-row mt-10">
        <div className="w-full md:w-[50%]">
          <h3 className="text-[16px] text-[#9F9F9F]">Description</h3>
          <p className="text-[#9F9F9F] text-[16px]">{product.description}</p>
        </div>
        <div className="w-full md:w-[50%]">
          <h3 className="text-[16px] text-[#9F9F9F]">Additional Information</h3>
          <p className="text-[#9F9F9F] text-[16px]">Here will be more information about the product.</p>
        </div>
      </section>

      {/* Section 4: Product Specs */}
      <section className="mt-10">
        <div className="border-t-2 pt-4 flex justify-between">
          <ul className="text-[#9F9F9F]">
            <li>SKU: SS001</li>
            <li>Category: Sofas</li>
            <li>Tags: Sofa, Chair, Home, Shop</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
