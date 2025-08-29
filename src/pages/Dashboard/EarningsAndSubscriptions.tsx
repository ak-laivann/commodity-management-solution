import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AsyncUIWrapper,
  ComparisonLineChart,
  MultiYearEarningLineChart,
  RevenueBarChartMinimal,
  WeeklyRevenueBarChart,
} from "@/components/custom";
import { useEarningLineChart } from "@/hooks/useDashboardMetrics";

export const EarningsAndSubscriptions = () => {
  const [year1, setYear1] = useState("2025");
  const [year2, setYear2] = useState("2024");

  const years = ["2024", "2025"];

  const {
    data: asd,
    isError: earningError,
    isLoading: earningLoading,
    error: earningErrorMessage,
  } = useEarningLineChart({ year1, year2 });

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl">Stats</h1> &emsp;
        <Select value={year1} onValueChange={setYear1}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">compared to</p>
        <Select value={year2} onValueChange={setYear2}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AsyncUIWrapper
        isLoading={earningLoading}
        isError={earningError}
        error={earningErrorMessage}
      >
        <div className="grid grid-cols-10 gap-6">
          <div className="col-span-6">
            <MultiYearEarningLineChart data={asd?.data!} total={asd?.total!} />
          </div>
          <div className="col-span-4">
            <RevenueBarChartMinimal
              data={asd?.data[year1]!}
              total={asd?.total!}
            />
          </div>
          <div className="col-span-6">
            <WeeklyRevenueBarChart
              data={asd?.currentWeek!}
              total={asd?.currentWeekTotal!}
            />
          </div>
          <div className="col-span-4">
            <ComparisonLineChart
              color1="red"
              color2="blue"
              data2={{}}
              data1={asd?.subscriptions!}
              title="Subscriptions"
              total={Object.values(asd?.subscriptions ?? []).reduce(
                (a: any, b: any) => a + b,
                0
              )}
              year1Label={year1}
              year2Label=" "
            />
          </div>
        </div>
      </AsyncUIWrapper>
    </>
  );
};
