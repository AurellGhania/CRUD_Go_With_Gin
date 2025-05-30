import axios from "axios";

export async function postCategory(data: { name: string }) {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

  await axios.post(`${baseUrl}/categories/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
