import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  RotateCcw,
  Save,
  Loader2,
  ReceiptIndianRupee,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const FeeDetailsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(id ? true : false);

  const [semesters, setSemesters] = useState<any[]>([]);
  const [boardingPoints, setBoardingPoints] = useState<any[]>([]);

  const paymentTypes = [
    { label: "Year", value: "Year" },
    { label: "Semester", value: "Semester" },
    { label: "One Time Pay", value: "One Time Pay" },
    { label: "Monthly", value: "Monthly" },
  ];

  const feeTypes = [
    { label: "Exam", value: "Exam" },
    { label: "Hostel", value: "Hostel" },
    { label: "Mess", value: "Mess" },
    { label: "Miscellaneous Fees", value: "Miscellaneous Fees" },
    { label: "Transport", value: "Transport" },
    { label: "Tuition", value: "Tuition" },
    { label: "University", value: "University" },
    { label: "Application", value: "Application" },
  ];

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      paymentType: "",
      feeName: "",
      feeType: null,
      semesterId: "",
      boardingPointId: "",
      partiallyPayable: false,
      discountFlag: false,
    },
  });

  const selectedFeeType = watch("feeType");

  const fetchDropdownData = async () => {
    try {
      const [semRes, bpRes] = await Promise.all([
        masterApi.getSemesterList({ searchStr: "", pageNumber: 0 }),
        masterApi.getAllBoardingPoints(),
      ]);
      setSemesters(semRes.data.responseModelList || []);
      setBoardingPoints(bpRes.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const fetchFeeDetailById = async (feeId: string) => {
    setDataLoading(true);
    try {
      const response = await masterApi.getFeeDetailsById(feeId);
      if (response.data) {
        const data = response.data;

        // Map values for Autocomplete components
        const paymentTypeObj = paymentTypes.find(
          (t) => t.value === data.paymentType,
        );
        const feeTypeObj = feeTypes.find((t) => t.value === data.feeType);

        reset({
          ...data,
          paymentType: paymentTypeObj || data.paymentType,
          feeType: feeTypeObj || data.feeType,
          semesterId:
            semesters.find((s) => s.id === data.semesterId) || data.semesterId,
          feeName:
            data.feeType === "Transport"
              ? boardingPoints.find((bp) => bp.pointName === data.feeName) ||
                data.feeName
              : data.feeName,
        });
      }
    } catch (error) {
      console.error("Error fetching fee detail:", error);
      toast.error("Failed to load fee detail");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchDropdownData();
    };
    init();
  }, []);

  useEffect(() => {
    if (id && semesters.length > 0) {
      fetchFeeDetailById(id);
    }
  }, [id, semesters.length]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        id: id || "",
        paymentType:
          typeof data.paymentType === "object"
            ? data.paymentType.value
            : data.paymentType,
        feeType:
          typeof data.feeType === "object" ? data.feeType.value : data.feeType,
        semesterId:
          typeof data.semesterId === "object"
            ? data.semesterId.id
            : data.semesterId,
        feeName:
          typeof data.feeName === "object"
            ? data.feeName.pointName
            : data.feeName,
      };

      await masterApi.saveFeeDetails(payload);
      toast.success(
        id
          ? "Fee details updated successfully"
          : "Fee details saved successfully",
      );
      navigate("/admin/master/fee-details");
    } catch (error) {
      console.error("Error saving fee details:", error);
      toast.error("Failed to save fee details");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Loading Fee Information...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-700 max-w-6xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <button
            onClick={() => navigate("/admin/master/fee-details")}
            className="p-2.5 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-primary border border-transparent hover:border-slate-100 shadow-sm shrink-0 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {id ? "Edit" : "Add"}{" "}
              <span className="text-primary">Fee Detail</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Institutional Financial Configuration
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="bg-slate-50/50 px-6 sm:px-10 py-5 sm:py-7 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary shrink-0">
            <ReceiptIndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-xs sm:text-sm uppercase tracking-tight">
              Fee Configuration
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Set up your institutional fee structure
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="p-6 sm:p-10 lg:p-12 space-y-10 sm:space-y-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            <AutocompleteInput
              control={control}
              errors={errors}
              name="paymentType"
              textLable="Payment Type"
              placeholderName="Select Payment Type"
              requiredMsg="Payment type is required"
              labelMandatory
              options={paymentTypes}
              getOptionLabel={(opt: any) => opt.label}
              getOptionValue={(opt: any) => opt.value}
            />

            <AutocompleteInput
              control={control}
              errors={errors}
              name="feeType"
              textLable="Fee Type"
              placeholderName="Select Fee Type"
              requiredMsg="Fee type is required"
              labelMandatory
              options={feeTypes}
              getOptionLabel={(opt: any) => opt.label}
              getOptionValue={(opt: any) => opt.value}
              onChangeValue={(val: any) => {
                const type = typeof val === "object" ? val?.value : val;
                setValue("feeType", val);
                if (type !== "Tuition") setValue("semesterId", "");
                if (type !== "Transport") setValue("feeName", "");
              }}
            />

            {selectedFeeType?.value === "Tuition" ||
            selectedFeeType === "Tuition" ? (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="semesterId"
                  textLable="Semester"
                  placeholderName="Select Semester"
                  requiredMsg="Semester is required for Tuition fee"
                  labelMandatory
                  options={semesters}
                  getOptionLabel={(opt: any) => opt.semesterName}
                  getOptionValue={(opt: any) => opt.id}
                />
              </div>
            ) : null}

            {selectedFeeType?.value === "Transport" ||
            selectedFeeType === "Transport" ? (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="feeName"
                  textLable="Boarding Point Name"
                  placeholderName="Select Boarding Point"
                  requiredMsg="Boarding point is required for Transport fee"
                  labelMandatory
                  options={boardingPoints}
                  getOptionLabel={(opt: any) => opt.pointName}
                  getOptionValue={(opt: any) => opt.pointName}
                />
              </div>
            ) : (
              <TextInput
                control={control}
                errors={errors}
                name="feeName"
                textLable="Fee Name"
                placeholderName="Enter Fee Name"
                requiredMsg="Fee name is required"
                labelMandatory
              />
            )}
          </div>

          <div className="bg-slate-50/50 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-3xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                  Partial Payment
                </Label>
                <p className="text-[9px] text-slate-400 font-bold uppercase">
                  Enable partial due
                </p>
              </div>
              <Controller
                name="partiallyPayable"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                  Discount Flag
                </Label>
                <p className="text-[9px] text-slate-400 font-bold uppercase">
                  Apply discounts
                </p>
              </div>
              <Controller
                name="discountFlag"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 sm:pt-12 mt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 bg-primary text-white font-black text-[10px] py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group uppercase tracking-widest active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              {id ? "UPDATE FEE DETAIL" : "SAVE FEE DETAIL"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/master/fee-details")}
              className="w-full sm:w-auto px-10 py-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              BACK TO LIST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeDetailsForm;
