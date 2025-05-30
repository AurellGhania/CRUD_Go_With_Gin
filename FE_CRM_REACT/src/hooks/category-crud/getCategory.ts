
export interface Category {
  ID: number;
  name: string;

}

// Function GET Products
export async function getCategory(): Promise<Category[]> {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/categories/`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch Categories");
  }

  const data = await res.json();
  return data.categories;
}
