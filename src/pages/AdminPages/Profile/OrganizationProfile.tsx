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
    <div className="space-y-6 pb-10 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black shadow-inner">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Organization <span className="text-primary">Profile</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Manage your institution's global identity
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-lg relative inline-block pb-2">
              Organization Information
              <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-primary rounded-full"></span>
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            {/* Form Fields Column */}
            <div className="lg:col-span-3 space-y-10">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
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
                <div className="col-span-1">
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
                </div>
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

            {/* Logo Section */}
            <div className="flex flex-col items-center lg:items-end justify-center space-y-6">
              <div className="relative group p-1 bg-white rounded-full border border-slate-100 shadow-xl shadow-slate-100">
                <div className="w-48 h-48 rounded-full overflow-hidden relative bg-slate-50 flex items-center justify-center border-4 border-white">
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
                <div className="absolute bottom-2 right-4 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-500 border border-slate-100 group-hover:text-primary transition-colors cursor-pointer">
                  <Camera className="w-6 h-6" />
                </div>
              </div>
              <div className="text-center lg:text-right pr-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Institution Logo
                </p>
                <p className="text-[9px] text-slate-300 font-bold mt-1">
                  Square image recommended
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-12 mt-12 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-12 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-200"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-4 bg-primary text-white rounded-xl shadow-lg shadow-primary-1/20 hover:bg-primary-1 transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest disabled:opacity-70 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationProfile;
