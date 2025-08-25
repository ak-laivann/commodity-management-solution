import React from "react";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
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
}

interface ProductTableProps {
  data: ProductWithViews[];
  onDelete: (id: string) => void;
}

export function ProductTable({ data, onDelete }: ProductTableProps) {
  const navigate = useNavigate();

  const columns: ColumnDef<ProductWithViews>[] = [
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "views",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Views{" "}
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown size={14} />
          ) : null}
        </button>
      ),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "pricing.price",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Pricing{" "}
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown size={14} />
          ) : null}
        </button>
      ),
      cell: (info) => `$${info.getValue()}`,
    },
    {
      accessorKey: "revenue",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Revenue{" "}
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown size={14} />
          ) : null}
        </button>
      ),
      cell: (info) => `$${info.getValue()}`,
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
    getSortedRowModel: getSortedRowModel(),
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
