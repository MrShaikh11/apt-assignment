import { Card, CardContent } from "./card";

function LatestUpdatesSkeleton() {
    const skeletonItems = Array.from({ length: 6 });

    return (
        <div className="flex flex-col gap-3">
            {skeletonItems.map((_, idx) => (
                <Card key={idx} className="flex items-center gap-4 p-2">
                    <CardContent className="p-0 flex-1">
                        <div className="h-4 w-full rounded animate-shimmer mb-1" />
                        <div className="h-3 w-1/2 rounded animate-shimmer" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default LatestUpdatesSkeleton