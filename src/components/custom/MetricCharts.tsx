import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

export const MetricCharts = ({
  title,
  data,
  color,
  startDate,
  endDate,
  total,
}: {
  title: string;
  data: any[];
  color: string;
  startDate: string;
  endDate: string;
  total: any;
}) => {
  const sortedData = data
    .map((d) => ({
      ...d,
      timestamp: new Date(d.date).getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime();

  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  });

  const getMonthlyTicks = (start: number, end: number) => {
    const ticks: number[] = [];
    const current = new Date(start);
    current.setDate(1);

    while (current.getTime() <= end) {
      ticks.push(current.getTime());
      current.setMonth(current.getMonth() + 1);
    }

    return ticks;
  };

  const ticks = getMonthlyTicks(startTimestamp, endTimestamp);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardTitle>+{total}</CardTitle>
        <div className="flex items-center text-sm mt-2 text-muted-foreground">
          Trending <TrendingUp className="w-4 h-4 ml-1" />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <LineChart data={sortedData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={[startTimestamp, endTimestamp]}
              ticks={ticks}
              tickFormatter={(value) => monthFormatter.format(new Date(value))}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Line dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export const aggregateChartData = (series: any[]) => {
  const map: Record<string, number> = {};
  series.forEach((s) =>
    s.data.forEach((d: any) => {
      map[d.date] = (map[d.date] || 0) + d.value;
    })
  );
  return Object.entries(map).map(([date, value]) => ({ date, value }));
};
