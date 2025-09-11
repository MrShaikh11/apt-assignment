import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

function OrdersTableSkeleton() {
    const skeletonRows = Array.from({ length: 5 }); // 5 placeholder rows

    return (
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
                {skeletonRows.map((_, idx) => (
                    <TableRow key={idx} className="h-12">
                        <TableCell>
                            <div className="h-6 w-full rounded animate-shimmer" />
                        </TableCell>
                        <TableCell>
                            <div className="h-6 w-full rounded animate-shimmer" />
                        </TableCell>
                        <TableCell>
                            <div className="h-6 w-full rounded animate-shimmer" />
                        </TableCell>
                        <TableCell>
                            <div className="h-6 w-full rounded animate-shimmer" />
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="h-6 w-full rounded animate-shimmer" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
export default OrdersTableSkeleton