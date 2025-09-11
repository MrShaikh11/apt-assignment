"use client";

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

const OrderDialog = ({ open, order, isNew, onClose, onChange, onSubmit }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add New Order" : "Edit Order"}</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <Input
            value={order.customer_name}
            onChange={(e) =>
              onChange({ ...order, customer_name: e.target.value })
            }
            placeholder="Customer Name"
            required
          />
          <Input
            value={order.product_name}
            onChange={(e) =>
              onChange({ ...order, product_name: e.target.value })
            }
            placeholder="Product Name"
            required
          />
          <Select
            value={order.status}
            onValueChange={(value) => onChange({ ...order, status: value })}
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
            <Button type="submit">{isNew ? "Add" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
