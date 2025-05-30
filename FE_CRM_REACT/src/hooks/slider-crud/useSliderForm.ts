import { useState } from "react";
import { useForm } from "react-hook-form";

export interface SliderFormValues {
  name: string;
  category: string;
  description: string;
  terms: string;
}

export function useSliderForm() {
  const form = useForm<SliderFormValues>({
    defaultValues: {
      name: "",
      category: "",
      description: "",
      terms: "",
    },
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  return { form, status, setStatus };
}
