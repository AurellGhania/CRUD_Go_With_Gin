import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "secondary";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export default function ButtonProduct({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  className,
  ...props
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeClass = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-5 py-3 text-lg",
  }[size];

  const variantClass = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-300",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
  }[variant];

  const mergedClass = twMerge(baseClass, sizeClass, variantClass, className);

  return (
    <button className={mergedClass} {...props}>
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
}
