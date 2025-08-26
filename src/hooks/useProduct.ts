import type { Product } from "@/components/props";
import { useFetchData } from "./useFetch";
import { useMutateData } from "./useMutation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const useFetchProducts = (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = "",
  sort: { type: "views" | "pricing" | "revenue"; order: "asc" | "desc" } | null
) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(searchTerm ? { search: searchTerm } : {}),
    ...(sort ? { sortField: sort.type, sortOrder: sort.order } : {}),
  }).toString();

  return useFetchData<any>(
    ["products", page, limit, searchTerm, JSON.stringify(sort)],
    `products?${query}`,
    { refetchOnMount: true }
  );
};

export const useFetchProductMetrics = () => {
  const now = new Date();
  const endDate = now.toISOString();

  const startDate = new Date(
    now.getFullYear(),
    now.getMonth() - 2,
    now.getDate()
  ).toISOString();

  const queryString = new URLSearchParams({
    start: startDate,
    end: endDate,
  });

  return useFetchData<any>(
    "products-metrics",
    `products/metrics?${queryString.toString()}`,
    {
      refetchOnMount: true,
    }
  );
};

export const useAddProduct = (onSuccess: () => void) => {
  const mutation = useMutateData<Product, {}>("products", {
    onSuccess: () => {
      onSuccess();
      toast.success("Product added successfully");
    },
    onError: () => {
      toast.error("Failed to add product");
    },
  });

  return mutation;
};

export const useEditProduct = (productId: string) => {
  const navigate = useNavigate();
  const mutation = useMutateData<Product, {}>(
    `products/${productId}`,
    {
      onSuccess: () => {
        toast.success("Product updated successfully");
        navigate("/products");
      },
      onError: () => {
        toast.error("Failed to update product");
      },
    },
    "PUT"
  );

  return mutation;
};

export const useDeleteProduct = () => {
  const navigate = useNavigate();

  return useMutateData<Product, string>(
    (productId) => `products/${productId}`,
    {
      onError: (e) => {
        toast.error(`Failed to delete: ${e.message}`);
      },
    },
    "DELETE"
  );
};

export const useGetProduct = (id: string) => {
  return useFetchData<Product>("products", `products/${id}`, {
    refetchOnMount: true,
  });
};
