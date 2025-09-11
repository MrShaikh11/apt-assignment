"use client";

import { Card, CardContent } from "@/components/ui/card";
import LatestUpdatesSkeleton from "./ui/LatestUpdatesSkeleton";
import { generateMessage, getCardBgColor } from "@/lib/utils";

const LatestUpdates = ({ updates = [], loading = false }) => {
  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Latest Updates</h1>
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
