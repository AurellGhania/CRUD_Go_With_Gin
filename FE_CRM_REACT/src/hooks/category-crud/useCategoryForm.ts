// src/hooks/product-crud/useProductForm.ts
import { useForm } from "react-hook-form";
import { useState } from "react";

export interface CategoryFormValues {
  name: string;
}

export function useCategoryForm(defaultValues?: Partial<CategoryFormValues>) {
  const form = useForm<CategoryFormValues>({
    defaultValues: {
      name: defaultValues?.name || "",
    },
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  return { form, status, setStatus };
}
