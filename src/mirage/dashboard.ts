import { faker } from "@faker-js/faker";
import { Response, type Registry } from "miragejs";
import type { RouteHandler } from "miragejs/server";
import type { ModelRegistry } from "./MirageModels";
import type { TimeSeries_Product } from "@/components/props";

export function getSubscription(managerId?: string): any {
  const data: { date: string; value: number }[] = [];

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 18);
  const endDate = new Date();

  const iterations = faker.number.int({ min: 20, max: 60 });

  for (let i = 0; i < iterations; i++) {
    const randomDate = faker.date.between({ from: startDate, to: endDate });

    const value = faker.number.int({ min: 1, max: 5 });

    data.push({
      date: randomDate.toISOString().split("T")[0],
      value,
    });
  }

  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    managerId: managerId ?? faker.database.mongodbObjectId(),
    data,
  };
}

export const mockGetRevenueForDashboard: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const { start, end, managerId } = request.queryParams;
  const startDate = new Date(start as string);
  const endDate = new Date(end as string);

  let timeseries = schema.all("timeseriesproduct").models.map((m) => m.attrs);
  if (managerId) {
    timeseries = (timeseries as TimeSeries_Product[]).filter(
      (ts) => ts.managerId === managerId && ts.metric === "REVENUE"
    );
  }

  const revenueByMonth: { [monthYear: string]: number } = {};

  (timeseries as TimeSeries_Product[]).forEach((ts) => {
    ts.data.forEach(({ date, value }: { date: string; value: number }) => {
      const d = new Date(date);

      if (d >= startDate && d <= endDate) {
        const monthYear = `${d.toLocaleString("default", {
          month: "short",
        })}${d.getFullYear()}`;

        revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + value;
      }
    });
  });

  const sortedEntries = Object.entries(revenueByMonth).sort(([a], [b]) => {
    const toDate = (s: string) => {
      const match = s.match(/^([A-Za-z]+)(\d{4})$/);
      const monthIndex = new Date(`${match?.[1]} 1, ${match?.[2]}`).getMonth();
      return new Date(Number(match?.[2]), monthIndex, 1).getTime();
    };

    return toDate(a) - toDate(b);
  });

  return Object.fromEntries(sortedEntries);
};

export const mockGetEarnings: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const { year1_start, year1_end, year2_start, year2_end, managerId } =
    request.queryParams;

  const yearRanges = [
    {
      start: new Date(year1_start as string),
      end: new Date(year1_end as string),
    },
    {
      start: new Date(year2_start as string),
      end: new Date(year2_end as string),
    },
  ];

  let timeseries = schema.all("timeseriesproduct").models.map((m) => m.attrs);

  timeseries = (timeseries as TimeSeries_Product[]).filter(
    (ts) =>
      ts.metric === "REVENUE" && (!managerId || ts.managerId === managerId)
  );

  const earningsByYear: Record<string, Record<string, number>> = {};

  (timeseries as TimeSeries_Product[]).forEach((ts) => {
    ts.data.forEach(({ date, value }: { date: string; value: number }) => {
      const d = new Date(date);

      for (const range of yearRanges) {
        if (d >= range.start && d <= range.end) {
          const year = d.getFullYear().toString();
          const month = d.toLocaleString("default", { month: "short" });

          if (!earningsByYear[year]) {
            earningsByYear[year] = {};
          }
          earningsByYear[year][month] =
            (earningsByYear[year][month] || 0) + value;
        }
      }
    });
  });

  Object.keys(earningsByYear).forEach((year) => {
    const sortedEntries = Object.entries(earningsByYear[year]).sort(
      ([a], [b]) =>
        new Date(`${a} 1, ${year}`).getMonth() -
        new Date(`${b} 1, ${year}`).getMonth()
    );
    earningsByYear[year] = Object.fromEntries(sortedEntries);
  });

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const currentWeek: Record<string, number> = {};

  (timeseries as TimeSeries_Product[]).forEach((ts) => {
    ts.data.forEach(({ date, value }: { date: string; value: number }) => {
      const d = new Date(date);
      if (d >= startOfWeek && d <= endOfWeek) {
        const day = d.toLocaleString("default", { weekday: "short" });
        currentWeek[day] = (currentWeek[day] || 0) + value;
      }
    });
  });

  const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const sortedWeekEntries = Object.entries(currentWeek).sort(
    ([a], [b]) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

  let subscriptions = schema.all("subscription").models.map((i) => i.attrs);

  subscriptions = (subscriptions as SubscriptionTimeSeries[]).filter(
    (subscription) => subscription.managerId === managerId
  );

  const subscriptionsByMonth: Record<string, number> = {};
  const year1Range = yearRanges[0];

  (subscriptions as SubscriptionTimeSeries[]).forEach((ts) => {
    ts.data.forEach(({ date, value }) => {
      const d = new Date(date);
      if (d >= year1Range.start && d <= year1Range.end) {
        const month = d.toLocaleString("default", { month: "short" });
        subscriptionsByMonth[month] =
          (subscriptionsByMonth[month] || 0) + value;
      }
    });
  });

  const sortedSubscriptions = Object.fromEntries(
    Object.entries(subscriptionsByMonth).sort(
      ([a], [b]) =>
        new Date(`${a} 1, ${year1Range.start.getFullYear()}`).getMonth() -
        new Date(`${b} 1, ${year1Range.start.getFullYear()}`).getMonth()
    )
  );

  return {
    data: earningsByYear,
    currentWeek: Object.fromEntries(sortedWeekEntries),
    total: Object.values(earningsByYear)
      .flatMap((m) => Object.values(m))
      .reduce((sum, v) => sum + v, 0),
    currentWeekTotal: sortedWeekEntries.reduce(
      (sum, [, value]) => sum + value,
      0
    ),
    subscriptions: sortedSubscriptions,
  };
};

