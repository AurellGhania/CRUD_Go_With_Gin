
import { useState } from "react";


//gituin api nya
export async function deleteSliderAPI(ID: number): Promise<void> {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/sliders/delete-ads/${ID}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }
}


// Function DELETE Product
export function delateCategory() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (ID: number) => {
    setIsDeleting(true);
    try {
      await deleteSliderAPI(ID);
      setIsDeleting(false);
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus produk");
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting, error };
}