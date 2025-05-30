import axios from "axios";

export async function postProduct(formData: FormData) {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

  await axios.post(`${baseUrl}/products/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
