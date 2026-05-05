import React, { useState, useEffect } from "react";
import { ChevronLeft, RotateCcw, Save, Loader2, Layers } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";

const CourseSectionMappingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

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
      degreeId: {},
      courseId: {},
      yearId: {},
      semesterId: {},
      sectionId: {},
    },
  });

  const selectedDegree = watch("degreeId");

  const fetchInitialData = async () => {
    try {
      const [degRes, yearRes, semRes, secRes] = await Promise.all([
        masterApi.getDegreeList({}),
        masterApi.getYearList({}),
        masterApi.getSemesterList({}),
        masterApi.getSectionList({}),
      ]);
      setDegrees(
        Array.isArray(degRes.data?.responseModelList)
          ? degRes.data.responseModelList
          : [],
      );
      setYears(
        Array.isArray(yearRes.data?.responseModelList)
          ? yearRes.data.responseModelList
          : [],
      );
      setSemesters(
        Array.isArray(semRes.data?.responseModelList)
          ? semRes.data.responseModelList
          : [],
      );
      setSections(
        Array.isArray(secRes.data?.responseModelList)
          ? secRes.data.responseModelList
          : [],
      );

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
      const response = await masterApi.getCourseSectionMapping(mappingId);
      const data = response.data;

      if (data) {
        // Resolve courses by degree in background
        if (data.degreeId) fetchCoursesByDegree(data.degreeId);

        reset({
          id: data.id,
          degreeId: { id: data.degreeId, degreeName: data.degreeName },
          courseId: { id: data.courseId, courseName: data.courseName },
          yearId: { id: data.yearId, yearName: data.yearName },
          semesterId: { id: data.semesterId, semesterName: data.semesterName },
          sectionId: { id: data.sectionId, sectionName: data.sectionName },
        });
        debugger;
      }
    } catch (error) {
      console.error("Error fetching mapping details:", error);
      toast.error("Failed to load mapping details");
    } finally {
      setFetching(false);
    }
  };

  const fetchCoursesByDegree = async (degreeId: any) => {
    const dId = typeof degreeId === "object" ? degreeId.id : degreeId;
    if (!dId) {
      setCourses([]);
      return;
    }
    try {
      const response = await masterApi.getCourseList({});
      const filtered = (response.data.responseModelList || []).filter(
        (c: any) => c.degreeId.toString() === dId.toString(),
      );
      setCourses(filtered);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

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
        degreeId:
          typeof data.degreeId === "object" ? data.degreeId.id : data.degreeId,
        courseId:
          typeof data.courseId === "object" ? data.courseId.id : data.courseId,
        yearId: typeof data.yearId === "object" ? data.yearId.id : data.yearId,
        semesterId:
          typeof data.semesterId === "object"
            ? data.semesterId.id
            : data.semesterId,
        sectionId:
          typeof data.sectionId === "object"
            ? data.sectionId.id
            : data.sectionId,
      };

      await masterApi.saveCourseSectionMapping(payload);
      toast.success(
        isEditing ? "Section mapping updated" : "Section mapping saved",
      );
      navigate("/admin/master/dayorder-faculty-mapping");
    } catch (error) {
      console.error("Error saving section mapping:", error);
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
          Loading Section Details...
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
            onClick={() => navigate("/admin/master/dayorder-faculty-mapping")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isEditing ? "Update" : "New"}{" "}
              <span className="text-primary">Section Mapping</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Assign Sections to Academic Courses
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Course-Section Configuration
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Define the academic scope for timetabling
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-6">
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
            />

            <AutocompleteInput
              control={control}
              errors={errors}
              name="courseId"
              textLable="Course"
              placeholderName="Select Course"
              requiredMsg="Course is required"
              labelMandatory
              disabled={!selectedDegree}
              options={courses}
              getOptionLabel={(opt: any) => opt.courseName}
              getOptionValue={(opt: any) => opt.id}
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
            />

            <div className="md:col-span-2">
              <AutocompleteInput
                control={control}
                errors={errors}
                name="sectionId"
                textLable="Section"
                placeholderName="Select Section"
                requiredMsg="Section is required"
                labelMandatory
                options={sections}
                getOptionLabel={(opt: any) => opt.sectionName}
                getOptionValue={(opt: any) => opt.id}
              />
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
              {isEditing ? "UPDATE MAPPING" : "SAVE MAPPING"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/master/dayorder-faculty-mapping")}
              className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 font-bold text-xs"
            >
              <RotateCcw className="w-5 h-5" />
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseSectionMappingForm;
