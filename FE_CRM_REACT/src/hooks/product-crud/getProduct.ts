// lib/api/productApi.ts
import { Category } from "../category-crud/getCategory";


export interface Product {
  ID: number;
  name: string;
  images: string[];
  price: string;
  description: string;
  category: Category;
  stock: string;
}

// Function GET Products
export async function getProducts(): Promise<Product[]> {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/products/`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data;
}
