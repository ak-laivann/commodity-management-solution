import {
  AsyncUIWrapper,
  MetricCharts,
  aggregateChartData,
} from "@/components/custom";
import { useFetchProductMetrics } from "@/hooks";

export const ProductListingChart = () => {
  const { data, isLoading, isError, error } = useFetchProductMetrics();

  const salesData = (data?.timeseries ?? []).filter(
    (t: any) => t.metric === "SALES"
  );
  const revenueData = (data?.timeseries ?? []).filter(
    (t: any) => t.metric === "REVENUE"
  );
  const viewsData = (data?.timeseries ?? []).filter(
    (t: any) => t.metric === "VIEWS"
  );

  const startDate = data?.startDate ?? Date.now().toLocaleString();
  const endDate = data?.endDate ?? Date.now().toLocaleString();

  return (
    <AsyncUIWrapper isError={isError} error={error} isLoading={isLoading}>
      <div className="space-y-4">
        <MetricCharts
          startDate={startDate}
          endDate={endDate}
          title="Total Views"
          data={aggregateChartData(viewsData)}
          // using the color from the index.css
          color="var(--chart-1)"
          total={data?.totalViews ?? 0}
        />
        <MetricCharts
          startDate={startDate}
          endDate={endDate}
          title="Total Sales"
          data={aggregateChartData(salesData)}
          // using the color from the index.css
          color="var(--chart-2)"
          total={data?.totalSales ?? 0}
        />
        <MetricCharts
          startDate={startDate}
          endDate={endDate}
          title="Total Revenue"
          data={aggregateChartData(revenueData)}
          // using the color from the index.css
          color="var(--chart-3)"
          total={data?.totalRevenue ?? 0}
        />
      </div>
    </AsyncUIWrapper>
  );
};
