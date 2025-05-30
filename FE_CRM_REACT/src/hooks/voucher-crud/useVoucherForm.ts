
import { useForm } from "react-hook-form";
import { useState } from "react";

export interface VoucherFormValues {
    duration: string; // datang dari input text, jadi string
    code: string;
    expired_voucher: Date;
    expired_use: Date;
}

export function useVoucherForm(defaultValues?: Partial<VoucherFormValues>) {
  const form = useForm<VoucherFormValues>({
    defaultValues: {
      duration: defaultValues?.duration || "",
      code: defaultValues?.code || "",
      expired_voucher: defaultValues?.expired_voucher || new Date(),
      expired_use: defaultValues?.expired_use || new Date(),
    },
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  return { form, status, setStatus };
}
