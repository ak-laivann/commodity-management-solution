import type { Product } from "@/components/props";
import { useFetchData } from "./useFetch";
import { useMutateData } from "./useMutation";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export const useFetchProducts = (page: number = 1, limit: number = 10) => {
  return useFetchData<any>(
    ["products", page, limit],
    `products?page=${page}&limit=${limit}`
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

export const useDeleteProduct = (productId: string) => {
  return useMutateData<Product, {}>(
    `products/${productId}/delete`,
    {
      onSuccess: () => {
        toast.warn("Product Deleted Successfully");
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
