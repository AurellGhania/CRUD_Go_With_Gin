import axios from "axios";

export const logoutUser = async () => {
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;
  const id = localStorage.getItem("id"); // pakai 'id' karena kamu nyimpan pakai key ini
  const token = localStorage.getItem("token");

  if (!id || !token) {
    console.warn("Tidak bisa logout: ID atau token tidak ditemukan.");
    return { success: false };
  }

  try {
    await axios.post(
      `${baseUrl}/auth/logout/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Bersihkan semua data login dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("username");

    console.log("✅ Berhasil logout");

    return { success: true };
  } catch (error) {
    console.error("❌ Logout gagal:", error);
    return { success: false };
  }
};
