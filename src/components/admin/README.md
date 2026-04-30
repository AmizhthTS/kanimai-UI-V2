# Admin Reusable Components

This directory contains reusable components designed specifically for the admin panel to maintain consistency and reduce code duplication.

## Components Overview

### 1. **PageHeader**

Standardized page header with title, description, and action buttons.

**Location:** `/components/admin/PageHeader.tsx`

**Props:**

```typescript
interface PageHeaderProps {
  title: string; // Page title
  description?: string; // Optional subtitle
  showAddButton?: boolean; // Show "Add" button
  addButtonLabel?: string; // Custom label for add button
  addButtonPath?: string; // Navigation path for add button
  onAddClick?: () => void; // Custom click handler
  showBackButton?: boolean; // Show back arrow button
  backPath?: string; // Custom back navigation path
  customActions?: React.ReactNode; // Custom action buttons
}
```

**Usage:**

```tsx
<PageHeader
  title="Products"
  description="Manage your product inventory"
  showAddButton
  addButtonLabel="Add Product"
  addButtonPath="/admin/products/add"
/>
```

---

### 2. **SearchBar**

Search input with icon and consistent styling.

**Location:** `/components/admin/SearchBar.tsx`

**Props:**

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
```

**Usage:**

```tsx
<SearchBar
  value={searchString}
  onChange={setSearchString}
  placeholder="Search products..."
/>
```

---

### 3. **DataTable**

Comprehensive table component with built-in search, pagination, and responsive design.

**Location:** `/components/admin/DataTable.tsx`

**Props:**

```typescript
interface DataTableProps<T> {
  data: T[]; // Array of data items
  columns: Column<T>[]; // Column definitions
  searchValue?: string; // Search input value
  onSearchChange?: (value: string) => void; // Search change handler
  searchPlaceholder?: string; // Search placeholder text
  showSearch?: boolean; // Show/hide search bar
  page?: number; // Current page (0-indexed)
  rowsPerPage?: number; // Items per page
  totalCount?: number; // Total items count
  onPageChange?: (event: any, newPage: number) => void;
  onRowsPerPageChange?: (event: any) => void;
  showPagination?: boolean; // Show/hide pagination
  emptyMessage?: string; // Message when no data
  loading?: boolean; // Show loading state
}

interface Column<T> {
  header: string; // Column header text
  accessor?: keyof T; // Direct property accessor
  render?: (item: T, index: number) => ReactNode; // Custom render function
  className?: string; // Column styling
}
```

**Usage:**

```tsx
<DataTable
  data={productsList}
  columns={[
    {
      header: "Image",
      render: (product) => <img src={product.image} alt={product.name} />,
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Actions",
      className: "text-right",
      render: (product) => <ActionButtons onEdit={() => edit(product._id)} />,
    },
  ]}
  searchValue={searchString}
  onSearchChange={setSearchString}
  page={page}
  rowsPerPage={rowsPerPage}
  totalCount={count}
  onPageChange={handlePageChange}
  onRowsPerPageChange={handleRowsPerPageChange}
/>
```

---

### 4. **ActionButtons**

Standardized action buttons for list views (View, Edit, Delete, Toggle status, etc.).

**Location:** `/components/admin/ActionButtons.tsx`

**Props:**

```typescript
interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  onToggleStatus?: () => void;
  onApprove?: () => void;
  isPublished?: boolean;
  isActive?: boolean;
  isApproved?: boolean;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showTogglePublish?: boolean;
  showToggleStatus?: boolean;
  showApprove?: boolean;
}
```

**Usage:**

```tsx
<ActionButtons
  showTogglePublish
  isPublished={product.status.isPublished}
  onTogglePublish={() => togglePublish(product._id)}
  onView={() => navigate(`/view/${product._id}`)}
  onEdit={() => navigate(`/edit/${product._id}`)}
  onDelete={() => deleteProduct(product._id)}
/>
```

---

### 5. **StatusBadge**

Consistent status badges for active/inactive states.

**Location:** `/components/admin/StatusBadge.tsx`

**Components:**

- `StatusBadge` - Generic status badge
- `PublishBadge` - Specialized for published/draft + featured status

**StatusBadge Props:**

```typescript
interface StatusBadgeProps {
  status: boolean | string;
  activeLabel?: string;
  inactiveLabel?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}
