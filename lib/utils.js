// Generates a detailed update message for order changes
export function generateOrderUpdateMessage(oldOrder, newOrder) {
  if (!oldOrder || !newOrder) return "Order updated.";
  const changes = [];
  const fields = ["customer_name", "product_name", "status", "updated_at"];
  fields.forEach((field) => {
    if (oldOrder[field] !== newOrder[field]) {
      changes.push(
        `${field.replace(/_/g, " ")} changed from "${oldOrder[field]}" to "${
          newOrder[field]
        }"`
      );
    }
  });
  if (changes.length === 0)
    return `Order #${newOrder.id} updated, but no visible fields changed.`;
  return `Order #${newOrder.id} updated: \n- ${changes.join("\n- ")}`;
}
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
