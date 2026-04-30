import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Power,
  CheckCircle,
} from "lucide-react";

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

export const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleStatus,
  onApprove,
  isPublished = false,
  isActive = false,
  isApproved = false,
  showView = true,
  showEdit = true,
  showDelete = true,
  showTogglePublish = false,
  showToggleStatus = false,
  showApprove = false,
}: ActionButtonsProps) => {
  return (
    <div className="flex justify-end gap-2">
      {showTogglePublish && onTogglePublish && (
        <Button
          variant="ghost"
          size="icon"
          className={isPublished ? "text-green-600" : "text-gray-400"}
          onClick={onTogglePublish}
          title={isPublished ? "Unpublish" : "Publish"}
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>
      )}
      {showToggleStatus && onToggleStatus && (
        <Button
          variant="ghost"
          size="icon"
          className={isActive ? "text-green-600" : "text-gray-400"}
          onClick={onToggleStatus}
          title={isActive ? "Deactivate" : "Activate"}
        >
          <Power className="h-4 w-4" />
        </Button>
      )}
      {showApprove && onApprove && (
        <Button
          variant="ghost"
          size="icon"
          className={isApproved ? "text-green-600" : "text-gray-400"}
          onClick={onApprove}
          title={isApproved ? "Approved" : "Approve"}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      )}
      {showView && onView && (
        <Button variant="ghost" size="icon" onClick={onView}>
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {showEdit && onEdit && (
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {showDelete && onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
