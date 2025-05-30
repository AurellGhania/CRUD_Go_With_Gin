export interface User {
    ID: number;
    Username: string;
    email: string;
    PhoneNumber: string;
    IsCRMProfile: boolean;
    IsActive: boolean;
  }
  
  
  export async function getUser(): Promise<User[]> {
    const token = localStorage.getItem("token"); // ganti sesuai penyimpanan token
    if (!token) {
      throw new Error("No authorization token found");
    }
  
    const response = await fetch("http://localhost:4000/api/profile", {  // pastikan URL lengkap
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // pastikan token valid dan sudah login
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text(); // ambil text untuk debugging
      throw new Error(`Failed to fetch users: ${errorText}`);
    }
  
    const data = await response.json();
    return data.profiles;  // ambil array profiles dari response
  }
  