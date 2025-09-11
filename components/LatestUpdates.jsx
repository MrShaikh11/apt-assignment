"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import LatestUpdatesSkeleton from "./ui/LatestUpdatesSkeleton";
import { generateMessage, getCardBgColor } from "@/lib/utils";



const LatestUpdates = ({ title }) => {
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
        .limit(6);

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
          setUpdates((prev) => [payload.new, ...prev].slice(0, 6));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [supabase]);



  return (
    <div>
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      {loading ? (
        <LatestUpdatesSkeleton />
      ) : (
        <div className="flex flex-col gap-3">
          {updates.map((item) => (
            <Card
              key={`${item.order_id}-${item.updated_at}`}
              className={`flex items-center gap-4 p-2 ${getCardBgColor(item)}`}
            >
              <CardContent className="p-0 flex-1">
                <p className="text-sm">{generateMessage(item)}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.updated_at).toLocaleString()}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestUpdates;
