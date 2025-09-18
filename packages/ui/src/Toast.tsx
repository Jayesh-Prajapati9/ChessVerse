import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";

export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  isDark: boolean
) => {
  const baseClass = isDark
    ? "bg-[#0e0e10] text-white border border-[#27272a]"
    : "bg-white text-black border border-gray-200";

  const toastOptions: ToastOptions = {
    className: `${baseClass} !rounded-2xl select-none px-4 py-3 shadow-md text-sm font-medium`,
    closeButton: false,
    icon: () => {
      const iconMap: Record<typeof type, string> = {
        success: "✅",
        error: "❌",
        info: "ℹ️",
        warning: "⚠️",
      };

      return (
        <span
          className="text-lg mr-2"
          style={{ color: isDark ? "#4c4fef" : "#4c4fef" }}
        >
          {iconMap[type]}
        </span>
      );
    },
  };

  toast[type](message, toastOptions);
};
