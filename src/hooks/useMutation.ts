import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useMutateData = <Data, Variables>(
  url: string,
  options?: Omit<UseMutationOptions<Data, Error, Variables>, "mutationFn">
) => {
  return useMutation<Data, Error, Variables>({
    mutationFn: async (variables: Variables) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          useMirage: "true",
        },
        body: JSON.stringify(variables),
      });
      if (!res.ok) throw new Error(`Mutation error: ${res.status}`);
      return (await res.json()) as Data;
    },
    ...options,
  });
};
