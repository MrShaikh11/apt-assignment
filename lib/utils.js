import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const generateMessage = (order) => {
  switch (order.status) {
    case "shipped":
      return `${order.customer_name}'s order for ${order.product_name} has been shipped.`;
    case "pending":
      return `${order.customer_name} placed a new order for ${order.product_name} (pending).`;
    case "cancelled":
      return `${order.customer_name}'s order for ${order.product_name} was cancelled.`;
    default:
      return `${order.customer_name}'s order for ${order.product_name} is now ${order.status}.`;
  }
};

export const getCardBgColor = (order) => {
  switch (order.status) {
    case "cancelled":
      return "bg-red-400";
    case "shipped":
      return "bg-green-200";
    case "pending":
      return "bg-blue-200";
    default:
      return "bg-white";
  }
};
