import { AsyncUIWrapper, ProductTable } from "@/components/custom";
import { useDeleteProduct, useFetchProducts } from "@/hooks/useProduct";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { Product_Creation_Status } from "@/components/props";
import { PaginationControls } from "@/components/custom";

export const ProductListingPage = () => {
  const [tab, setTab] = useState<Product_Creation_Status>(
    Product_Creation_Status.PUBLISHED
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useFetchProducts(page, limit);
  // const mutation = useDeleteProduct();

  const totalProducts = data?.[tab]?.length || 0;
  const totalPages = Math.ceil(60 / limit);

  return (
    <AsyncUIWrapper isLoading={isLoading} isError={isError} error={error}>
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as Product_Creation_Status)}
      >
        <TabsList>
          <TabsTrigger value={Product_Creation_Status.PUBLISHED}>
            Published
          </TabsTrigger>
          <TabsTrigger value={Product_Creation_Status.DRAFT}>Draft</TabsTrigger>
        </TabsList>

        <TabsContent value={Product_Creation_Status.PUBLISHED}>
          <ProductTable
            data={data?.[Product_Creation_Status.PUBLISHED] ?? []}
            onDelete={(id) => {
              // mutation.mutate(id)
            }}
          />
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </TabsContent>

        <TabsContent value={Product_Creation_Status.DRAFT}>
          <ProductTable
            data={data?.[Product_Creation_Status.DRAFT] ?? []}
            onDelete={(id) => {
              // mutation.mutate(id)
            }}
          />
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </TabsContent>
      </Tabs>
    </AsyncUIWrapper>
  );
};
