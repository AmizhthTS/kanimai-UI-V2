import React, { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Building2,
  Phone,
  MapPin,
  Globe,
  Camera,
} from "lucide-react";
import { organizationApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import ImageUpload from "@/components/Inputs/ImageUpload";
import { useNavigate } from "react-router-dom";

const OrganizationProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      organizationName: "",
      orgAddress: "",
      orgCity: "",
      orgPhoneNumber: "",
      orgState: "",
      orgPincode: "",
      fileFormat: "",
      logoimage: "",
    },
  });

  const fetchProfile = async () => {
    try {
      const response = await organizationApi.getOrganization();
      if (response.data) {
        // Reset with fetched data
        reset(response.data);
      }
    } catch (error) {
      console.error("Error fetching organization profile:", error);
      toast.error("Failed to load organization profile");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        id: data.id || "",
      };

      // Handle ImageUpload object structure
      if (data.logoimage && typeof data.logoimage === "object") {
        const base64String = data.logoimage.file;
        const base64Content = base64String.split(",")[1]; // Extract raw base64 data
        const extension = data.logoimage.fileName.split(".").pop();

        payload.logoimage = base64Content;
        payload.fileFormat = extension;
      }

      await organizationApi.saveOrganization(payload);
      toast.success("Organization profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Loading Profile Details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-700 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black shadow-inner shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Organization <span className="text-primary">Profile</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Manage your institution's global identity
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="bg-slate-50/50 px-6 sm:px-10 py-5 sm:py-7 border-b border-slate-100">
          <h3 className="font-black text-slate-800 text-base sm:text-lg relative inline-block pb-2 uppercase tracking-tight">
            Organization Information
            <span className="absolute bottom-0 left-0 w-1/3 h-1.5 bg-primary rounded-full"></span>
          </h3>
        </div>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="p-6 sm:p-10 lg:p-12"
        >
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            {/* Logo Section - Top on Mobile, Right on Desktop */}
            <div className="w-full lg:w-auto lg:order-2 flex flex-col items-center space-y-6 shrink-0">
              <div className="relative group p-1 bg-white rounded-full border border-slate-100 shadow-2xl shadow-slate-200">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden relative bg-slate-50 flex items-center justify-center border-4 border-white">
                  <ImageUpload
                    control={control}
                    errors={errors}
                    name="logoimage"
                    label=""
                  />
                  {/* Overlay Camera Icon for Visual Hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center cursor-pointer pointer-events-none">
                    <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-40 transition-opacity" />
                  </div>
                </div>
                {/* Floating Camera Button */}
                <div className="absolute bottom-2 right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-500 border border-slate-100 group-hover:text-primary transition-colors cursor-pointer z-10">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Institution Logo
                </p>
                <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase">
                  Square image recommended
                </p>
              </div>
            </div>

            {/* Form Fields Column */}
            <div className="w-full lg:flex-1 space-y-8 sm:space-y-10 lg:order-1">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-8">
                <TextInput
                  control={control}
                  errors={errors}
                  name="organizationName"
                  textLable="Organization Name"
                  placeholderName="Enter institution name"
                  labelMandatory
                  requiredMsg="Organization name is required"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TextInput
                  control={control}
                  errors={errors}
                  name="orgAddress"
                  textLable="Address"
                  placeholderName="Full street address"
                  labelMandatory
                  requiredMsg="Address is required"
                  startIcon={<MapPin className="w-4 h-4 text-slate-400" />}
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="orgPhoneNumber"
                  textLable="Phone Number"
                  placeholderName="Enter contact number"
                  labelMandatory
                  requiredMsg="Phone number is required"
                  startIcon={<Phone className="w-4 h-4 text-slate-400" />}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TextInput
                  control={control}
                  errors={errors}
                  name="orgCity"
                  textLable="City"
                  placeholderName="City name"
                  labelMandatory
                  requiredMsg="City is required"
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="orgState"
                  textLable="State"
                  placeholderName="State / Province"
                  labelMandatory
                  requiredMsg="State is required"
                  startIcon={<Globe className="w-4 h-4 text-slate-400" />}
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="orgPincode"
                  textLable="Pincode"
                  placeholderName="Postal code"
                  labelMandatory
                  requiredMsg="Pincode is required"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 sm:pt-12 mt-10 sm:mt-12 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-12 py-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest disabled:opacity-70 group active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationProfile;
