"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import OrdersTableSkeleton from "@/components/ui/OrdersTableSkeleton";
import UserOrdersTable from "@/components/UserOrdersTable";
import OrderDialog from "@/components/OrderDialog";
import { toast } from "sonner";
import { generateOrderUpdateMessage } from "@/lib/utils";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isNewOrder, setIsNewOrder] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(50);

      if (!error && data) setOrders(data);
      setLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Payload", payload);
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new, ...prev].slice(0, 50));
            toast.success("🆕 New Order", {
              description: `${payload.new.customer_name} placed an order for ${payload.new.product_name} (${payload.new.status})`,
            });
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) => (o.id === payload.new.id ? payload.new : o))
            );

            const message = generateOrderUpdateMessage(
              payload.old,
              payload.new
            );
            if (
              payload.old.status !== payload.new.status &&
              payload.new.status === "cancelled"
            ) {
              toast.error("⚠️ Order Cancelled", {
                description: message,
              });
            } else {
              toast("✏️ Order Updated", {
                description: message,
              });
            }
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
            toast.error("🗑️ Order Deleted", {
              description: `Order #${payload.old.id} (${payload.old.customer_name} - ${payload.old.product_name}) was deleted.`,
            });
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    const { customer_name, product_name, status, id } = editingOrder;

    if (isNewOrder) {
      await supabase.from("orders").insert([
        {
          customer_name,
          product_name,
          status,
        },
      ]);
    } else {
      await supabase
        .from("orders")
        .update({ customer_name, product_name, status })
        .eq("id", id);
    }

    setEditingOrder(null);
    setIsNewOrder(false);
  };

  const handleCancel = async (orderId) => {
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-medium">User Orders (Editable)</h1>
        <Button
          onClick={() => {
            setEditingOrder({
              customer_name: "",
              product_name: "",
              status: "pending",
            });
            setIsNewOrder(true);
          }}
        >
          Add Order
        </Button>
      </div>

      {loading ? (
        <OrdersTableSkeleton />
      ) : (
        <UserOrdersTable
          orders={orders}
          onEdit={(order) => {
            setEditingOrder(order);
            setIsNewOrder(false);
          }}
          onCancel={handleCancel}
        />
      )}

      <OrderDialog
        open={!!editingOrder}
        order={editingOrder}
        isNew={isNewOrder}
        onClose={() => {
          setEditingOrder(null);
          setIsNewOrder(false);
        }}
        onChange={setEditingOrder}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
