
export interface Voucher {
  ID: number;
  code: string;
  expired_voucher: string;
  expired_use: string;
  

}

// Function GET Products
export async function getVouher(): Promise<Voucher[]> {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/vouchers/`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch Vouchers");
  }

  const data = await res.json();
  return data;
}
