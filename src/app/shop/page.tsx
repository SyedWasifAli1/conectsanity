"use client";
import Navbarr from "@/components/Navbar";
import Shophead from "@/components/Shophead";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  imagePath: string;
  description: string;
  price: number;
  category: string;
};
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
async function fetchProducts(): Promise<Product[]> {
  return client.fetch(`*[_type == 'product']{
    _id, 
    name, 
    "imagePath": image.asset->url,  
    description, 
    price, 
    category
  }`);
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  useEffect(() => {
    async function getProducts() {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    }
    getProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (maxPrice !== "") {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }
    setFilteredProducts(filtered);
  }, [search, category, maxPrice, products]);

  return (
    <main>
      <Navbarr bgColor="bg-white" />
      <Shophead headText="Shop" linkChange="shop" />
      <div className="p-5 bg-gray-100 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by category..."
          className="p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="p-2 border rounded"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}

        />
      </div>
      <div className="bg-slate-200">
        <h1 className="text-4xl font-bold text-center p-10">Products</h1>
        <ul className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center gap-y-20 gap-x-14 mt-10 mb-5">
          {filteredProducts.map((product) => (
            <li key={product._id} className="relative">
              <Link href={`/shop/${product._id}`}>
                <Image
                  className="h-60 w-full object-cover rounded-t-xl"
                  src={urlFor(product.imagePath).url()}
                  alt={product.name}
                  width={300}
                  height={200}
                />
                <div className="px-4 py-3 w-72">
                  <h2 className="text-orange-600 font-bold text-2xl">
                    {product.name}
                  </h2>
                  <p className="text-gray-500 text-sm">{product.description}</p>
                  <p className="text-xl font-bold text-gray-700">
                    Price: ${product.price}
                  </p>
                  <p className="text-blue-700 p-2 rounded-lg">
                    Category: {product.category}
                  </p>
                  <button
            onClick={() => addToCart(product)}
            className="mt-5 bg-black text-white px-6 py-2 rounded-lg"
          >
            Add to Cart
          </button>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
