import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  RotateCcw,
  Save,
  Loader2,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import TextInput from "@/components/Inputs/TextInput";

const FeeCourseMappingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [feeNames, setFeeNames] = useState<any[]>([]);

  const feeTypes = [
    "Exam",
    "Hostel",
    "Mess",
    "Miscellaneous Fees",
    "Transport",
    "Tuition",
    "University",
    "Application",
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
      feeType: "",
      feeId: {},
      degreeId: {},
      courseId: {},
      batch: "",
      amount: "",
      dueDate: "",
      dueDays: "",
    },
  });

  const selectedFeeType = watch("feeType");
  const selectedDegree = watch("degreeId");
  const selecteddueDate = watch("dueDate");
  const selecteddueDays = watch("dueDays");

  const generateBatchList = () => {
    const currentYear = new Date().getFullYear();
    const minYears = 4;
    const batchList = [];
    for (let i = currentYear; i > currentYear - minYears; i--) {
      batchList.push(i.toString());
    }
    setBatches(batchList);
  };

  const fetchInitialData = async () => {
    try {
      const degRes = await masterApi.getDegreeList({});
      setDegrees(
        Array.isArray(degRes.data?.responseModelList)
          ? degRes.data.responseModelList
          : [],
      );
      generateBatchList();

      if (isEditing) {
        await fetchMappingDetails(id);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const fetchMappingDetails = async (mappingId: string) => {
    setFetching(true);
    try {
      const response = await masterApi.getFeeCourseMappingById(mappingId);
      const data = response.data;

      if (data) {
        // 1. Construct objects for dropdowns from data directly to ensure immediate display
        const feeObj = { id: data.feeId, feeName: data.feeName };
        const degreeObj = { id: data.degreeId, degreeName: data.degreeName };
        const courseObj = { id: data.courseId, courseName: data.courseName };

        // 2. Set form values
        reset({
          id: data.id,
          feeType: data.feeType,
          feeId: feeObj,
          degreeId: degreeObj,
          courseId: courseObj,
          batch: data.batch,
          amount: data.amount,
          dueDate: data.dueDate || "",
          dueDays: data.dueDays || "",
        });

        // 3. Load dependent lists in background for dropdown options
        await Promise.all([
          fetchFeeNamesByType(data.feeType),
          data.degreeId ? fetchCoursesByDegree(data.degreeId) : Promise.resolve(),
        ]);
      }
    } catch (error) {
      console.error("Error fetching mapping details:", error);
      toast.error("Failed to load mapping details");
    } finally {
      setFetching(false);
    }
  };

  const fetchFeeNamesByType = async (type: string) => {
    if (!type) {
      setFeeNames([]);
      return;
    }
    try {
      const response = await masterApi.getFeeNamesByType(type);
      setFeeNames(
        Array.isArray(response.data?.responseModelList)
          ? response.data?.responseModelList
          : [],
      );
    } catch (error) {
      console.error("Error fetching fee names:", error);
      setFeeNames([]);
    }
  };

  const fetchCoursesByDegree = async (degreeId: any) => {
    const dId = typeof degreeId === "object" ? degreeId.id : degreeId;
    if (!dId) {
      setCourses([]);
      return [];
    }
    try {
      const response = await masterApi.getCourseList({
        searchStr: "",
        pageNumber: 0,
      });
      const rawCourses = response.data?.responseModelList;
      const filtered = (Array.isArray(rawCourses) ? rawCourses : []).filter(
        (c: any) => c.degreeId.toString() === dId.toString(),
      );
      setCourses(filtered);
      return filtered;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (selectedFeeType && !fetching) {
      fetchFeeNamesByType(selectedFeeType);
      setValue("feeId", "");
    }
  }, [selectedFeeType]);

  useEffect(() => {
    if (selectedDegree && !fetching) {
      fetchCoursesByDegree(selectedDegree);
      setValue("courseId", "");
    }
  }, [selectedDegree]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        feeId: typeof data.feeId === "object" ? data.feeId.id : data.feeId,
        degreeId:
          typeof data.degreeId === "object" ? data.degreeId.id : data.degreeId,
        courseId:
          typeof data.courseId === "object" ? data.courseId.id : data.courseId,
      };

      await masterApi.saveFeeCourseMapping(payload);
      toast.success(
        isEditing
          ? "Fee mapping updated successfully"
          : "Fee mapping saved successfully",
      );
      navigate("/admin/master/fee-course-mapping");
    } catch (error) {
      console.error("Error saving fee mapping:", error);
      toast.error("Failed to save mapping");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Loading Mapping Details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/master/fee-course-mapping")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isEditing ? "Update" : "Add New"}{" "}
              <span className="text-primary">Fee Mapping</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Course-wise Financial Assignment
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Fee Mapping Information
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Set amounts and due dates for courses
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Fee Details */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-slate-50 pb-2">
                Fee Category
              </h4>
              <AutocompleteInput
                control={control}
                errors={errors}
                name="feeType"
                textLable="Fee Type"
                placeholderName="Select Fee Type"
                requiredMsg="Fee Type is required"
                labelMandatory
                options={feeTypes}
              />

              <AutocompleteInput
                control={control}
                errors={errors}
                name="feeId"
                textLable="Fee Name"
                placeholderName="Select Fee Name"
                requiredMsg="Fee Name is required"
                labelMandatory
                disabled={!selectedFeeType}
                options={feeNames}
                getOptionLabel={(opt: any) => opt.feeName}
                getOptionValue={(opt: any) => opt.id}
              />

              <TextInput
                control={control}
                errors={errors}
                name="amount"
                textLable="Fee Amount"
                placeholderName="Enter amount (₹)"
                requiredMsg="Amount is required"
                labelMandatory
                type="number"
              />
            </div>
            {/* Middle Column: Target Audience */}
            {["Exam", "Miscellaneous Fees", "Tuition", "University"].includes(
              selectedFeeType,
            ) && (
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-slate-50 pb-2">
                  Course Selection
                </h4>
                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="degreeId"
                  textLable="Degree"
                  placeholderName="Select Degree"
                  options={degrees}
                  getOptionLabel={(opt: any) => opt.degreeName}
                  getOptionValue={(opt: any) => opt.id}
                  requiredMsg={
                    selectedFeeType !== "Miscellaneous Fees"
                      ? "Degree is required"
                      : ""
                  }
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="courseId"
                  textLable="Course"
                  placeholderName="Select Course"
                  disabled={!selectedDegree}
                  options={courses}
                  getOptionLabel={(opt: any) => opt.courseName}
                  getOptionValue={(opt: any) => opt.id}
                  requiredMsg={
                    selectedFeeType !== "Miscellaneous Fees"
                      ? "Course is required"
                      : ""
                  }
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="batch"
                  textLable="Batch"
                  placeholderName="Select Batch"
                  requiredMsg="Batch is required"
                  labelMandatory
                  options={batches}
                />
              </div>
            )}
            {/* Right Column: Schedule */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-slate-50 pb-2">
                Payment Schedule
              </h4>
              <div className="space-y-4">
                <TextInput
                  control={control}
                  errors={errors}
                  name="dueDate"
                  textLable="Due Date"
                  placeholderName="YYYY-MM-DD"
                  type="date"
                  icon={<Calendar className="w-4 h-4 text-slate-400" />}
                  inputProps={{
                    disabled: selecteddueDays,
                  }}
                />
                {!["Miscellaneous Fees", "University"].includes(
                  selectedFeeType,
                ) && (
                  <>
                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-slate-100"></div>
                      <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        OR
                      </span>
                      <div className="flex-grow border-t border-slate-100"></div>
                    </div>
                    <TextInput
                      control={control}
                      errors={errors}
                      name="dueDays"
                      textLable="Due Days"
                      placeholderName="Number of days"
                      type="number"
                      inputProps={{
                        disabled: selecteddueDate,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white font-black text-xs py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              {isEditing ? "UPDATE FEE MAPPING" : "SAVE FEE MAPPING"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/master/fee-course-mapping")}
              className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 font-bold text-xs"
            >
              <RotateCcw className="w-5 h-5" />
              BACK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeCourseMappingForm;
