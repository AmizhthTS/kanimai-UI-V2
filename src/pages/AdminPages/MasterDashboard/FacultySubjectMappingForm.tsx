import React, { useState, useEffect } from "react";
import { ChevronLeft, RotateCcw, Save, Loader2, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";

const FacultySubjectMappingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
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
      facultyId: "",
      subjects: [] as any[],
    },
  });

  const selectedDegree = watch("degreeId");
  const selectedCourse = watch("courseId");

  const fetchInitialData = async () => {
    try {
      const [degRes, subRes] = await Promise.all([
        masterApi.getDegreeList({ searchStr: "", pageNumber: 0 }),
        masterApi.getAllSubjects({ searchStr: "", pageNumber: 0 }),
      ]);
      const allDegrees = degRes.data.responseModelList || [];
      const allSubjects = subRes.data.responseModelList || [];
      setDegrees(allDegrees);
      setSubjects(allSubjects);

      if (isEditing) {
        await fetchMappingDetails(id, allDegrees, allSubjects);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const fetchCoursesByDegree = async (degreeId: any) => {
    const dId = typeof degreeId === "object" ? degreeId.id : degreeId;
    if (!dId) return [];
    try {
      const response = await masterApi.getCourseList({
        searchStr: "",
        pageNumber: 0,
      });
      const filtered = (response.data.responseModelList || []).filter(
        (c: any) => c.degreeId.toString() === dId.toString(),
      );
      setCourses(filtered);
      return filtered;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };

  const fetchFacultyByCourse = async (courseId: any) => {
    const cId = typeof courseId === "object" ? courseId.id : courseId;
    if (!cId) return [];
    try {
      const response = await masterApi.getFacultyListByCourse(cId);
      const facultyList = response.data || [];
      setFaculties(facultyList);
      return facultyList;
    } catch (error) {
      console.error("Error fetching faculty:", error);
      return [];
    }
  };

  const fetchMappingDetails = async (
    mappingId: string,
    allDegrees: any[],
    allSubjects: any[],
  ) => {
    setFetching(true);
    try {
      const response = await masterApi.getFacultySubjectMappingById(mappingId);
      const data = response.data;

      if (data) {
        // 1. Construct objects from data directly to ensure immediate display
        const degreeObj = { id: data.degreeId, degreeName: data.degreeName };
        const courseObj = { id: data.courseId, courseName: data.courseName };
        const facultyObj = {
          id: data.facultyId,
          facultyName: data.facultyName,
        };

        // 2. Resolve subjects from stringified IDs
        let subjectIds: any[] = [];
        try {
          subjectIds =
            typeof data.subjects === "string"
              ? JSON.parse(data.subjects)
              : data.subjects || [];
        } catch (e) {
          console.error("Error parsing subjects string:", e);
        }

        const subjectObjs = subjectIds
          .map((sid: any) =>
            allSubjects.find((s) => s.id.toString() === sid.toString()),
          )
          .filter(Boolean);

        // 3. Set form values
        reset({
          id: data.id,
          degreeId: degreeObj.degreeName,
          courseId: courseObj.courseName,
          facultyId: facultyObj.facultyName,
          subjects: subjectObjs,
        });

        // 4. Load dependent lists in background for dropdown options
        await Promise.all([
          fetchCoursesByDegree(data.degreeId),
          fetchFacultyByCourse(data.courseId),
        ]);
      }
    } catch (error) {
      console.error("Error fetching mapping details:", error);
      toast.error("Failed to load mapping details");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (selectedDegree && !fetching) {
      fetchCoursesByDegree(selectedDegree);
      setValue("courseId", "");
      setValue("facultyId", "");
    }
  }, [selectedDegree]);

  useEffect(() => {
    if (selectedCourse && !fetching) {
      fetchFacultyByCourse(selectedCourse);
      setValue("facultyId", "");
    }
  }, [selectedCourse]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        degreeId:
          typeof data.degreeId === "object" ? data.degreeId.id : data.degreeId,
        courseId:
          typeof data.courseId === "object" ? data.courseId.id : data.courseId,
        facultyId:
          typeof data.facultyId === "object"
            ? data.facultyId.id
            : data.facultyId,
        subjects: data.subjects.map((s: any) =>
          typeof s === "object" ? s.id : s,
        ),
      };

      await masterApi.saveFacultySubjectMapping(payload);
      toast.success(
        isEditing
          ? "Mapping updated successfully"
          : "Mapping saved successfully",
      );
      navigate("/admin/master/faculty-subject-mapping");
    } catch (error) {
      console.error("Error saving mapping:", error);
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
            onClick={() => navigate("/admin/master/faculty-subject-mapping")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isEditing ? "Update" : "Add New"}{" "}
              <span className="text-primary">Faculty Mapping</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Academic Assignment
            </p>
          </div>
        </div>
      </div>

      <div className="">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Mapping Information
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Assign subjects to faculty members
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                name="facultyId"
                textLable="Faculty"
                placeholderName="Select Faculty"
                requiredMsg="Faculty is required"
                labelMandatory
                disabled={!selectedCourse}
                options={faculties}
                getOptionLabel={(opt: any) => opt.facultyName}
                getOptionValue={(opt: any) => opt.id}
              />

              <AutocompleteInput
                control={control}
                errors={errors}
                name="subjects"
                textLable="Subjects"
                placeholderName="Select Subjects"
                requiredMsg="At least one subject is required"
                labelMandatory
                multiple
                options={subjects}
                getOptionLabel={(opt: any) =>
                  `${opt.subjectName} - ${opt.subjectCode}`
                }
                getOptionValue={(opt: any) => opt.id}
              />
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
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
                {isEditing ? "UPDATE MAPPING DETAILS" : "SAVE NEW MAPPING"}
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/master/faculty-subject-mapping")
                }
                className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 font-bold text-xs"
              >
                <RotateCcw className="w-5 h-5" />
                BACK
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacultySubjectMappingForm;
