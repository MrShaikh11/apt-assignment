import OrdersTable from "@/components/OrdersTable";
import LatestUpdates from "@/components/LatestUpdates";

export default function DashboardPage() {
  return (
    <section className="w-full p-4 sm:p-12 flex flex-col sm:flex-row gap-6">
      {/* Orders Table */}
      <div className="flex-1">
        <OrdersTable />
      </div>

      {/* Latest Updates */}
      <div className="w-full sm:w-[380px] shrink-0">
        <LatestUpdates title="Latest Updates" />
      </div>
    </section>
  );
}
