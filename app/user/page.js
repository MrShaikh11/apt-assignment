"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import OrdersTableSkeleton from "@/components/ui/OrdersTableSkeleton";
import UserOrdersTable from "@/components/UserOrdersTable";
import OrderDialog from "@/components/OrderDialog";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isNewOrder, setIsNewOrder] = useState(false);
  const supabase = createClient();

  // ✅ Fetch from `orders` (not history)
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

    // ✅ Realtime subscription on `orders`
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new, ...prev].slice(0, 50));
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) => (o.id === payload.new.id ? payload.new : o))
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [supabase]);

  // ✅ Handle Add / Edit
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

    // ✅ orders_history will auto-update via trigger
    setEditingOrder(null);
    setIsNewOrder(false);
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
