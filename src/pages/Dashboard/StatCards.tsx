import { AsyncUIWrapper, StatCard } from "@/components/custom";
import { useMetricsComparison } from "@/hooks/useDashboardMetrics";

export const StatCardsPage = () => {
  const { isLoading, isError, error, data } = useMetricsComparison({
    year1: "2025",
    year2: "2024",
  });
  return (
    <AsyncUIWrapper isLoading={isLoading} isError={isError} error={error}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Earnings" total={data?.totals?.revenue?.year1} />
        <StatCard title="Total Views" total={data?.totals?.views?.year1} />
        <StatCard title="Total Sales" total={data?.totals?.sales?.year1} />
        <StatCard
          title="Subscriptions"
          // @ts-ignore
          total={Object.values(data?.subscriptions ?? []).reduce(
            (a: any, b: any) => a + b,
            0
          )}
        />
      </div>
    </AsyncUIWrapper>
  );
};
