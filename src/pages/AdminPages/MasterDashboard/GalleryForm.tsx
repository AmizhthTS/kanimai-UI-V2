import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  RotateCcw,
  Save,
  Loader2,
  Image as ImageIcon,
  Type,
  FileText,
  X,
  Upload,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import { useDropzone } from "react-dropzone";

const GalleryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(isEditing);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const galleryTypes = [
    { label: "Academic", value: "Academic" },
    { label: "Sports", value: "Sports" },
    { label: "Events", value: "Events" },
    { label: "Infrastructure", value: "Infrastructure" },
    { label: "Others", value: "Others" },
  ];

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
      galleryType: "",
      degreeId: "",
      courseId: "",
      galleryName: "",
      galleryDescription: "",
    },
  });

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

  const fetchGalleryDetails = async (allDegrees: any[]) => {
    try {
      const response = await masterApi.getGalleryById(id as string);
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
      const galleryTypeObj = galleryTypes.find(
        (t) => t.value === data.galleryType,
      );
      const degreeObj = allDegrees.find(
        (d) => d.id.toString() === data.degreeId.toString(),
      );
      const courseObj = filteredCourses.find(
        (c) => c.id.toString() === data.courseId.toString(),
      );

      reset({
        id: data.id,
        galleryType: galleryTypeObj || data.galleryType,
        degreeId: degreeObj || data.degreeId,
        courseId: courseObj || data.courseId,
        galleryName: data.galleryName,
        galleryDescription: data.galleryDescription,
      });
    } catch (error) {
      console.error("Error fetching gallery details:", error);
      toast.error("Failed to load gallery details");
    } finally {
      setDataLoading(false);
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
        await fetchGalleryDetails(allDegrees);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  });

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (galleryId: string) => {
    const uploadPromises = selectedFiles.map((file) => {
      const formData = new FormData();
      formData.append("galleryId", galleryId);
      formData.append("fileName", file.name);
      formData.append("file", file);
      return masterApi.uploadGalleryImage(formData);
    });

    try {
      await Promise.all(uploadPromises);
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Some images failed to upload");
    }
  };

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        degreeId:
          typeof data.degreeId === "object" ? data.degreeId.id : data.degreeId,
        courseId:
          typeof data.courseId === "object" ? data.courseId.id : data.courseId,
        galleryType:
          typeof data.galleryType === "object"
            ? data.galleryType.value
            : data.galleryType,
      };

      const response = await masterApi.saveGallery(formattedData);
      const newGalleryId = isEditing ? data.id : response.data.id;

      if (selectedFiles.length > 0) {
        await uploadImages(newGalleryId);
      }

      toast.success(
        isEditing
          ? "Gallery updated successfully"
          : "Gallery created successfully",
      );
      navigate("/admin/master/gallery");
    } catch (error) {
      console.error("Error saving gallery:", error);
      toast.error("Failed to save gallery");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Loading Gallery Details...
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
            onClick={() => navigate("/admin/master/gallery")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isEditing ? "Update" : "Create"}{" "}
              <span className="text-primary">Gallery</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Gallery Management
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-slate-800 text-sm">
                Gallery Information
              </h3>
            </div>

            <form
              id="gallery-form"
              onSubmit={handleSubmit(onFormSubmit)}
              className="p-6 space-y-6"
            >
              <AutocompleteInput
                control={control}
                errors={errors}
                name="galleryType"
                textLable="Gallery Category"
                placeholderName="Select Category"
                requiredMsg="Category is required"
                labelMandatory
                options={galleryTypes}
                getOptionLabel={(opt: any) => opt.label}
                getOptionValue={(opt: any) => opt.value}
                onChangeValue={(val: any) =>
                  setValue("galleryType", val?.value || "")
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    const degId = val?.id || 0;
                    setValue("degreeId", degId);
                    setValue("courseId", "");
                    fetchCoursesByDegree(degId);
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
                  disabled={!watch("degreeId")}
                  getOptionLabel={(opt: any) => opt.courseName}
                  getOptionValue={(opt: any) => opt.id}
                  onChangeValue={(val: any) =>
                    setValue("courseId", val?.id || "")
                  }
                />
              </div>

              <TextInput
                control={control}
                errors={errors}
                name="galleryName"
                textLable="Gallery Title"
                placeholderName="e.g. Annual Sports Meet 2024"
                requiredMsg="Gallery title is required"
                labelMandatory
                startIcon={<Type className="w-4 h-4 text-slate-400" />}
              />

              <TextInput
                control={control}
                errors={errors}
                name="galleryDescription"
                textLable="Description"
                placeholderName="Brief description of the memories"
                requiredMsg="Description is required"
                labelMandatory
                startIcon={<FileText className="w-4 h-4 text-slate-400" />}
              />
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-3">
            <button
              type="submit"
              form="gallery-form"
              disabled={loading}
              className="w-full bg-primary text-white font-black text-xs py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              {isEditing ? "UPDATE GALLERY" : "CREATE GALLERY"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/master/gallery")}
              className="w-full bg-slate-50 text-slate-500 font-bold text-xs py-4 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Right Column: Multi-Image Upload */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Upload Photos
                </h3>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                {selectedFiles.length} Selected
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col space-y-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
                  ${isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50/50"}
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      Drag & drop photos here
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      or click to browse from your device
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                    PNG, JPG, WebP — max 5MB per file
                  </p>
                </div>
              </div>

              {/* Previews Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm"
                  >
                    <img
                      src={url}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {previewUrls.length === 0 && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-300 border-2 border-dotted border-slate-100 rounded-2xl">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-10" />
                    <p className="text-xs font-bold uppercase tracking-widest">
                      No photos selected yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryForm;
