"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import OrdersTable from "@/components/OrdersTable";
import LatestUpdates from "@/components/LatestUpdates";

export default function DashboardPage() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders_history")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(50); // adjust as needed
      if (!error && data) setUpdates(data);
      setLoading(false);
    };

    fetchUpdates();

    const channel = supabase
      .channel("orders-history-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders_history" },
        (payload) => {
          setUpdates((prev) => [payload.new, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [supabase]);

  return (

    <section className="w-full p-6 md:p-12 flex flex-col md:flex-row gap-6">
      {/* Orders Table */}
      <div className="w-full sm:flex-1 mb-6 sm:mb-0">
        <OrdersTable orders={updates} loading={loading} />
      </div>



      {/* Latest Updates */}
      <div className="w-full sm:max-w-[380px] max-w-full overflow-x-auto">
        <LatestUpdates updates={updates.slice(0, 5)} loading={loading} />
      </div>
    </section>
  );
}
