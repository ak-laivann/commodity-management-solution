function App() {
  const [isFirstSet, setIsFirstSet] = useState(true);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="m-4">
        <ChartBarStacked />
      </div>
      <div className="flex flex-col items-center space-y-4 m-4">
        <Button onClick={() => setIsFirstSet((prev) => !prev)}>
          Change Users
        </Button>
      </div>
      <div className="m-4">
        <UsersList isFirstSet={isFirstSet} />
      </div>
    </div>
  );
}

export default App;

import { useQuery } from "@tanstack/react-query";

async function fetchUsers(isFirstSet = true) {
  const endpoint = isFirstSet ? "/users" : "/users_1";
  const res = await fetch(`http://localhost:3000/api/v1${endpoint}`);
  return res.json();
}

export function UsersList(props: { isFirstSet: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ["users", props.isFirstSet],
    queryFn: () => fetchUsers(props.isFirstSet),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (isLoading)
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );

  return (
    <div>
      <h2 className="text-xl font-bold">Users</h2>
      <ul className="mt-2">
        <h3 className="text-lg font-semibold">Manager</h3>
        {data.manager.map((u: any) => (
          <li key={u.id}>{u.name}</li>
        ))}
        <h3 className="text-lg font-semibold">Store Keepers</h3>
        {data.storekeepers.map((u: any) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "./components/ui/skeleton";
import { Button } from "./components/ui/button";
import { useState } from "react";

export const description = "A stacked bar chart with a legend";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function ChartBarStacked() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
