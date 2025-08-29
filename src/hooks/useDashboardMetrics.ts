import { UserContext } from "@/context";
import { useContext } from "react";
import { useFetchData } from "./useFetch";
import type { MultiYearEarningLineChartProps } from "@/components/custom/dashboard/LineCharts";

export const useRevenueBarChart = () => {
  const { id, managerId, role } = useContext(UserContext);

  const now = new Date();
  const endDate = now.toISOString();
  const startDate = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate()
  ).toISOString();

  const queryParams: Record<string, string> = {
    start: startDate,
    end: endDate,
  };

  if (role === "manager") {
    queryParams.managerId = managerId!;
  }

  return useFetchData<{ [month: string]: number }>(
    "revenuebarchart",
    `revenue?${new URLSearchParams(queryParams).toString()}`
  );
};

export const useEarningLineChart = ({
  year1,
  year2,
}: {
  year1: string;
  year2: string;
}) => {
  const { id, managerId, role } = useContext(UserContext);

  const { start: startDate1, end: endDate1 } = getYearRange(year1);
  const { start: startDate2, end: endDate2 } = getYearRange(year2);

  const queryParams: Record<string, string> = {
    year1_start: startDate1,
    year1_end: endDate1,
    year2_start: startDate2,
    year2_end: endDate2,
  };

  if (role === "manager" && managerId) {
    queryParams.managerId = managerId;
  }

  return useFetchData<MultiYearEarningLineChartProps>(
    ["earningLineChart", year1, year2, role],
    `earnings?${new URLSearchParams(queryParams).toString()}`
  );
};

const getYearRange = (year: string) => {
  const start = new Date(Number(year), 0, 1).toISOString();
  const end = new Date(Number(year), 11, 31, 23, 59, 59).toISOString();
  return { start, end };
};

export const useMetricsComparison = ({
  year1,
  year2,
}: {
  year1: string;
  year2: string;
}) => {
  const { id, managerId, role } = useContext(UserContext);

  const { start: startDate1, end: endDate1 } = getYearRange(year1);
  const { start: startDate2, end: endDate2 } = getYearRange(year2);

  const queryParams: Record<string, string> = {
    year1_start: startDate1,
    year1_end: endDate1,
    year2_start: startDate2,
    year2_end: endDate2,
  };

  if (role === "manager" && managerId) {
    queryParams.managerId = managerId;
  }

  return useFetchData<any>(
    ["metricsComparison", year1, year2, role],
    `metricsComparison?${new URLSearchParams(queryParams).toString()}`
  );
};
