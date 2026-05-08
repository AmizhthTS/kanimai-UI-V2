import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  RotateCcw,
  Save,
  Loader2,
  Info,
  BookOpen,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [degrees, setDegrees] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      degreeId: "",
      courseName: "",
      shortName: "",
      semesterId: "",
      courseType: "Semester",
      batch: "",
    },
  });

  const courseType = watch("courseType");

  const fetchCourseDetails = async (
    courseId: string,
    allDegrees: any[],
    allSemesters: any[],
    allYears: any[],
  ) => {
    setFetching(true);
    try {
      const response = await masterApi.getCourseById(courseId);
      const course = response.data;

      if (course) {
        // Map IDs to objects for Autocomplete inputs
        const degreeObj = allDegrees.find(
          (d) => d.id.toString() === course.degreeId.toString(),
        );
        const semesterObj = allSemesters.find(
          (s) => s.id.toString() === course.semesterId.toString(),
        );
        const yearObj = allYears.find((y) => y.yearName === course.batch);

        reset({
          id: course.id,
          degreeId: degreeObj || course.degreeId,
          courseName: course.courseName,
          shortName: course.shortName,
          semesterId: semesterObj || course.semesterId,
          courseType: course.courseType || "Semester",
          batch: yearObj || course.batch,
        });
      } else {
        toast.error("Course not found");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course details");
    } finally {
      setFetching(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [degreeRes, semRes] = await Promise.all([
        masterApi.getDegreeList({}),
        masterApi.getSemesterList({}),
        // masterApi.getYearList({ searchStr: "", pageNumber: 0 }),
      ]);

      const allDegrees = degreeRes.data.responseModelList || [];
      const allSemesters = semRes.data.responseModelList || [];
      // const allYears = yearRes.data.responseModelList || [];

      setDegrees(allDegrees);
      setSemesters(allSemesters);
      // setYears(allYears);

      if (id) {
        await fetchCourseDetails(id, allDegrees, allSemesters, years);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };
  const generateYearList = () => {
    const currentYear = new Date().getFullYear();
    const minYears = 15;
    const yearList = [];
    for (let i = currentYear; i > currentYear - minYears; i--) {
      yearList.push(i.toString());
    }
    setYears(yearList);
  };
  useEffect(() => {
    generateYearList();
    fetchAllData();
  }, [id]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Need to transform Autocomplete data if it's an object
      const formattedData = {
        ...data,
        degreeId:
          typeof data.degreeId === "object" ? data.degreeId.id : data.degreeId,
        semesterId:
          typeof data.semesterId === "object"
            ? data.semesterId.id
            : data.semesterId,
        batch:
          typeof data.batch === "object" ? data.batch.yearName : data.batch,
      };

      await masterApi.saveCourse(formattedData);
      toast.success(
        id ? "Course updated successfully" : "Course saved successfully",
      );
      navigate("/admin/master/course");
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Loading Course Details...
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
            onClick={() => navigate("/admin/master/course")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {id ? "Update" : "Add New"}{" "}
              <span className="text-primary">Course</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Course Management
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Course Information
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Enter course details below
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Degree */}
              <AutocompleteInput
                control={control}
                errors={errors}
                name="degreeId"
                textLable="Degree"
                placeholderName="Select Degree"
                requiredMsg="Degree is required"
                options={degrees}
                getOptionLabel={(opt: any) => opt.degreeName}
                getOptionValue={(opt: any) => opt.id}
                // onChangeValue={(val: any) =>
                //   setValue("degreeId", val?.id || "")
                // }
              />

              {/* Course Name */}
              <TextInput
                control={control}
                errors={errors}
                name="courseName"
                textLable="Course Name"
                placeholderName="e.g. Bachelor of Arts in Tamil"
                requiredMsg="Course name is required"
                labelMandatory
              />

              {/* Short Name */}
              <TextInput
                control={control}
                errors={errors}
                name="shortName"
                textLable="Short Name"
                placeholderName="e.g. B.A.TAM"
                requiredMsg="Short name is required"
                labelMandatory
                endIcon={<Info className="w-4 h-4" />}
              />

              {/* Final Semester */}
              <AutocompleteInput
                control={control}
                errors={errors}
                name="semesterId"
                textLable="Final Semester"
                placeholderName="Select Semester"
                requiredMsg="Final semester is required"
                options={semesters}
                getOptionLabel={(opt: any) => opt.semesterName}
                getOptionValue={(opt: any) => opt.id}
                // onChangeValue={(val: any) =>
                //   setValue("semesterId", val?.id || "")
                // }
              />

              {/* Starting Year / Batch */}
              <AutocompleteInput
                control={control}
                errors={errors}
                name="batch"
                textLable="Starting Year / Batch"
                placeholderName="Select Year"
                requiredMsg="Starting year is required"
                options={years}
              />

              {/* Course Type Toggle */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Course System
                </label>
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl w-full">
                  <button
                    type="button"
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-black transition-all",
                      courseType === "Semester"
                        ? "bg-white text-primary shadow-sm ring-1 ring-slate-100"
                        : "text-slate-400 hover:text-slate-600",
                    )}
                    onClick={() => setValue("courseType", "Semester")}
                  >
                    SEMESTER SYSTEM
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-black transition-all",
                      courseType === "Trimester"
                        ? "bg-white text-primary shadow-sm ring-1 ring-slate-100"
                        : "text-slate-400 hover:text-slate-600",
                    )}
                    onClick={() => setValue("courseType", "Trimester")}
                  >
                    TRIMESTER SYSTEM
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 max-w-xs bg-primary text-white font-black text-xs py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                {id ? "UPDATE COURSE DETAILS" : "SAVE NEW COURSE"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/master/course")}
                className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 font-bold text-xs"
              >
                <RotateCcw className="w-5 h-5" />
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
