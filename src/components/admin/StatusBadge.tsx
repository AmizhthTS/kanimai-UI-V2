import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: boolean | string;
  activeLabel?: string;
  inactiveLabel?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export const StatusBadge = ({
  status,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  variant,
}: StatusBadgeProps) => {
  const isActive =
    typeof status === "boolean"
      ? status
      : status === "active" || status === "approved" || status === "published";

  return (
    <Badge
      variant={variant || (isActive ? "default" : "secondary")}
      className={
        !variant && isActive
          ? "bg-green-100 text-green-700"
          : !variant
            ? "bg-red-100 text-red-700"
            : ""
      }
    >
      {isActive ? activeLabel : inactiveLabel}
    </Badge>
  );
};

interface PublishBadgeProps {
  isPublished: boolean;
  isFeatured?: boolean;
}

export const PublishBadge = ({
  isPublished,
  isFeatured,
}: PublishBadgeProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Badge
        className={
          isPublished
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }
      >
        {isPublished ? "Published" : "Draft"}
      </Badge>
      {isFeatured && (
        <Badge className="bg-blue-100 text-blue-700">Featured</Badge>
      )}
    </div>
  );
};
