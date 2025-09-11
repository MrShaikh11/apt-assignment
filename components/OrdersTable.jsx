"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrdersTableSkeleton from "./ui/OrdersTableSkeleton";
import { getCardBgColor } from "@/lib/utils";



export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders_history")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(50);
      if (!error) setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel("orders-history")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders_history" },
        (payload) => {
          setOrders((prev) => [payload.new, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [supabase]);

  return (
    <div className="w-full">
      <h1 className="text-lg font-medium mb-6">Orders</h1>

      {loading ? (
        <OrdersTableSkeleton />
      ) : (
        <Table className="w-full shadow-sm">
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
              <TableRow key={`${order.order_id}-${order.updated_at}`}>
                <TableCell className="font-medium">{order.order_id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.product_name}</TableCell>
                <TableCell
                  className={`px-2 py-1 rounded ${getCardBgColor(order)}`}
                >
                  {order.status}
                </TableCell>
                <TableCell className="text-right">
                  {new Date(order.updated_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
