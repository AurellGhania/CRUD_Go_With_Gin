import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "xs" | "md";
  variant?: "primary" | "outline" | "solid" | "light";
  color?: "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  color = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    xs: "px-4 py-1 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  const variants = {
    light: {
      primary: "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
      success: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
      error: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
      warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400",
      info: "bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500",
      light: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
      dark: "bg-gray-500 text-white dark:bg-white/5 dark:text-white",
    },
    solid: {
      primary: "bg-brand-500 text-white dark:text-white",
      success: "bg-success-500 text-white dark:text-white",
      error: "bg-error-500 text-white dark:text-white",
      warning: "bg-warning-500 text-white dark:text-white",
      info: "bg-blue-light-500 text-white dark:text-white",
      light: "bg-gray-400 dark:bg-white/5 text-white dark:text-white/80",
      dark: "bg-gray-700 text-white dark:text-white",
    },
  };

  const variantClasses: Record<"primary" | "outline", string> = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  let colorStyles = "";

  // ✅ Tambahkan pengecekan aman
  if ((variant === "solid" || variant === "light") && color && variants[variant][color]) {
    colorStyles = variants[variant][color];
  }

  return (
    <button
    className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
      sizeClasses[size]
    } ${(variantClasses[variant as "primary" | "outline"] || "")} ${colorStyles} ${
      disabled ? "cursor-not-allowed opacity-50" : ""
    }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
