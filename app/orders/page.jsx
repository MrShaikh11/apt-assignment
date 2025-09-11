
import OrdersTable from "@/components/OrdersTable"
import LatestUpdates from "@/components/LatestUpdates"

export default function DashboardPage() {
  return (
    <section className="w-full p-12 flex gap-6">
      {/* Orders Table */}
      <div className="flex-1">
        <OrdersTable />
      </div>

      {/* Latest Updates*/}
      <div className="w-[380px] shrink-0">
        <LatestUpdates title="Latest Updates" />
      </div>
    </section>
  )
}
