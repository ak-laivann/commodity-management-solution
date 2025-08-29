import {
  AsyncUIWrapper,
  ComparisonLineChart,
  SubscriptionBarChart,
} from "@/components/custom";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMetricsComparison } from "@/hooks/useDashboardMetrics";

export const MetricsComparisonPage = () => {
  const [year1, setYear1] = useState("2025");
  const [year2, setYear2] = useState("2024");

  const years = ["2024", "2025"];
  const { data, isLoading, isError, error } = useMetricsComparison({
    year1,
    year2,
  });

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

      <AsyncUIWrapper isLoading={isLoading} isError={isError} error={error}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ComparisonLineChart
            color1="red"
            color2="blue"
            title="Total Earning"
            data1={data?.revenue?.year1}
            data2={data?.revenue?.year2}
            total={data?.totals?.revenue?.year1}
            year1Label={year1}
            year2Label={year2}
          />
          <ComparisonLineChart
            color1="red"
            color2="blue"
            title="Total Sales"
            data1={data?.sales?.year1}
            data2={data?.sales?.year2}
            total={data?.totals?.sales?.year1}
            year1Label={year1}
            year2Label={year2}
          />
          <ComparisonLineChart
            color1="red"
            color2="blue"
            title="Total Views"
            data1={data?.views?.year1}
            data2={data?.views?.year2}
            total={data?.totals?.views?.year1}
            year1Label={year1}
            year2Label={year2}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <SubscriptionBarChart data={data?.subscriptions ?? {}} />
          </div>
        </div>
      </AsyncUIWrapper>
    </>
  );
};
