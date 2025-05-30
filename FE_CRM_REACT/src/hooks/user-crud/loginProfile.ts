import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

interface ProductFormValues {
  login: string;
  password: string;
}

export function useLoginProfile() {
  const form = useForm<ProductFormValues>();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;
  const navigate = useNavigate();

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const token = response.data.token;
      const user = response.data.user;
      

      // ✅ Simpan token dan ID ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("id", user.ID); // pastikan backend mengirim "id"
      localStorage.setItem("username", user.Username); // ✅ tambahkan ini
      localStorage.setItem("email", user.email); // ✅ tambahkan ini
      localStorage.setItem("role", user.role); // ✅ tambahkan ini
      localStorage.setItem("token", token);
      //localStorage.setItem("IsCRMProfile", String(response.IsCRMProfile)); // "true" atau "false"


      const username = localStorage.getItem("username");


      // ✅ Debug
      console.log("👋 Welcome, " + username);
      console.log("✅ Token:", token);
      console.log("✅ ID:", user.ID);
      console.log("✅ Email:", user.email);
      console.log("✅ Role:", user.role);

      // ✅ Redirect berdasarkan role
      if (user.role === "crm") {
        navigate("/"); // ke dashboard CRM
      } else {
        navigate("/landing-page"); // untuk user biasa
      }

      setStatus("success");
      form.reset();
      console.log("🚀 Data login dikirim:", data);
    } catch (error: any) {
      console.error("❌ Login error:", error.response?.data || error.message);
      console.log("🚀 Data login dikirim:", data);
      setStatus("error");
    }
  };

  return {
    form,
    onSubmit,
    status,
  };
}
