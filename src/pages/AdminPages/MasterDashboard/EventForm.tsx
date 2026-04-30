import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  RotateCcw,
  Save,
  Loader2,
  Calendar,
  Info,
  Type,
  FileText,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import DatePickerInput from "@/components/Inputs/DatePickerInput";
import ImageUpload from "@/components/Inputs/ImageUpload";
import { differenceInDays, startOfDay } from "date-fns";

const EventForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditing = !!id;
  const initialType = location.state?.type || "college";

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(isEditing);

  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      eventType: initialType,
      eventName: "",
      eventDescription: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
      noOfDays: 0,
      degreeId: 0,
      courseId: 0,
      eventImage: "",
    },
  });

  const eventType = watch("eventType");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Calculate noOfDays automatically
  useEffect(() => {
    if (startDate && endDate) {
      const start = startOfDay(new Date(startDate));
      const end = startOfDay(new Date(endDate));
      const diff = differenceInDays(end, start) + 1;
      setValue("noOfDays", Math.max(0, diff));
    } else {
      setValue("noOfDays", 0);
    }
  }, [startDate, endDate, setValue]);

  const fetchDropdownData = async () => {
    try {
      const degreeRes = await masterApi.getDegreeList({
        searchStr: "",
        pageNumber: 0,
      });
      setDegrees(degreeRes.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  const fetchCoursesByDegree = async (degreeId: number) => {
    if (!degreeId) {
      setCourses([]);
      return;
    }
    try {
      // Assuming getCourseList can filter by degreeId or we just filter locally
      const response = await masterApi.getCourseList({
        searchStr: "",
        pageNumber: 0,
      });
      const filtered = (response.data.responseModelList || []).filter(
        (c: any) => c.degreeId === degreeId,
      );
      setCourses(filtered);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    if (isEditing) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await masterApi.getEventById(id as string);
      const data = response.data;

      reset({
        id: data.id,
        eventType: data.eventType || "other",
        eventName: data.eventName,
        eventDescription: data.eventDescription,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        noOfDays: data.noOfDays,
        degreeId: data.degreeId,
        courseId: data.courseId,
        eventImage: data.eventImage || "",
      });

      if (data.degreeId) {
        fetchCoursesByDegree(data.degreeId);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error("Failed to load event details");
    } finally {
      setDataLoading(false);
    }
  };

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        // If course type is selected, we use that, otherwise if degree is provided it's "course"
        eventType:
          data.degreeId && data.degreeId !== 0 ? "course" : data.eventType,
        degreeId: data.degreeId || 0,
        courseId: data.courseId || 0,
        // Format dates to ISO strings for API
        startDate: data.startDate
          ? new Date(data.startDate).toISOString()
          : null,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      };

      await masterApi.saveEvent(payload);
      toast.success(
        isEditing ? "Event updated successfully" : "Event created successfully",
      );
      navigate("/admin/master/event");
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Loading Event Details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/master/event")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isEditing ? "Update" : "Add"}{" "}
              <span className="text-primary">Event</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Event Configuration
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-slate-800 text-sm">
                Event Details
              </h3>
            </div>

            <form
              id="event-form"
              onSubmit={handleSubmit(onFormSubmit)}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 gap-6">
                <TextInput
                  control={control}
                  errors={errors}
                  name="eventName"
                  textLable="Event Name"
                  placeholderName="Enter event name"
                  requiredMsg="Event name is required"
                  labelMandatory
                  startIcon={<Type className="w-4 h-4 text-slate-400" />}
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="eventDescription"
                  textLable="Description"
                  placeholderName="Brief description of the event"
                  startIcon={<FileText className="w-4 h-4 text-slate-400" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePickerInput
                    control={control}
                    errors={errors}
                    name="startDate"
                    textLable="Start Date"
                    requiredMsg="Start date is required"
                    labelMandatory
                  />
                  <DatePickerInput
                    control={control}
                    errors={errors}
                    name="endDate"
                    textLable="End Date"
                    requiredMsg="End date is required"
                    labelMandatory
                    minDate={startDate || undefined}
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                      Total Event Duration
                    </span>
                  </div>
                  <span className="text-lg font-black text-primary">
                    {watch("noOfDays")}{" "}
                    <span className="text-[10px] text-slate-400">DAYS</span>
                  </span>
                </div>

                {/* Conditional Course Selection */}
                {eventType === "course" && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Course Specific Details
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AutocompleteInput
                        control={control}
                        errors={errors}
                        name="degreeId"
                        textLable="Target Degree"
                        placeholderName="Select Degree"
                        labelMandatory
                        requiredMsg="Degree is required for course events"
                        options={degrees}
                        getOptionLabel={(opt: any) => opt.degreeName}
                        getOptionValue={(opt: any) => opt.id}
                        onChangeValue={(val: any) => {
                          const degId = val?.id || 0;
                          setValue("degreeId", degId);
                          setValue("courseId", 0);
                          fetchCoursesByDegree(degId);
                        }}
                      />
                      <AutocompleteInput
                        control={control}
                        errors={errors}
                        name="courseId"
                        textLable="Target Course"
                        placeholderName="Select Course"
                        labelMandatory
                        requiredMsg="Course is required for course events"
                        options={courses}
                        disabled={!watch("degreeId")}
                        getOptionLabel={(opt: any) => opt.courseName}
                        getOptionValue={(opt: any) => opt.id}
                        onChangeValue={(val: any) =>
                          setValue("courseId", val?.id || 0)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar: Image & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Event Image</h3>
            </div>
            <div className="p-6">
              <ImageUpload
                control={control}
                errors={errors}
                name="eventImage"
                label="Poster / Thumbnail"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-3">
            <button
              type="submit"
              form="event-form"
              disabled={loading}
              className="w-full bg-primary text-white font-black text-xs py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isEditing ? "UPDATE EVENT" : "SAVE EVENT"}
            </button>
            <button
              type="button"
              onClick={() =>
                reset({
                  id: "",
                  eventType: initialType,
                  eventName: "",
                  eventDescription: "",
                  startDate: null,
                  endDate: null,
                  noOfDays: 0,
                  degreeId: 0,
                  courseId: 0,
                  eventImage: "",
                })
              }
              className="w-full bg-slate-50 text-slate-500 font-bold text-xs py-4 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              RESET FORM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
