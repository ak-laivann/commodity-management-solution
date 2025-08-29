import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ProductWithViews {
  id: string;
  productName: string;
  views: number;
  pricing: { price: number };
  revenue: number;
  file: { previewimage?: any[] };
}

type SortOrder = "asc" | "desc" | "normal";

interface ProductTableProps {
  data: ProductWithViews[];
  onDelete: (id: string) => void;
  sortConfig: { type: "views" | "pricing" | "revenue"; order: SortOrder };
  onSortChange?: (
    sort: { type: "views" | "pricing" | "revenue"; order: SortOrder } | null
  ) => void;
  disableDelete?: boolean;
}

export function ProductTable({
  data,
  onDelete,
  sortConfig,
  onSortChange,
  disableDelete = false,
}: ProductTableProps) {
  const navigate = useNavigate();

  const handleSort = (type: "views" | "pricing" | "revenue") => {
    let nextOrder: SortOrder;
    if (sortConfig.type !== type || sortConfig.order === "normal") {
      nextOrder = "asc";
    } else if (sortConfig.order === "asc") {
      nextOrder = "desc";
    } else if (sortConfig.order === "desc") {
      nextOrder = "normal";
    } else {
      nextOrder = "asc";
    }

    onSortChange?.(nextOrder === "normal" ? null : { type, order: nextOrder });
  };

  const getSortIcon = (type: "views" | "pricing" | "revenue") => {
    if (sortConfig.type !== type || sortConfig.order === "normal")
      return <ArrowUpDown size={14} />;
    if (sortConfig.order === "asc") return <ArrowUp size={14} />;
    if (sortConfig.order === "desc") return <ArrowDown size={14} />;
    return <ArrowUpDown size={14} />;
  };

  const columns: ColumnDef<ProductWithViews>[] = [
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => {
        const { productName, file } = row.original;
        return (
          <div className="flex items-center gap-3">
            {file.previewimage ? (
              <img
                src={file.previewimage[0]}
                alt={productName}
                className="w-10 h-10 rounded-md object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                N/A
              </div>
            )}
            <span className="font-medium">{productName}</span>
          </div>
        );
      },
    },

    {
      id: "views",
      header: () => (
        <button
          onClick={() => handleSort("views")}
          className="flex items-center gap-1"
        >
          Views {getSortIcon("views")}
        </button>
      ),
      cell: (info) => info.row.original.views,
    },
    {
      id: "pricing",
      header: () => (
        <button
          onClick={() => handleSort("pricing")}
          className="flex items-center gap-1"
        >
          Pricing {getSortIcon("pricing")}
        </button>
      ),
      cell: (info) => `$${info.row.original.pricing.price}`,
    },
    {
      id: "revenue",
      header: () => (
        <button
          onClick={() => handleSort("revenue")}
          className="flex items-center gap-1"
        >
          Revenue {getSortIcon("revenue")}
        </button>
      ),
      cell: (info) => `$${info.row.original.revenue}`,
    },
    {
      id: "manage",
      header: "Manage",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/products/${row.original.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            disabled={disableDelete}
            variant="destructive"
            size="sm"
            onClick={() => onDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
