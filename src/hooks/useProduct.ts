import type { Product } from "@/components/props";
import { useFetchData } from "./useFetch";
import { useMutateData } from "./useMutation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "@/context";

export const useFetchProducts = (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = "",
  sort: { type: "views" | "pricing" | "revenue"; order: "asc" | "desc" } | null
) => {
  const { id, managerId, role } = useContext(UserContext);

  const queryParams: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (searchTerm) queryParams.search = searchTerm;
  if (sort) {
    queryParams.sortField = sort.type;
    queryParams.sortOrder = sort.order;
  }

  if (role === "manager") {
    queryParams.managerId = managerId || id;
  } else {
    queryParams.storeOwnerId = id;
  }

  return useFetchData<any>(
    ["products", page, limit, searchTerm, JSON.stringify(sort), role, id],
    `products?${new URLSearchParams(queryParams).toString()}`,
    { refetchOnMount: true }
  );
};

export const useFetchProductMetrics = () => {
  const { id, managerId, role } = useContext(UserContext);

  const now = new Date();
  const endDate = now.toISOString();
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth() - 2,
    now.getDate()
  ).toISOString();

  const params: Record<string, string> = { start: startDate, end: endDate };

  if (role === "manager") params.managerId = managerId || id;
  else params.storeOwnerId = id;

  return useFetchData<any>(
    ["products-metrics", role, id],
    `products/metrics?${new URLSearchParams(params).toString()}`,
    { refetchOnMount: true }
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

  return useMutateData<Product, {}>(
    `products/${productId}`,
    {
      onSuccess: () => {
        toast.success("Product updated successfully");
        navigate("/products/all");
      },
      onError: () => {
        toast.error("Failed to update product");
      },
    },
    "PUT"
  );
};

export const useDeleteProduct = () => {
  return useMutateData<Product, string>(
    (productId) => `products/${productId}`,
    {
      onError: (e) => {
        toast.error(`Failed to delete: ${e.message}`);
        console.log(e);
      },
    },
    "DELETE"
  );
};

export const useGetProduct = (id: string) => {
  const { id: userId, managerId, role } = useContext(UserContext);

  const params: Record<string, string> = {};
  if (role === "manager") params.managerId = managerId || userId;
  else params.storeOwnerId = userId;

  return useFetchData<Product>(
    ["product", id, role, userId],
    `products/${id}?${new URLSearchParams(params).toString()}`,
    { refetchOnMount: true }
  );
};
