import React, { useState } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronLeft,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { authApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ isFaculty = false }: { isFaculty?: boolean }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "",
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const checkPolicy = (val: string) => {
    return {
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      number: /\d/.test(val),
      special: /[@$!%*?&]/.test(val),
    };
  };

  const policy = checkPolicy(newPassword || "");

  const onFormSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (!passwordRegex.test(data.newPassword)) {
      toast.error("Password does not meet policy requirements");
      return;
    }

    setLoading(true);
    try {
      data.userName = sessionStorage.getItem("UserName");
      await authApi.changePassword(data);
      toast.success("Password changed successfully");
      reset();
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const PolicyItem = ({ label, met }: { label: string; met: boolean }) => (
    <div
      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${met ? "text-emerald-600" : "text-slate-400"}`}
    >
      {met ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      {label}
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() =>
              navigate(isFaculty ? "/faculty/my-detail" : "/admin/dashboard")
            }
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
              Security <span className="text-primary">Settings</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Update your account credentials
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xs sm:text-sm uppercase tracking-tight">
                  Change Password
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Protect your account with a strong credential
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="p-6 sm:p-8 space-y-6"
            >
              <div className="relative group">
                <TextInput
                  control={control}
                  errors={errors}
                  name="password"
                  textLable="Current Password"
                  placeholderName="••••••••"
                  type={showCurrent ? "text" : "password"}
                  requiredMsg="Current password is required"
                  labelMandatory
                  startIcon={<Lock className="w-4 h-4 text-slate-400" />}
                />
                {/* <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-[38px] text-slate-400 hover:text-primary transition-colors p-2"
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="newPassword"
                    textLable="New Password"
                    placeholderName="••••••••"
                    type={showNew ? "text" : "password"}
                    requiredMsg="New password is required"
                    labelMandatory
                    startIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                  {/* <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-[38px] text-slate-400 hover:text-primary transition-colors p-2"
                  >
                    {showNew ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button> */}
                </div>

                <div className="relative group">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="confirmPassword"
                    textLable="Confirm Password"
                    placeholderName="••••••••"
                    type={showConfirm ? "text" : "password"}
                    requiredMsg="Please confirm your password"
                    labelMandatory
                    startIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                  {/* <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-[38px] text-slate-400 hover:text-primary transition-colors p-2"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button> */}
                </div>
              </div>

              {/* Password Matching Error */}
              {watch("confirmPassword") &&
                watch("newPassword") !== watch("confirmPassword") && (
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5 animate-in slide-in-from-left-1 duration-300">
                    <XCircle className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest disabled:opacity-70 group active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  UPDATE PASSWORD
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      isFaculty ? "/faculty/my-detail" : "/admin/dashboard",
                    )
                  }
                  className="w-full sm:w-auto px-10 py-4 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
            <h4 className="font-black text-white text-[10px] uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Password Policy
            </h4>
            <div className="space-y-5">
              <PolicyItem label="Minimum 8 characters" met={policy.length} />
              <PolicyItem label="At least 1 uppercase" met={policy.upper} />
              <PolicyItem label="At least 1 lowercase" met={policy.lower} />
              <PolicyItem label="At least 1 number" met={policy.number} />
              <PolicyItem
                label="At least 1 special character"
                met={policy.special}
              />
            </div>

            <div className="mt-10 pt-8 border-t border-slate-800/50">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                A strong password helps prevent unauthorized access to your
                institution's sensitive data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
