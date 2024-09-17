import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
}

export function Notification({ message, type }: NotificationProps) {
  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";
  const Icon =
    type === "success" ? CheckCircle : type === "error" ? AlertCircle : Info;

  return (
    <div
      className={`fixed top-24 right-4 z-50 p-4 rounded-md shadow-lg ${bgColor} text-white flex items-center space-x-2`}
    >
      <Icon className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
}
