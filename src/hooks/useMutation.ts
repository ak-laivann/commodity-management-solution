import { UserContext } from "@/context";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useContext } from "react";

export const useMutateData = <Data, Variables>(
  url: string | ((variables: Variables) => string),
  options?: Omit<UseMutationOptions<Data, Error, Variables>, "mutationFn">,
  method?: string
) => {
  const { role, managerId, id } = useContext(UserContext);

  return useMutation<Data, Error, Variables>({
    mutationFn: async (variables: Variables) => {
      const resolvedUrl = typeof url === "function" ? url(variables) : url;
      const res = await fetch(`/api/v1/${resolvedUrl}`, {
        method: method ?? "POST",
        headers: {
          "Content-Type": "application/json",
          useMirage: "true",
        },
        body: JSON.stringify(variables),
      });
      if (!res.ok) throw new Error(`Mutation error: ${res.status}`);
      return (await res.json()) as Data;
    },
    onMutate: async (data: any) => {
      if (typeof data === "object" && data !== null) {
        if (role === "manager") {
          data.managerId = managerId || id;
        } else {
          data.managerId = managerId;
          data.storeOwnerId = id;
        }
      }
      return data;
    },
    ...options,
  });
};
