import { forwardRef, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const InputProduct = forwardRef<HTMLInputElement, InputProps>(
  ({ className, success, error, hint, ...props }, ref) => {
    const baseClass =
      "block w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none transition";
    const normalClass =
      "border-gray-300 bg-transparent text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-500";
    const errorClass =
      "border-error-500 text-error-600 placeholder-error-400 focus:ring-error-500 focus:border-error-500 dark:border-error-500 dark:text-error-400";
    const successClass =
      "border-success-500 text-success-600 placeholder-success-400 focus:ring-success-500 focus:border-success-500 dark:border-success-500 dark:text-success-400";

    const mergedClass = twMerge(
      baseClass,
      error ? errorClass : success ? successClass : normalClass,
      className
    );

    return (
      <div className="space-y-1">
        <input ref={ref} className={mergedClass} {...props} />
        {hint && (
          <p
            className={`text-xs ${
              error
                ? "text-error-500"
                : success
                ? "text-success-500"
                : "text-gray-500"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

InputProduct.displayName = "InputProduct";

export default InputProduct;
