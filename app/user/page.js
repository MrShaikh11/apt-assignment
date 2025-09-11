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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrdersTableSkeleton from "@/components/ui/OrdersTableSkeleton";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null); // current order being edited or added
  const [isNewOrder, setIsNewOrder] = useState(false); // distinguishes Add vs Edit
  const supabase = createClient();

  const getCardBgColor = (order) => {
    switch (order.status) {
      case "cancelled":
        return "bg-yellow-200";
      case "shipped":
        return "bg-green-200";
      case "pending":
        return "bg-blue-200";
      default:
        return "bg-white";
    }
  };

  // Fetch orders from orders_history
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

    // Subscribe to real-time updates
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

  // Handle Add / Edit submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    const { customer_name, product_name, status, id } = editingOrder;

    if (isNewOrder) {
      // Add new order
      const { error } = await supabase.from("orders").insert([
        {
          customer_name,
          product_name,
          status,
        },
      ]);
      if (!error) {
        setEditingOrder(null); // Close dialog
        setIsNewOrder(false);
      }
    } else {
      // Edit existing order
      const { error } = await supabase
        .from("orders_history")
        .update({
          customer_name,
          product_name,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (!error) {
        setEditingOrder(null); // Close dialog
      }
    }
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
        <Table className="w-full shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Updated At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={`${order.id}-${order.updated_at}`}>
                <TableCell className="font-medium">{order.id}</TableCell>
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
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingOrder({ ...order });
                      setIsNewOrder(false);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog for Add / Edit */}
      {editingOrder && (
        <Dialog
          open={!!editingOrder}
          onOpenChange={() => setEditingOrder(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isNewOrder ? "Add New Order" : "Edit Order"}
              </DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <Input
                value={editingOrder.customer_name}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    customer_name: e.target.value,
                  })
                }
                placeholder="Customer Name"
                required
              />
              <Input
                value={editingOrder.product_name}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    product_name: e.target.value,
                  })
                }
                placeholder="Product Name"
                required
              />
              <Select
                value={editingOrder.status}
                onValueChange={(value) =>
                  setEditingOrder({ ...editingOrder, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button type="submit">{isNewOrder ? "Add" : "Save"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
