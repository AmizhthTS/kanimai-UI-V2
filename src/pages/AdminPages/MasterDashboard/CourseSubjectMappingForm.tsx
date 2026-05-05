import React, { useState, useEffect } from "react";
import { ChevronLeft, RotateCcw, Save, Loader2, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";

const CourseSubjectMappingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(isEditing);

  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

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
      degreeId: "",
      courseId: "",
      yearId: "",
      semesterId: "",
      subjects: [] as any[],
    },
  });

  const selectedDegree = watch("degreeId");

  const fetchCoursesByDegree = async (degreeId: any) => {
    const dId = typeof degreeId === "object" ? degreeId.id : degreeId;
    if (!dId) return;
    try {
      const response = await masterApi.getCourseList({
        searchStr: "",
        pageNumber: 0,
      });
      const filtered = (response.data.responseModelList || []).filter(
        (c: any) => c.degreeId.toString() === dId.toString(),
      );
      setCourses(filtered);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchMappingDetails = async (
    allDegrees: any[],
    allYears: any[],
    allSemesters: any[],
    allSubjects: any[],
  ) => {
    try {
      const response = await masterApi.getSubjectMappingById(id as string);
      const data = response.data;

      // Parse subjects if it's a JSON string
      let subjectIds: number[] = [];
      try {
        subjectIds =
          typeof data.subjects === "string"
            ? JSON.parse(data.subjects)
            : data.subjects || [];
      } catch (e) {
        console.error("Error parsing subjects:", e);
      }

      // Fetch courses for the degree first
      const courseRes = await masterApi.getCourseList({
        searchStr: "",
        pageNumber: 0,
      });
      const filteredCourses = (courseRes.data.responseModelList || []).filter(
        (c: any) => c.degreeId.toString() === data.degreeId.toString(),
      );
      setCourses(filteredCourses);

      // Map IDs to objects
      const degreeObj = allDegrees.find((d) => d.id === data.degreeId);
      const courseObj = filteredCourses.find((c) => c.id === data.courseId);
      const yearObj = allYears.find((y) => y.id === data.yearId);
      const semesterObj = allSemesters.find((s) => s.id === data.semesterId);
      const subjectObjs = subjectIds
        .map((sid) => allSubjects.find((s) => s.id === sid))
        .filter(Boolean);

      reset({
        id: data.id,
        degreeId: degreeObj || data.degreeId,
        courseId: courseObj || data.courseId,
        yearId: yearObj || data.yearId,
        semesterId: semesterObj || data.semesterId,
        subjects: subjectObjs.length > 0 ? subjectObjs : subjectIds,
      });
    } catch (error) {
      console.error("Error fetching mapping details:", error);
      toast.error("Failed to load mapping details");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [degRes, yearRes, semRes, subRes] = await Promise.all([
        masterApi.getDegreeList({ searchStr: "", pageNumber: 0 }),
        masterApi.getYearList({ searchStr: "", pageNumber: 0 }),
        masterApi.getSemesterList({ searchStr: "", pageNumber: 0 }),
        masterApi.getAllSubjects({ searchStr: "", pageNumber: 0 }),
      ]);

      const allDegrees = degRes.data.responseModelList || [];
      const allYears = yearRes.data.responseModelList || [];
      const allSemesters = semRes.data.responseModelList || [];
      const allSubjects = subRes.data.responseModelList || [];

      setDegrees(allDegrees);
      setYears(allYears);
      setSemesters(allSemesters);
      setSubjects(allSubjects);

      if (isEditing) {
        await fetchMappingDetails(
          allDegrees,
          allYears,
          allSemesters,
          allSubjects,
        );
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  useEffect(() => {
    if (selectedDegree && !dataLoading) {
      fetchCoursesByDegree(selectedDegree);
    }
  }, [selectedDegree, dataLoading]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        degreeId:
          typeof data.degreeId === "object" ? data.degreeId.id : data.degreeId,
        courseId:
          typeof data.courseId === "object" ? data.courseId.id : data.courseId,
        yearId: typeof data.yearId === "object" ? data.yearId.id : data.yearId,
        semesterId:
          typeof data.semesterId === "object"
            ? data.semesterId.id
            : data.semesterId,
        subjects: data.subjects.map((s: any) =>
          typeof s === "object" ? s.id : s,
        ),
      };

      await masterApi.saveSubjectMapping(payload);
      toast.success(
        isEditing
          ? "Mapping updated successfully"
          : "Mapping saved successfully",
      );
      navigate("/admin/master/course-subject-mapping");
    } catch (error) {
      console.error("Error saving mapping:", error);
      toast.error("Failed to save mapping");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Loading Details...
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
            onClick={() => navigate("/admin/master/course-subject-mapping")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isEditing ? "Update" : "Add"}{" "}
              <span className="text-primary">Subject Mapping</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Course - Semester Configuration
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-slate-800 text-sm">
            Mapping Configuration
          </h3>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AutocompleteInput
              control={control}
              errors={errors}
              name="degreeId"
              textLable="Degree"
              placeholderName="Select Degree"
              requiredMsg="Degree is required"
              labelMandatory
              options={degrees}
              getOptionLabel={(opt: any) => opt.degreeName}
              getOptionValue={(opt: any) => opt.id}
              onChangeValue={(val: any) => {
                setValue("degreeId", val?.id || "");
                setValue("courseId", "");
              }}
            />

            <AutocompleteInput
              control={control}
              errors={errors}
              name="courseId"
              textLable="Course"
              placeholderName="Select Course"
              requiredMsg="Course is required"
              labelMandatory
              options={courses}
              disabled={!selectedDegree}
              getOptionLabel={(opt: any) => opt.courseName}
              getOptionValue={(opt: any) => opt.id}
              onChangeValue={(val: any) => setValue("courseId", val?.id || "")}
            />

            <AutocompleteInput
              control={control}
              errors={errors}
              name="yearId"
              textLable="Year"
              placeholderName="Select Year"
              requiredMsg="Year is required"
              labelMandatory
              options={years}
              getOptionLabel={(opt: any) => opt.yearName}
              getOptionValue={(opt: any) => opt.id}
              onChangeValue={(val: any) => setValue("yearId", val?.id || "")}
            />

            <AutocompleteInput
              control={control}
              errors={errors}
              name="semesterId"
              textLable="Semester"
              placeholderName="Select Semester"
              requiredMsg="Semester is required"
              labelMandatory
              options={semesters}
              getOptionLabel={(opt: any) => opt.semesterName}
              getOptionValue={(opt: any) => opt.id}
              onChangeValue={(val: any) =>
                setValue("semesterId", val?.id || "")
              }
            />

            <div className="md:col-span-2">
              <AutocompleteInput
                control={control}
                errors={errors}
                name="subjects"
                textLable="Subjects"
                placeholderName="Select multiple subjects"
                requiredMsg="At least one subject is required"
                labelMandatory
                multiple
                options={subjects}
                getOptionLabel={(opt: any) =>
                  `${opt.subjectName} - ${opt.subjectCode}`
                }
                getOptionValue={(opt: any) => opt.id}
                onChangeValue={(val: any) => setValue("subjects", val || [])}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-8 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 max-w-xs bg-primary text-white font-black text-xs py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              {isEditing ? "UPDATE MAPPING" : "SAVE MAPPING"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/master/course-subject-mapping")}
              className="px-8 py-4 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseSubjectMappingForm;
