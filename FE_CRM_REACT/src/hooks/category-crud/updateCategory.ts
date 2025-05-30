// src/hooks/product-crud/updateProduct.ts
import axios from "axios";

// updateCategory.ts
export async function updateCategory(ID: string, data: { name: string }) {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;
  return axios.post(`${baseUrl}/categories/update-category/${ID}`, data); // <-- JSON body
}
