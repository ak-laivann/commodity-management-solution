import { AsyncUIWrapper, RevenueBarChart } from "@/components/custom";
import { useRevenueBarChart } from "@/hooks/useDashboardMetrics";
import { EarningsAndSubscriptions } from "./Dashboard/EarningsAndSubscriptions";
import { MetricsComparisonPage } from "./Dashboard/MetricsComparison";
import { StatCardsPage } from "./Dashboard/StatCards";

export const DashboardPage = () => {
  const { data, isError, isLoading, error } = useRevenueBarChart();

  return (
    <>
      <StatCardsPage />
      <br />
      <AsyncUIWrapper isError={isError} isLoading={isLoading} error={error}>
        <RevenueBarChart data={data!} />
      </AsyncUIWrapper>
      <br />
      <EarningsAndSubscriptions />
      <br />
      <MetricsComparisonPage />
    </>
  );
};
