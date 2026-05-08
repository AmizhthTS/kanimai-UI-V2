import React, { useState, useEffect } from "react";
import { Save, Loader2, FileText, ChevronLeft, RotateCcw } from "lucide-react";
import { preferencesApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import { useNavigate } from "react-router-dom";

const PdfSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const pdfFormats = [
    { label: "A5", value: "A5" },
    { label: "A6", value: "A6" },
    { label: "B6", value: "B6" },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      receiptformat: "",
    },
  });

  const fetchSettings = async () => {
    try {
      const response = await preferencesApi.getPreferences();
      if (response.data) {
        const data = response.data;
        const formatObj = pdfFormats.find(
          (f) => f.value === data.receiptformat,
        );
        reset({
          id: data.id || "",
          receiptformat: formatObj || data.receiptformat,
        });
      }
    } catch (error) {
      console.error("Error fetching pdf settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        id: data.id || "",
        receiptformat:
          typeof data.receiptformat === "object"
            ? data.receiptformat.value
            : data.receiptformat,
      };
      await preferencesApi.savePreferences(payload);
      toast.success("PDF settings updated successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Loading Settings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
              PDF <span className="text-primary">Settings</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Receipt Configuration
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Main Settings Form */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xs sm:text-sm uppercase tracking-tight">
                  Configuration Details
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Set your default document formats
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="p-6 sm:p-8 space-y-8"
            >
              <div className="max-w-xl">
                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="receiptformat"
                  textLable="PDF File Size / Receipt Format"
                  placeholderName="Select format"
                  requiredMsg="Receipt format is required"
                  labelMandatory
                  options={pdfFormats}
                  getOptionLabel={(opt: any) => opt.label}
                  getOptionValue={(opt: any) => opt.value}
                  onChangeValue={(val: any) =>
                    setValue("receiptformat", val || "")
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest disabled:opacity-70 group active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  UPDATE SETTINGS
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="w-full sm:w-auto px-10 py-4 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Guide */}
        <div className="lg:col-span-4">
          <div className="bg-amber-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-100 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="font-black text-amber-800 text-[10px] uppercase tracking-widest">
                Quick Guide
              </h4>
            </div>

            <ul className="space-y-4">
              {[
                {
                  label: "A5",
                  desc: "Standard size for detailed institution receipts",
                },
                {
                  label: "A6",
                  desc: "Compact layout for optimized paper usage",
                },
                {
                  label: "B6",
                  desc: "Specialized format for specific receipt printers",
                },
                {
                  label: "AUTO",
                  desc: "Updates take effect immediately on next generation",
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-4 group">
                  <span className="w-6 h-6 rounded-lg bg-amber-100/50 flex items-center justify-center text-[8px] font-black text-amber-600 shrink-0 group-hover:bg-amber-200 transition-colors">
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-tight">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-amber-700/70 font-bold leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfSettings;
