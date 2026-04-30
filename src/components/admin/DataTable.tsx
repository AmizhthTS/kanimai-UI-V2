import { ReactNode, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/ui/CustomPagination";
import { SearchBar } from "./SearchBar";
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { LucideIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (event: any, newPage: number) => void;
  onRowsPerPageChange?: (event: any) => void;
  showPagination?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  searchKey?: string; // Column key to filter by on client-side if needed
  showColumnFilter?: boolean;
  facetFilters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: LucideIcon;
    }[];
  }[];
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  isLowStock?: boolean;
  setIsLowStock?: (value: boolean) => void;
  showLowStockFilter?: boolean;
  isActive?: boolean;
  setIsActive?: (value: boolean) => void;
  showActiveFilter?: boolean;
  selectedFilter?: string;
  showSelectFilter?: boolean;
  setSelectedFilter?: (value: string) => void;
  optionsList?: {
    label: string;
    value: string;
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  showPagination = true,
  emptyMessage = "No data available",
  loading = false,
  searchKey,
  facetFilters,
  columnFilters: controlledColumnFilters,
  showColumnFilter = true,
  onColumnFiltersChange: setControlledColumnFilters,
  showActiveFilter = false,
  isActive,
  setIsActive,
  showLowStockFilter = false,
  isLowStock,
  setIsLowStock,
  showSelectFilter = false,
  selectedFilter,
  setSelectedFilter,
  optionsList,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columnFilters = controlledColumnFilters ?? internalColumnFilters;
  const setColumnFilters =
    setControlledColumnFilters ?? setInternalColumnFilters;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(), // We handle pagination manually
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: (updaterOrValue) => {
      // Handle both functional updates and direct values
      if (typeof updaterOrValue === "function") {
        setColumnFilters(updaterOrValue(columnFilters));
      } else {
        setColumnFilters(updaterOrValue);
      }
    },
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: (table: any, columnId: any) => () => new Map(),
    // Tip: using getFacetedUniqueValues requires enabling faceted... which expects access to all rows.
    // If we are strictly server-side pagination, 'facets' counts won't be accurate for the whole DB.
    // But the filter UI will still work to SET the filter state.
    // We might need to implement getFacetedRowModel IF we want client-side counts on the current page.
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    manualPagination: true,
    manualFiltering: true,
  });

  return (
    <Card className="border-none shadow-medium">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        {showSearch && (
          <div className="flex flex-1 items-center gap-2 w-full max-w-full overflow-x-auto pb-2 sm:pb-0">
            <div className="flex-1 max-w-sm min-w-[200px]">
              {onSearchChange ? (
                <SearchBar
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder={searchPlaceholder}
                />
              ) : searchKey ? (
                <Input
                  placeholder={searchPlaceholder}
                  value={
                    (table.getColumn(searchKey)?.getFilterValue() as string) ??
                    ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(searchKey)
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm rounded-xl"
                />
              ) : null}
            </div>
            {facetFilters?.map(
              (filter) =>
                table.getColumn(filter.columnId) && (
                  <DataTableFacetedFilter
                    key={filter.columnId}
                    column={table.getColumn(filter.columnId)}
                    title={filter.title}
                    options={filter.options}
                  />
                ),
            )}
            {showSelectFilter && (
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {optionsList.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {showLowStockFilter && (
              <div className="flex">
                <Switch checked={isLowStock} onCheckedChange={setIsLowStock} />
                <label className="ml-2 text-sm font-medium">Low Stock</label>
              </div>
            )}
            {showActiveFilter && (
              <div className="flex">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <label className="ml-2 text-sm font-medium">Active</label>
              </div>
            )}

            {/* Show clear filters button if any filters active */}
            {columnFilters.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setColumnFilters([])}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        {showColumnFilter && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto rounded-xl">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex items-center cursor-pointer select-none"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {showPagination && (
          <CustomPagination
            count={totalCount}
            page={page}
            onPageChange={onPageChange || (() => {})}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange || (() => {})}
          />
        )}
      </div>
    </Card>
  );
}
