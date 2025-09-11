import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getCardBgColor } from "@/lib/utils";

const UserOrdersTable = ({ orders, onEdit }) => {
    return (
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
                                onClick={() => onEdit(order)}
                            >
                                Edit
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default UserOrdersTable;
