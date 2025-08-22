import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const useFetchData = <T>(
  queryKey: string,
  url: string,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) => {
  return useQuery<T>({
    queryKey: [queryKey],
    queryFn: async () => {
      const res = await fetch(url, { headers: { useMirage: "true" } });
      if (!res.ok) {
        throw new Error(`Fetch error: ${res.status}`);
      }
      return (await res.json()) as T;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
};
