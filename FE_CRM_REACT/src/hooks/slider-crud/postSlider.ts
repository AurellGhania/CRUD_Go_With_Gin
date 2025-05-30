import axios from "axios";

// hooks/slider-crud/postSlider.ts (ubah jadi seperti ini)
export async function postSlider(formData: FormData) {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

  await axios.post(`${baseUrl}/sliders/upload`, formData);
}



// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useState } from "react";

// interface ProductFormValues {
//   name: string;    
//   category: string;
// }

// export function postSlider() {
//   const form = useForm<ProductFormValues>();
//   const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
//   const [files, setFiles] = useState<File[]>([]);
//   const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

//   const onSubmit = async (data: ProductFormValues) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("category_id", data.category);

//       // Menambahkan files ke FormData
//       files.forEach((file) => {
//         formData.append("images", file);
//       });
      
//       await axios.post(`${baseUrl}/sliders/upload`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setStatus("success");
//       form.reset();
//     } catch (error: any) {
//       console.error("Upload failed:", error.response ? error.response.data : error.message);
//       setStatus("error");
//     }
//   };

//   return {
//     form,
//     onSubmit,
//     status,
//     setFiles,
//   };
// }
