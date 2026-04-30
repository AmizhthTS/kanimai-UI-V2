import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  showAddButton?: boolean;
  addButtonLabel?: string;
  addButtonPath?: string;
  onAddClick?: () => void;
  showBackButton?: boolean;
  backPath?: string;
  customActions?: React.ReactNode;
}

export const PageHeader = ({
  title,
  description,
  showAddButton = false,
  addButtonLabel = "Add New",
  addButtonPath,
  onAddClick,
  showBackButton = false,
  backPath,
  customActions,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else if (addButtonPath) {
      navigate(addButtonPath);
    }
  };

  const handleBackClick = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {customActions}
        {showAddButton && (
          <Button
            onClick={handleAddClick}
            className="bg-gradient-primary hover:opacity-90 rounded-xl gap-2"
          >
            <Plus className="h-4 w-4" />
            {addButtonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
