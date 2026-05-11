import React, { useState, useEffect, useCallback } from "react";
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
import { masterApi, uploadApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import DatePickerInput from "@/components/Inputs/DatePickerInput";
import DateRangePickerInput from "@/components/Inputs/DateRangePickerInput";
import { differenceInDays, startOfDay, format, parse } from "date-fns";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, X, Upload } from "lucide-react";

const EventForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditing = !!id;
  const initialType = location.state?.type || "college";

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(isEditing);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);

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
      dateRange: { from: null, to: null } as any,
      noOfDays: 0,
      degreeId: null,
      courseId: null,
      eventImage: "",
    },
  });

  const eventType = watch("eventType");
  const startDate = watch("startDate");
  const dateRange = watch("dateRange");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setSelectedImages((prev) => [
          ...prev,
          { fileName: file.name, file: base64 },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  });

  const removeImage = (index: number) => {
    const image = selectedImages[index];
    if (image.id) {
      deleteEventImages(image.id, index);
    } else {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Calculate noOfDays automatically
  useEffect(() => {
    if (initialType === "holiday") {
      setValue("noOfDays", startDate ? 1 : 0);
    } else {
      if (dateRange?.from && dateRange?.to) {
        const start = startOfDay(new Date(dateRange.from));
        const end = startOfDay(new Date(dateRange.to));
        const diff = differenceInDays(end, start) + 1;
        setValue("noOfDays", Math.max(0, diff));
      } else if (dateRange?.from) {
        setValue("noOfDays", 1);
      } else {
        setValue("noOfDays", 0);
      }
    }
  }, [startDate, dateRange, setValue, initialType]);

  const fetchCoursesByDegree = async (degreeId: any) => {
    const dId = typeof degreeId === "object" ? degreeId.id : degreeId;
    if (!dId) {
      setCourses([]);
      return;
    }
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

  const fetchEventDetails = async (allDegrees: any[]) => {
    try {
      const response = await masterApi.getEventById(id as string);
      const data = response.data;

      // Fetch courses for the degree
      const courseRes = await masterApi.getCourseList({
        searchStr: "",
        pageNumber: 0,
      });
      const filteredCourses = (courseRes.data.responseModelList || []).filter(
        (c: any) => c.degreeId.toString() === data.degreeId.toString(),
      );
      setCourses(filteredCourses);

      // Map IDs to objects
      const degreeObj = allDegrees.find(
        (d) => d.id.toString() === data.degreeId.toString(),
      );
      const courseObj = filteredCourses.find(
        (c) => c.id.toString() === data.courseId.toString(),
      );

      reset({
        id: data.id,
        eventType: data.eventType || "other",
        eventName: data.eventName,
        eventDescription: data.eventDescription,
        startDate: data.startDate
          ? parse(data.startDate, "dd/MM/yyyy", new Date())
          : null,
        endDate: data.endDate
          ? parse(data.endDate, "dd/MM/yyyy", new Date())
          : null,
        dateRange: {
          from: data.startDate
            ? parse(data.startDate, "dd/MM/yyyy", new Date())
            : null,
          to: data.endDate
            ? parse(data.endDate, "dd/MM/yyyy", new Date())
            : null,
        },
        noOfDays: data.noOfDays,
        degreeId: degreeObj || data.degreeId,
        courseId: courseObj || data.courseId,
        eventImage: data.eventImage || "",
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error("Failed to load event details");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchEventImages = async (id: string) => {
    try {
      const response = await masterApi.getEventImages(id);
      const data = response.data;

      const formattedImages = (data || []).map((img: any) => ({
        id: img.id,
        file: img.image?.startsWith("ZGF0Y") ? atob(img.image) : img.image,
      }));

      setSelectedImages(formattedImages);
    } catch (error) {
      console.error("Error fetching event images:", error);
    }
  };

  const fetchAllData = async () => {
    try {
      const degreeRes = await masterApi.getDegreeList({
        searchStr: "",
        pageNumber: 0,
      });
      const allDegrees = degreeRes.data.responseModelList || [];
      setDegrees(allDegrees);

      if (isEditing) {
        await fetchEventDetails(allDegrees);
        await fetchEventImages(id as string);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const deleteEventImages = async (id: number, index: number) => {
    try {
      await masterApi.deleteEventImage(id);
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const finalStartDate =
        initialType === "holiday" ? data.startDate : data.dateRange?.from;
      const finalEndDate =
        initialType === "holiday"
          ? data.startDate
          : data.dateRange?.to || data.dateRange?.from;

      const payload = {
        ...data,
        // If course type is selected, we use that, otherwise if degree is provided it's "course"
        eventType:
          data.degreeId && data.degreeId !== 0 ? "course" : data.eventType,
        degreeId:
          typeof data.degreeId === "object" ? data.degreeId?.id : data.degreeId,
        courseId:
          typeof data.courseId === "object" ? data.courseId?.id : data.courseId,
        // Format dates to DD/MM/YYYY for API
        startDate: finalStartDate
          ? format(new Date(finalStartDate), "dd/MM/yyyy")
          : null,
        endDate: finalEndDate
          ? format(new Date(finalEndDate), "dd/MM/yyyy")
          : null,
        noOfDays: initialType === "holiday" ? 1 : data.noOfDays,
      };

      const response = await masterApi.saveEvent(payload);
      const eventId = isEditing ? data.id : response.data.id;

      // Handle multiple image uploads sequentially
      if (selectedImages.length > 0) {
        for (const img of selectedImages) {
          if (img.fileName) {
            const formData = new FormData();
            formData.append("eventId", eventId);
            formData.append("fileName", img.fileName);
            formData.append("file", img.file);
            formData.append("id", img.id ?? 0);
            debugger;
            await uploadApi.uploadImage(formData);
          }
        }
      }

      toast.success(
        isEditing
          ? `${typeLabel} updated successfully`
          : `${typeLabel} created successfully`,
      );
      navigate("/admin/master/event", { state: { type: initialType } });
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error(`Failed to save ${typeLabel.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = initialType === "holiday" ? "Holiday" : "Event";

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Loading {typeLabel} Details...
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
            onClick={() =>
              navigate("/admin/master/event", { state: { type: initialType } })
            }
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isEditing ? "Update" : "Add"}{" "}
              <span className="text-primary">{typeLabel}</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              {typeLabel} Configuration
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
                {typeLabel} Details
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
                  textLable={`${typeLabel} Name`}
                  placeholderName={`Enter ${typeLabel.toLowerCase()} name`}
                  requiredMsg={`${typeLabel} name is required`}
                  labelMandatory
                  startIcon={<Type className="w-4 h-4 text-slate-400" />}
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="eventDescription"
                  textLable="Description"
                  placeholderName={`Brief description of the ${typeLabel.toLowerCase()}`}
                  startIcon={<FileText className="w-4 h-4 text-slate-400" />}
                />

                {initialType === "holiday" ? (
                  <DatePickerInput
                    control={control}
                    errors={errors}
                    name="startDate"
                    textLable="Holiday Date"
                    requiredMsg="Holiday date is required"
                    labelMandatory
                  />
                ) : (
                  <DateRangePickerInput
                    control={control}
                    errors={errors}
                    name="dateRange"
                    textLable="Event Duration"
                    requiredMsg="Event dates are required"
                    labelMandatory
                  />
                )}

                {initialType !== "holiday" && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                        Total {typeLabel} Duration
                      </span>
                    </div>
                    <span className="text-lg font-black text-primary">
                      {watch("noOfDays")}{" "}
                      <span className="text-[10px] text-slate-400">DAYS</span>
                    </span>
                  </div>
                )}

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
                          // setValue("degreeId", degId);
                          setValue("courseId", "");
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
                        // onChangeValue={(val: any) =>
                        //   setValue("courseId", val?.id || 0)
                        // }
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
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {typeLabel} Images
              </h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                {selectedImages.length} Selected
              </span>
            </div>
            <div className="p-6 space-y-6">
              {/* Multi-image Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all
                  ${
                    isDragActive
                      ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      {isDragActive ? "Drop to upload" : "Add Photos"}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold mt-1">
                      PNG, JPG or WEBP (MAX. 10MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Previews Grid */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {selectedImages.map((img, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm"
                    >
                      <img
                        src={img.file}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedImages.length === 0 && (
                <div className="py-8 flex flex-col items-center justify-center text-slate-300 border-2 border-dotted border-slate-100 rounded-2xl">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-[9px] font-black uppercase tracking-widest">
                    No images added yet
                  </p>
                </div>
              )}
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
              {isEditing
                ? `UPDATE ${typeLabel.toUpperCase()}`
                : `SAVE ${typeLabel.toUpperCase()}`}
            </button>
            <button
              type="button"
              onClick={() =>
                navigate("/admin/master/event", {
                  state: { type: initialType },
                })
              }
              className="w-full bg-slate-50 text-slate-500 font-bold text-xs py-4 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
