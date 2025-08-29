import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export type MultiYearEarningLineChartProps = {
  data: { [year: string]: { [month: string]: number } };
  total: number;
  currentWeek?: { [month: string]: number };
  currentWeekTotal?: number;
  subscriptions?: any;
};
export const MultiYearEarningLineChart = ({
  data,
  total,
}: MultiYearEarningLineChartProps) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Total Earning</CardTitle>
          <CardTitle>+{total || 0}</CardTitle>
          <div className="flex items-center text-sm mt-2 text-muted-foreground">
            No data available
          </div>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center text-muted-foreground">
          No earnings data found
        </CardContent>
      </Card>
    );
  }

  const months = Object.keys(Object.values(data)[0] || {});
  const chartData = months.map((month) => {
    const row: Record<string, any> = { month };
    for (const year in data) {
      row[year] = data[year][month] ?? 0;
    }
    return row;
  });

  const yearKeys = Object.keys(data);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total Earning</CardTitle>
        <CardTitle>+{total}</CardTitle>
        <div className="flex items-center text-sm mt-2 text-muted-foreground">
          Trending <TrendingUp className="w-4 h-4 ml-1" />
        </div>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
            {yearKeys.map((year, index) => (
              <Line
                key={year}
                type="monotone"
                dataKey={year}
                stroke={index === 1 ? "#12B76A" : "#B4E2CD"}
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const ComparisonLineChart = ({
  title,
  data1,
  data2,
  color1,
  color2,
  year1Label,
  year2Label,
  total,
}: {
  title: string;
  data1: Record<string, number>;
  data2: Record<string, number>;
  color1: string;
  color2: string;
  year1Label: string; // e.g. "2024"
  year2Label: string; // e.g. "2025"
  total: any;
}) => {
  const mergedData = MONTHS.map((month) => ({
    month,
    year1: data1[month] || 0,
    year2: data2[month] || 0,
  }));

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
          <LineChart data={mergedData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" />
            <YAxis hide />
            <Legend />
            <Line
              type="linear"
              dataKey="year1"
              stroke={color1}
              strokeWidth={2}
              dot={false}
              name={year1Label}
            />
            <Line
              type="linear"
              dataKey="year2"
              stroke={color2}
              strokeWidth={2}
              dot={false}
              name={year2Label}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
