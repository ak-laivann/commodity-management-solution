import {
  AsyncUIWrapper,
  ProductTable,
  PaginationControls,
} from "@/components/custom";
import { useDeleteProduct, useFetchProducts } from "@/hooks/useProduct";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Product_Creation_Status } from "@/components/props";
import { Button } from "@/components/ui/button";
import { Download, Filter, Plus } from "lucide-react";
import { ProductListingChart } from "./ProductListingCharts";
import { Excel } from "antd-table-saveas-excel";
import { toast } from "react-toastify";

interface IExcelColumn {
  title: string;
  dataIndex: string | string[];
  excelRender?: (value: any, row: any) => any;
}

export const ProductListingPage = () => {
  const [tab, setTab] = useState<Product_Creation_Status>(
    Product_Creation_Status.PUBLISHED
  );
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const [sort, setSort] = useState<{
    type: "views" | "pricing" | "revenue";
    order: "asc" | "desc" | "normal";
  }>({ type: "views", order: "normal" });

  const mutation = useDeleteProduct();

  useEffect(() => {
    if (searchTerm !== lastSearchTerm) {
      setPage(1);
      setLastSearchTerm(searchTerm);
    }
  }, [searchTerm, lastSearchTerm]);

  const { data, isLoading, isError, error, refetch } = useFetchProducts(
    page,
    limit,
    searchTerm,
    sort.order === "normal" ? null : { type: sort.type, order: sort.order }
  );

  const totalProducts = data?.total?.[tab] || 0;
  const totalPages = Math.ceil(totalProducts / limit);

  function onDeleteSuccess() {
    toast.warn("Product Deleted Successfully");
    refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => navigate("/products/add")}>
          <Plus className="w-4 h-4 mr-2" /> Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <Tabs
              value={tab}
              onValueChange={(value) =>
                setTab(value as Product_Creation_Status)
              }
            >
              <CardHeader className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value={Product_Creation_Status.PUBLISHED}>
                    Published
                  </TabsTrigger>
                  <TabsTrigger value={Product_Creation_Status.DRAFT}>
                    Draft
                  </TabsTrigger>
                </TabsList>

                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onDownload({ data })}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <AsyncUIWrapper
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                >
                  <TabsContent value={Product_Creation_Status.PUBLISHED}>
                    <ProductTable
                      data={data?.[Product_Creation_Status.PUBLISHED] ?? []}
                      onDelete={(id) => {
                        mutation.mutate(id, {
                          onSuccess: onDeleteSuccess,
                        });
                      }}
                      disableDelete={mutation.isPending}
                      sortConfig={sort}
                      onSortChange={(newSort) => {
                        setSort(newSort ?? { type: "views", order: "normal" });
                        setPage(1);
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
                      onDelete={(id) => mutation.mutate(id)}
                      disableDelete={mutation.isPending}
                      sortConfig={sort}
                      onSortChange={(newSort) => {
                        setSort(newSort ?? { type: "views", order: "normal" });
                        setPage(1);
                      }}
                    />
                    <PaginationControls
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </TabsContent>
                </AsyncUIWrapper>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        <div>
          <ProductListingChart />
        </div>
      </div>
    </div>
  );
};

const onDownload = ({ data }: { data: any }) => {
  if (!data) return;

  const excel = new Excel();

  excel
    .addSheet("Published Products")
    .addColumns(excelColumns)
    .addDataSource(data[Product_Creation_Status.PUBLISHED] ?? []);

  excel
    .addSheet("Draft Products")
    .addColumns(excelColumns)
    .addDataSource(data[Product_Creation_Status.DRAFT] ?? []);

  const date = new Date();
  excel.saveAs(
    `ProductListing-${date.toLocaleDateString()}-${date.toLocaleTimeString()}.xlsx`
  );
};

const excelColumns: IExcelColumn[] = [
  { title: "Product Name", dataIndex: "productName" },
  { title: "Category", dataIndex: "productCategory" },
  { title: "Description", dataIndex: "productDescription" },
  {
    title: "Tags",
    dataIndex: "tags",
    excelRender: (tags: string[]) => tags.join(", "),
  },
  { title: "Price", dataIndex: ["pricing", "price"] },
  { title: "Discount", dataIndex: ["pricing", "discount"] },
  { title: "Views", dataIndex: "views" },
  { title: "Revenue", dataIndex: "revenue" },
];
