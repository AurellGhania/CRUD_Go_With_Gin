// src/hooks/product-crud/useProductForm.ts
import { useForm } from "react-hook-form";
import { useState } from "react";

export interface ProductFormValues {
  name: string;
  price: string;
  category: string;
  description: string;
  stock: string;
}

export function useProductForm(defaultValues?: Partial<ProductFormValues>) {
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      price: "",
      description: "",
      stock: "",
      category: "",
      ...defaultValues,
    },
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  return { form, status, setStatus };
}
