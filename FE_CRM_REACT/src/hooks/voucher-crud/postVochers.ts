


// import axios from "axios";

// export async function postVoucher(data: { name: string }) {
//   const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

//   await axios.post(`${baseUrl}/vouchers/`, data, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }







// src/hooks/postVochers.ts
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";


interface ProductFormValues {
  duration: string; // datang dari input text, jadi string
  quantity: string;
  expired_voucher: Date;
  expired_use: Date;
}

export function postVouchers() {
  const form = useForm<ProductFormValues>();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

  const onSubmit = async (data: ProductFormValues) => {
    const payload = {
      duration: parseInt(data.duration), // ubah string jadi number
      quantity: parseInt(data.quantity),
      expired_voucher: data.expired_voucher.toISOString(),
      expired_use: data.expired_use.toISOString(),
    };

    try {
      await axios.post(`${baseUrl}/vouchers/`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setStatus("success");
      form.reset(); // Reset form setelah sukses
    } catch (error) {
      console.error("❌ Gagal submit voucher:", error);
      console.log("Payload dikirim ke backend:", data);
      setStatus("error");
    }
  };

  return {
    form,
    onSubmit,
    status,
  };
}
