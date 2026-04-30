import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import { userApi } from "@/services/api";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordModal = ({
  open,
  onOpenChange,
}: ChangePasswordModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordModalProps>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not found");
      return;
    }
    if (data.currentPassword === data.newPassword) {
      toast.error("New password cannot be same as current password");
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await userApi.changePassword(userId!, data);

      if (result.data.response.responseStatus === 200) {
        toast.success(result.data.response.responseMessage);
        onOpenChange(false);
        reset();
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.response?.responseMessage ||
        "Failed to change password";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  const onError = (e: any) => {
    console.log(e);
    toast.error("Please fill in all required fields");
  };
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <TextInput
                control={control}
                errors={errors}
                name="currentPassword"
                type="password"
                textLable="Current Password"
                placeholderName="Enter current password"
                variant="outlined"
                requiredMsg="Current password is required"
                labelMandatory={true}
              />
            </div>
            <div className="space-y-2">
              <TextInput
                control={control}
                errors={errors}
                name="newPassword"
                type="password"
                textLable="New Password"
                placeholderName="Enter new password"
                variant="outlined"
                requiredMsg="New password is required"
                labelMandatory={true}
              />
            </div>
            <div className="space-y-2">
              <TextInput
                control={control}
                errors={errors}
                name="confirmPassword"
                type="password"
                textLable="Confirm Password"
                placeholderName="Enter confirm password"
                variant="outlined"
                requiredMsg="Confirm password is required"
                labelMandatory={true}
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                }}
                disabled={loading}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                <Lock className="h-4 w-4" />
                {loading ? "Submitting..." : "Change Password"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
