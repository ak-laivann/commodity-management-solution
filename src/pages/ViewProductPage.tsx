import { AsyncUIWrapper } from "@/components/custom";
import AddViewProduct from "@/components/custom/AddViewProduct";
import { useEditProduct, useGetProduct } from "@/hooks/useProduct";
import { useParams } from "react-router-dom";

export const ViewProductPage = () => {
  const { id } = useParams();
  const productMutation = useEditProduct(id!);
  const { data, isLoading, isError, error } = useGetProduct(id!);
  return (
    <AsyncUIWrapper isLoading={isLoading} isError={isError} error={error}>
      <AddViewProduct
        onSubmit={productMutation.mutate}
        onSaveAsDraft={productMutation.mutate}
        isViewPage
        viewProductData={data}
      />
    </AsyncUIWrapper>
  );
};
