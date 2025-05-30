// src/components/auth/ProtectedRoute.tsx
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "user" | "crm"; // nilai role dari backend
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ambil role dari localStorage

  if (!token || role !== allowedRole) {
    return <Navigate to="/landing-page" replace />;
  }

  return <>{children}</>;
}
