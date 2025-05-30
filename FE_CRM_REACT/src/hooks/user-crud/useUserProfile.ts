import { useEffect } from "react";

export const useUserProfile = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id"); // huruf kecil
    const username = localStorage.getItem("username"); 
    const email = localStorage.getItem("email"); 
    const role = localStorage.getItem("role"); 

    if (token && userId) {
      console.log("User ID:", userId);
      console.log("Username:", username);
      console.log("Email::", email);
      console.log("Role:", role);
      console.log("Token:", token);
    }
  }, []);
};
