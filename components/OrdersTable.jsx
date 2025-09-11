"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const supabase = createClient();

  // Function to get background color based on status
  const getCardBgColor = (order) => {
    switch (order.status) {
      case "deleted":
        return "bg-red-200";
      case "shipped":
        return "bg-green-200";
      case "pending":
        return "bg-blue-200";
      default:
        return "bg-white";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("updated_at", { ascending: false });
      if (!error) setOrders(data || []);
    };

    fetchOrders();

    const channel = supabase
      .channel("orders-table")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((o) => (o.id === payload.new.id ? payload.new : o));
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((o) => o.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="w-full">
      <h1 className="text-lg font-medium mb-6">Orders</h1>
      <Table className="w-full shadow-sm">
        <TableCaption>All recent orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.product_name}</TableCell>
              <TableCell className={`m-4 ${getCardBgColor(order)}`}>
                {order.status}
              </TableCell>
              <TableCell className="text-right">
                {new Date(order.updated_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
