import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

interface ProductFormValues {
  username: string;
  phone_number: string;
  email: string;
  password: string;
}

export function registerProfile() {
  const form = useForm<ProductFormValues>();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;


  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();

      // Menambahkan data text ke FormData
      formData.append("username", data.username);
      formData.append("phone_number", data.phone_number);
      formData.append("email", data.email);
      formData.append("password", data.password);


      await axios.post(`${baseUrl}/auth/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      setStatus("success");
      form.reset(); // Clear form setelah sukses submit
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return {
    form,
    onSubmit,
    status,
  };
}