```

**PublishBadge Props:**

```typescript
interface PublishBadgeProps {
  isPublished: boolean;
  isFeatured?: boolean;
}
```

**Usage:**

```tsx
<StatusBadge
  status={product.status}
  activeLabel="Active"
  inactiveLabel="Inactive"
/>

<PublishBadge
  isPublished={product.status.isPublished}
  isFeatured={product.status.isFeatured}
/>
```

---

### 6. **FormCard**

Consistent card wrapper for form sections.

**Location:** `/components/admin/FormCard.tsx`

**Props:**

```typescript
interface FormCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}
```

**Usage:**

```tsx
<FormCard
  title="Basic Information"
  description="Product name, description, and pricing"
>
  <div className="space-y-4">{/* Form fields here */}</div>
</FormCard>
```

---

## Implementation Examples

### Example 1: Simple List Page

```tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, DataTable, ActionButtons } from "@/components/admin";
import { api } from "@/services/api";

const MyList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, search]);

  const fetchData = async () => {
    const result = await api.getItems({
      page: page + 1,
      limit: rowsPerPage,
      search,
    });
    setData(result.data.items);
    setCount(result.data.total);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Items"
        description="Manage items"
        showAddButton
        addButtonPath="/admin/items/add"
      />

      <DataTable
        data={data}
        columns={[
          { header: "Name", accessor: "name" },
          {
            header: "Status",
            render: (item) => <StatusBadge status={item.active} />,
          },
          {
            header: "Actions",
            className: "text-right",
            render: (item) => (
              <ActionButtons
                onView={() => navigate(`/admin/items/view/${item._id}`)}
                onEdit={() => navigate(`/admin/items/${item._id}/edit`)}
                onDelete={() => deleteItem(item._id)}
              />
            ),
          },
        ]}
        searchValue={search}
        onSearchChange={setSearch}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={count}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value));
          setPage(0);
        }}
      />
    </div>
  );
};
```

### Example 2: View/Detail Page

```tsx
import { PageHeader, FormCard, StatusBadge } from "@/components/admin";

const MyItemView = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Item Details"
        showBackButton
        backPath="/admin/items/list"
        customActions={
          <Button onClick={() => navigate(`/admin/items/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <FormCard title="Basic Information">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="font-medium">{item?.name}</p>
              </div>
              {/* More fields */}
            </div>
          </FormCard>
        </div>

        <div className="space-y-6">
          <FormCard title="Status">
            <StatusBadge status={item?.active} />
          </FormCard>
        </div>
      </div>
    </div>
  );
};
```

---

## Benefits

1. **Consistency** - All admin pages use the same design patterns
2. **DRY Principle** - Eliminate code duplication across pages
3. **Maintainability** - Update UI in one place, applies everywhere
4. **Type Safety** - Full TypeScript support with proper types
5. **Accessibility** - Consistent keyboard navigation and screen reader support
6. **Responsive** - Mobile-friendly by default
7. **Easy to Use** - Simple, intuitive API

---

## Migration Guide

### Old Pattern:

```tsx
// 100+ lines of repeated code
<div className="flex justify-between">
  <h1>Products</h1>
  <Button onClick={() => navigate("/add")}>Add</Button>
</div>
<Card>
  <div className="relative">
    <Search className="..." />
    <Input ... />
  </div>
  <Table>
    {/* Lots of table code */}
  </Table>
  <CustomPagination ... />
</Card>
```

### New Pattern:

```tsx
// 20 lines of clean, declarative code
<PageHeader title="Products" showAddButton addButtonPath="/add" />
<DataTable
  data={items}
  columns={columnConfig}
  searchValue={search}
  onSearchChange={setSearch}
  {...paginationProps}
/>
```

---

## Files Created

- `/components/admin/PageHeader.tsx`
- `/components/admin/SearchBar.tsx`
- `/components/admin/DataTable.tsx`
- `/components/admin/ActionButtons.tsx`
- `/components/admin/StatusBadge.tsx`
- `/components/admin/FormCard.tsx`
- `/components/admin/index.ts` (exports)

## Example Implementations

- `/pages/AdminPages/products/ProductListNew.tsx`
- `/pages/AdminPages/Blog/BlogListNew.tsx`
- `/pages/AdminPages/testimonials/TestimonialListNew.tsx`

---

## Next Steps

1. Replace old list pages with new component-based versions
2. Apply to all remaining admin pages (Users, Categories, etc.)
3. Add mobile card views to DataTable for better responsive UX
4. Consider adding export/import functionality
5. Add bulk actions support