export const mockGetMetricsComparison: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const queryParams = new URLSearchParams(request.queryParams as any);
  const year1_start = new Date(queryParams.get("year1_start") as string);
  const year1_end = new Date(queryParams.get("year1_end") as string);
  const year2_start = new Date(queryParams.get("year2_start") as string);
  const year2_end = new Date(queryParams.get("year2_end") as string);
  const managerId = queryParams.get("managerId");
  const storeOwnerId = queryParams.get("storeOwnerId");

  let timeseries = schema.all("timeseriesproduct").models.map((m) => m.attrs);

  // Filter by managerId or storeOwnerId
  timeseries = timeseries.filter((ts: any) => {
    if (managerId) return ts.managerId === managerId;
    if (storeOwnerId) return ts.storeOwnerIds?.includes(storeOwnerId);
    return true;
  });

  // Initialize result object
  const result: any = {
    sales: { year1: {}, year2: {} },
    revenue: { year1: {}, year2: {} },
    views: { year1: {}, year2: {} },
    totals: {
      sales: { year1: 0, year2: 0 },
      revenue: { year1: 0, year2: 0 },
      views: { year1: 0, year2: 0 },
    },
  };

  // Process each metric series
  ["SALES", "REVENUE", "VIEWS"].forEach((metric) => {
    const metricSeries = timeseries.filter((ts: any) => ts.metric === metric);

    ["year1", "year2"].forEach((yearKey, idx) => {
      const rangeStart = idx === 0 ? year1_start : year2_start;
      const rangeEnd = idx === 0 ? year1_end : year2_end;

      metricSeries.forEach((ts: any) => {
        ts.data.forEach((d: any) => {
          const date = new Date(d.date);
          if (date >= rangeStart && date <= rangeEnd) {
            const month = date.toLocaleString("default", { month: "short" });
            const lowercase = metric.toLowerCase();

            result[lowercase][yearKey][month] =
              (result[lowercase][yearKey][month] || 0) + d.value;

            result.totals[lowercase][yearKey] += d.value;
          }
        });
      });

      // Ensure all 12 months exist, even if 0
      const months = [
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
      months.forEach((m) => {
        if (!result[metric.toLowerCase()][yearKey][m]) {
          result[metric.toLowerCase()][yearKey][m] = 0;
        }
      });

      // Sort months correctly
      result[metric.toLowerCase()][yearKey] = Object.fromEntries(
        months.map((m) => [m, result[metric.toLowerCase()][yearKey][m]])
      );
    });
  });

  let subscriptions = schema.all("subscription").models.map((i) => i.attrs);

  subscriptions = (subscriptions as SubscriptionTimeSeries[]).filter(
    (subscription) => subscription.managerId === managerId
  );

  const subscriptionsByMonth: Record<string, number> = {};
  const year1Range = {
    start: year1_start,
    end: year1_end,
  };

  (subscriptions as SubscriptionTimeSeries[]).forEach((ts) => {
    ts.data.forEach(({ date, value }) => {
      const d = new Date(date);
      if (d >= year1Range.start && d <= year1Range.end) {
        const month = d.toLocaleString("default", { month: "short" });
        subscriptionsByMonth[month] =
          (subscriptionsByMonth[month] || 0) + value;
      }
    });
  });

  const sortedSubscriptions = Object.fromEntries(
    Object.entries(subscriptionsByMonth).sort(
      ([a], [b]) =>
        new Date(`${a} 1, ${year1Range.start.getFullYear()}`).getMonth() -
        new Date(`${b} 1, ${year1Range.start.getFullYear()}`).getMonth()
    )
  );

  return {
    ...result,
    year1: { start: year1_start.toISOString(), end: year1_end.toISOString() },
    year2: { start: year2_start.toISOString(), end: year2_end.toISOString() },
    subscriptions: sortedSubscriptions,
  };
};

export interface SubscriptionTimeSeries {
  managerId: string;
  data: { date: string; value: number }[];
}
