"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";



export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial orders
    supabase
      .from("orders")
      .select("*")
      .then(({ data }) => setOrders(data ?? []));

    // Subscribe to realtime changes
    const channel = supabase
      .channel("public:orders") // channel name can be anything
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("📢 Change received!", payload);

          // Type cast to Order
          const newOrder = payload.new
          const oldOrder = payload.old

          switch (payload.eventType) {
            case "INSERT":
              setOrders((prev) => [newOrder, ...prev]);
              toast.success("New Order Inserted");
              break;
            case "UPDATE":
              setOrders((prev) =>
                prev.map((o) => (o.id === newOrder.id ? newOrder : o))
              );
              break;
            case "DELETE":
              setOrders((prev) => prev.filter((o) => o.id !== oldOrder.id));
              // toast.warning("Order Deleted", {
              //   description: `${oldOrder.customer_name} - ${oldOrder.product_name}`,
              // });
              toast("Something went wrong. Please try again.");

              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div>
      <h2>Realtime Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {orders.map((o) => (
            <li key={o.id}>
              {o.customer_name} - {o.product_name} ({o.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
