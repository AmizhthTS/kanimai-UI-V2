import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  RotateCcw,
  Save,
  Loader2,
  ReceiptIndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import { useForm, Controller } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const FeeDetailsMaster = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [feeDetails, setFeeDetails] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;

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
      feeType: "",
      semesterId: "",
      boardingPointId: "",
      partiallyPayable: false,
      discountFlag: false,
    },
  });

  const selectedFeeType = watch("feeType");
  console.log(selectedFeeType);
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

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchFeeDetails = async () => {
    setListLoading(true);
    try {
      const response = await masterApi.getFeeDetailsList({
        searchStr: searchQuery,
        pageNumber: currentPage - 1,
      });
      setFeeDetails(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching fee details:", error);
      toast.error("Failed to load fee details");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeeDetails();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Format data for API
      const payload = {
        ...data,
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
        boardingPointId:
          typeof data.boardingPointId === "object"
            ? data.boardingPointId.id
            : data.boardingPointId,
      };

      await masterApi.saveFeeDetails(payload);
      toast.success(
        data.id
          ? "Fee details updated successfully"
          : "Fee details saved successfully",
      );
      reset({
        id: "",
        paymentType: "",
        feeName: "",
        feeType: "",
        semesterId: "",
        boardingPointId: "",
        partiallyPayable: false,
        discountFlag: false,
      });
      fetchFeeDetails();
    } catch (error) {
      console.error("Error saving fee details:", error);
      toast.error("Failed to save fee details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    // Map IDs/values to objects for Autocomplete
    const paymentTypeObj = paymentTypes.find(
      (t) => t.value === item.paymentType,
    );
    const feeTypeObj = feeTypes.find((t) => t.value === item.feeType);
    const semesterObj = semesters.find(
      (s) => s.id.toString() === (item.semesterId || "").toString(),
    );
    const boardingPointObj = boardingPoints.find(
      (b) => b.id.toString() === (item.boardingPointId || "").toString(),
    );
    reset({
      id: item.id,
      paymentType: paymentTypeObj || item.paymentType,
      feeName: item.feeName,
      feeType: feeTypeObj.value || item.feeType,
      semesterId: semesterObj || item.semesterId || "",
      boardingPointId: boardingPointObj || item.boardingPointId || "",
      partiallyPayable: item.partiallyPayable,
      discountFlag: item.discountFlag,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this fee detail?"))
      return;

    try {
      await masterApi.deleteFeeDetails(id);
      toast.success("Fee detail deleted successfully");
      fetchFeeDetails();
    } catch (error) {
      console.error("Error deleting fee detail:", error);
      toast.error("Failed to delete fee detail");
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/master")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Fee <span className="text-primary">Details</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Financial Configuration
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <ReceiptIndianRupee className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-slate-800 text-sm">
                {watch("id") ? "Update Fee Details" : "Add Fee Details"}
              </h3>
            </div>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="p-6 space-y-5"
            >
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
                onChangeValue={(val: any) =>
                  setValue("paymentType", val?.value || "")
                }
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
                  const type = val?.value || "";
                  setValue("feeType", type);
                  // Reset conditional fields when type changes
                  if (type !== "Tuition") setValue("semesterId", "");
                  if (type !== "Transport") setValue("boardingPointId", "");
                }}
              />

              {/* Conditional Semester Dropdown for Tuition */}
              {selectedFeeType === "Tuition" && (
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
                  onChangeValue={(val: any) =>
                    setValue("semesterId", val?.id || "")
                  }
                />
              )}

              {/* Conditional Boarding Point Dropdown for Transport */}
              {selectedFeeType === "Transport" && (
                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="boardingPointId"
                  textLable="Boarding Point Name"
                  placeholderName="Select Boarding Point"
                  requiredMsg="Boarding point is required for Transport fee"
                  labelMandatory
                  options={boardingPoints}
                  getOptionLabel={(opt: any) => opt.pointName}
                  getOptionValue={(opt: any) => opt.id}
                  onChangeValue={(val: any) =>
                    setValue("boardingPointId", val?.id || "")
                  }
                />
              )}

              <TextInput
                control={control}
                errors={errors}
                name="feeName"
                textLable="Fee Name"
                placeholderName="Enter Fee Name"
                requiredMsg="Fee name is required"
                labelMandatory
              />

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                    Partial Due Applicable
                  </Label>
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

                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                    Discount
                  </Label>
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

              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  {watch("id") ? "UPDATE" : "SAVE"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    reset({
                      id: "",
                      paymentType: "",
                      feeName: "",
                      feeType: "",
                      semesterId: "",
                      boardingPointId: "",
                      partiallyPayable: false,
                      discountFlag: false,
                    })
                  }
                  className="px-4 py-3.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 font-bold text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  RESET
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800 text-sm">
                Fee Details List
              </h3>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Fee Type / Name"
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-medium w-full sm:w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Payment Type
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Fee Type
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Fee Name
                    </th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Partial Due
                    </th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Discount
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {listLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          <span className="text-xs font-bold uppercase tracking-widest">
                            Fetching data...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : feeDetails.length > 0 ? (
                    feeDetails.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">
                          {((currentPage - 1) * rowsPerPage + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-600">
                            {item.paymentType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-600">
                            {item.feeType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700">
                            {item.feeName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.partiallyPayable ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"}`}
                          >
                            {item.partiallyPayable ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.discountFlag ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"}`}
                          >
                            {item.discountFlag ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {/* <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-slate-400 italic text-sm"
                      >
                        No fee details found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-2 border-t border-slate-100 flex items-center justify-end bg-white mt-auto min-h-[60px]">
              {totalCount > rowsPerPage && (
                <CustomPagination
                  totalPages={Math.ceil(totalCount / rowsPerPage)}
                  page={currentPage - 1}
                  onPageChange={(_: any, newPage: number) =>
                    setCurrentPage(newPage + 1)
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetailsMaster;
