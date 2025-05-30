import { Category } from "../category-crud/getCategory";

export interface Slider {
  ID: number;
  title: string;
  description: string;
  terms: string;
  category: Category;
  image_url: string;



}

// Function GET Products
export async function getSlider(): Promise<Slider[]> {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/sliders/ads`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data.ads;
}
