import axios from "axios";

// src/hooks/category-crud/updateCategory.ts
export async function updateVoucher(
    id: string,
    data: {
      duration: string;
      code: string;
      expired_voucher: Date;
      expired_use: Date;
      // quantity?: number (kalau ada)
    }
  ) {
    return axios.post(`/vouchers/update-voucher/${id}`, data); // sesuaikan endpoint
  }
  