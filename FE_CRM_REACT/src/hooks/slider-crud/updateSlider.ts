// src/hooks/product-crud/updateProduct.ts
import axios from "axios";

export async function updateSlider(ID: string, formData: FormData) {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

  await axios.post(`${baseUrl}/sliders/update-ads/${ID}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
