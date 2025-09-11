"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"

const LatestUpdates = ({ title }) => {
  const [updates, setUpdates] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const fetchUpdates = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, product_name, status, updated_at")
        .order("updated_at", { ascending: false })
        .limit(6)

      if (!error && data) {
        setUpdates(data)
      }
    }

    fetchUpdates()

    // Realtime subscription
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const deleted = payload.old
            const message = {
              id: deleted.id,
              customer_name: deleted.customer_name ?? "Unknown customer",
              product_name: deleted.product_name ?? "unknown product",
              status: "deleted",
              updated_at: new Date().toISOString(),
              eventType: "DELETE",
            }
            setUpdates((prev) => [message, ...prev].slice(0, 6))
          } else if (payload.new) {
            const eventType = payload.eventType || "INSERT"
            const message = { ...payload.new, eventType }
            setUpdates((prev) => [message, ...prev].slice(0, 6))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const generateMessage = (order) => {
    if (order.status === "shipped") {
      return `${order.customer_name}'s order for ${order.product_name} has been shipped.`
    }
    if (order.status === "pending") {
      return `${order.customer_name} placed a new order for ${order.product_name} (pending).`
    }
    if (order.status === "cancelled") {
      return `${order.customer_name}'s order for ${order.product_name} was cancelled.`
    }
    if (order.status === "deleted") {
      return `${order.customer_name}'s order for ${order.product_name} was deleted from the system.`
    }
    return `${order.customer_name}'s order for ${order.product_name} is now ${order.status}.`
  }

  // Function to determine card background color based on event type
  const getCardBgColor = (order) => {
    switch (order.status) {
      case "deleted":
        return "bg-red-200"
      case "shipped":
        return "bg-green-200"
      case "pending":
        return "bg-blue-200"
      default:
        return "bg-white"
    }
  }

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-3">
        {updates.map((item) => (
          <Card
            key={`${item.id}-${item.status}-${item.updated_at}`}
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
    </div>
  )
}

export default LatestUpdates
