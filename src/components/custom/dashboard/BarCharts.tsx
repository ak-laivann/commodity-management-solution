import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RevenueChartProps = {
  data: { [month: string]: number };
};

export const RevenueBarChart = ({ data }: RevenueChartProps) => {
  const chartData = Object.entries(data).map(([month, value]) => ({
    month,
    revenue: value,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip
              formatter={(value) => [
                `$${Math.round((value as number) / 1000)}k`,
                "Revenue",
              ]}
            />
            <Bar
              dataKey="revenue"
              fill="var(--chart-3)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const RevenueBarChartMinimal = ({
  data,
  total,
}: RevenueChartProps & { total: number }) => {
  const chartData = Object.entries(data).map(([month, value]) => ({
    month,
    revenue: value,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total Earning</CardTitle>
        <CardTitle>$ {total}</CardTitle>
        <div className="flex items-center text-sm mt-2 text-muted-foreground">
          Trending <TrendingUp className="w-4 h-4 ml-1" />
        </div>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <Bar
              dataKey="revenue"
              fill="var(--chart-4)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

type WeeklyRevenueChartProps = {
  data: { [day: string]: number };
};

export const WeeklyRevenueBarChart = ({
  data,
  total,
}: WeeklyRevenueChartProps & { total: number }) => {
  const chartData = Object.entries(data).map(([day, value]) => ({
    day,
    revenue: value,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total Earning (This Week)</CardTitle>
        <CardTitle>$ {total}</CardTitle>
        <div className="flex items-center text-sm mt-2 text-muted-foreground">
          Trending <TrendingUp className="w-4 h-4 ml-1" />
        </div>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip
              formatter={(value) => [
                `$${Math.round((value as number) / 1000)}k`,
                "Revenue",
              ]}
            />
            <Bar
              dataKey="revenue"
              fill="var(--chart-5)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

type SubscriptionChartProps = {
  data: { [month: string]: number };
};

export const SubscriptionBarChart = ({ data }: SubscriptionChartProps) => {
  const chartData = Object.entries(data).map(([month, value]) => ({
    month,
    subscriptions: value,
  }));

  const totalSubscriptions = Object.values(data).reduce(
    (sum, val) => sum + val,
    0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Subscriptions Performers</CardTitle>
        <p className="text-sm text-muted-foreground">Followers this year</p>
        <br />
        <div className="flex items-center justify-center">
          <CardTitle className="text-6xl">+{totalSubscriptions}</CardTitle>
          <ArrowUp className="w-5 h-5 text-green-500" />
        </div>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <Bar
              dataKey="subscriptions"
              fill="var(--chart-6)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
