import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ChartNoAxesColumn } from "lucide-react";

export function StatCard({
  title,
  total,
}: {
  title: string;
  total: string | number;
}) {
  return (
    <Card className="p-4">
      <CardHeader className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          &emsp;
          <div className="flex items-center justify-center w-10 h-10 border shadow-sm">
            <ChartNoAxesColumn className="w-5 h-5" />
          </div>
        </div>

        <CardTitle className="text-2xl font-bold">$ {total}</CardTitle>

        <div className="flex items-center text-sm mt-1 text-muted-foreground">
          Trending <TrendingUp className="w-4 h-4 ml-1" />
        </div>
      </CardHeader>
    </Card>
  );
}
