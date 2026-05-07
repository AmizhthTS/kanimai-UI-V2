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
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              PDF <span className="text-primary">Settings</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Receipt Configuration
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">
                  Configuration Details
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Set your default document formats
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="p-8 space-y-8"
            >
              <AutocompleteInput
                control={control}
                errors={errors}
                name="receiptformat"
                textLable="Pdf File Size / Receipt Format"
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

              <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest disabled:opacity-70 group"
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
                  className="px-10 py-4 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                >
                  <RotateCcw className="w-4 h-4" />
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 space-y-4">
            <h4 className="font-black text-amber-800 text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Quick Guide
            </h4>
            <ul className="space-y-3">
              {[
                "A5: Standard size for detailed institution receipts",
                "A6: Compact layout for optimized paper usage",
                "B6: Specialized format for specific receipt printers",
                "Updates take effect immediately on next generation",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[11px] text-amber-700/80 font-bold leading-relaxed"
                >
                  <span className="text-amber-400 shrink-0">•</span>
                  {item}
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
