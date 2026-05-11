import React, { useState, useEffect } from "react";
import { parse, isValid, format } from "date-fns";
import {
  User,
  ChevronLeft,
  Save,
  X,
  Plus,
  Trash2,
  Loader2,
  Info,
  Building2,
  Calendar,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Heart,
  Globe,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { masterApi, facultyApi } from "@/services/api";
import { toast } from "sonner";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

// Standard Inputs
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import DatePickerInput from "@/components/Inputs/DatePickerInput";
import ImageUpload from "@/components/Inputs/ImageUpload";

const FacultyBioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Master Data
  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const [designations, setDesignations] = useState<any[]>([]);
  const categories = [
    {
      id: "1",
      name: "Teaching Staff",
    },
    {
      id: "2",
      name: "Non Teaching Staff",
    },
  ];

  const {
    handleSubmit,
    control,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      facultyName: "",
      employeeId: "",
      doj: null,
      designationId: null,
      staffCategoryId: null,
      departmentId: null,
      degreeId: null,
      courseId: null,
      specialAreas: "",
      employeeMail: "",
      bloodGroup: "",
      facultyImage: "", // used for faculty image
      religion: "",
      community: "",
      caste: "",
      experience: "",
      experienceMon: "",
      phonenumber: "",
      qualification: "",
      emailid: "",
      dob: null,
      maritalStatus: "",
      gender: "",
      emergencyName: "",
      emergencyNumber: "",
      address1: "",
      address2: "",
      state: "Tamil Nadu",
      district: "",
      country: "India",
      pincode: "",
      status: 1,
      facultyExp: [
        {
          instituteName: "",
          startDate: null,
          endDate: null,
          yearsOfExp: "",
          yearsOfExpMon: "",
          designation: "",
        },
      ],
    },
  });
  const staffCategoryIdData = watch("staffCategoryId");
  console.log(staffCategoryIdData);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "facultyExp",
  });

  const selectedDegree = watch("degreeId");

  const fetchMasterData = async () => {
    try {
      const [degRes, deptRes, desigRes] = await Promise.all([
        masterApi.getDegreeList({}),
        masterApi.getDepartmentList({}),
        // masterApi.getStaffCategoryList({}),
        masterApi.getDesignationList({}),
      ]);
      setDegrees(degRes.data.responseModelList || []);
      setDepartments(deptRes.data.responseModelList || []);
      // setCategories(catRes.data.responseModelList || []);
      setDesignations(desigRes.data.responseModelList || []);

      if (isEdit) await fetchFacultyData();
    } catch (error) {
      console.error("Error fetching master data:", error);
    }
  };

  const fetchCourses = async (degree: any) => {
    const degId = typeof degree === "object" ? degree.id : degree;
    if (!degId) {
      setCourses([]);
      return;
    }
    try {
      const response = await masterApi.getCourseList({});
      const filtered = (response.data.responseModelList || []).filter(
        (c: any) => c.degreeId.toString() === degId.toString(),
      );
      setCourses(filtered);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchFacultyData = async () => {
    if (!id) return;
    setFetching(true);
    try {
      const response = await facultyApi.getFacultyById(id);
      const data = response.data;
      if (data) {
        // Parse dates
        const parseDate = (d: any) => {
          if (!d) return null;
          const parsed = parse(d, "dd/MM/yyyy", new Date());
          return isValid(parsed) ? parsed : new Date(d);
        };

        // Handle nested exp
        const mappedExp = (data.facultyExp || []).map((exp: any) => ({
          ...exp,
          startDate: parseDate(exp.startDate),
          endDate: parseDate(exp.endDate),
        }));

        reset({
          ...data,
          doj: parseDate(data.doj),
          dob: parseDate(data.dob),
          facultyExp:
            mappedExp.length > 0
              ? mappedExp
              : [
                  {
                    instituteName: "",
                    startDate: null,
                    endDate: null,
                    yearsOfExp: "",
                    yearsOfExpMon: "",
                    designation: "",
                  },
                ],
          facultyImage: data.facultyImage || "",
        });

        if (data.degreeId) fetchCourses(data.degreeId);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
      toast.error("Failed to load faculty data");
    } finally {
      setFetching(false);
    }
  };
  const fetchFacultyImage = async () => {
    if (!id) return;
    setFetching(true);
    try {
      const response = await facultyApi.getFacultyImage(id);
      const data = response.data;
      if (data?.image) {
        reset({
          ...getValues(),
          facultyImage: data.image.startsWith("ZGF0Y")
            ? atob(data.image)
            : data.image,
        });
      }
    } catch (error) {
      console.error("Error fetching faculty image:", error);
      toast.error("Failed to load faculty image");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, [id]);

  useEffect(() => {
    if (selectedDegree) {
      fetchCourses(selectedDegree);
    }
  }, [selectedDegree]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const extractId = (val: any) =>
        val && typeof val === "object" ? val.id : val;
      const formatDate = (d: any) =>
        d && isValid(new Date(d)) ? format(new Date(d), "dd/MM/yyyy") : "";

      const payload = {
        ...data,
        doj: formatDate(data.doj),
        dob: formatDate(data.dob),
        degreeId: extractId(data.degreeId),
        courseId: extractId(data.courseId),
        departmentId: extractId(data.departmentId),
        staffCategoryId: extractId(data.staffCategoryId),
        designationId: extractId(data.designationId),
        gender: extractId(data.gender),
        bloodGroup: extractId(data.bloodGroup),
        facultyExp: (data.facultyExp || []).map((exp: any) => ({
          ...exp,
          startDate: formatDate(exp.startDate),
          endDate: formatDate(exp.endDate),
        })),
      };

      delete (payload as any).facultyImage;

      const response = await facultyApi.saveFaculty(payload);
      if (response.data.status === "SUCCESS") {
        const facultyId = response.data.id || id;
        // Upload faculty image if a new one is selected
        if (
          data.facultyImage &&
          typeof data.facultyImage === "object" &&
          data.facultyImage.file
        ) {
          try {
            const imageFormData = new FormData();
            imageFormData.append("file", data.facultyImage.file);
            imageFormData.append("fileName", data.facultyImage.fileName);
            await facultyApi.saveFacultyImage(facultyId, imageFormData);
          } catch (imageError) {
            console.error("Faculty image upload error:", imageError);
            toast.error("Bio saved, but image failed to upload");
          }
        }
        toast.success(
          isEdit
            ? "Faculty updated successfully"
            : "Faculty added successfully",
        );
        navigate("/admin/faculty/bio");
      } else {
        toast.error(response.data.message || "Failed to save faculty");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Loading Faculty Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate("/admin/faculty/bio")}
            className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-all border border-slate-100 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner rotate-3">
              <Briefcase className="w-7 h-7 -rotate-3" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                {isEdit ? "Update" : "Add"}{" "}
                <span className="text-primary">Faculty</span>
              </h1>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">
                Biographical & Experience Records
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/faculty/bio")}
            className="px-6 py-3 bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl border border-slate-100 hover:bg-slate-100 transition-all flex items-center gap-2.5 active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
            Dismiss
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="px-8 py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2.5 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            SAVE CHANGES
          </button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 mb-6 sm:mx-0 sm:px-0">
          <TabsList className="bg-slate-100/50 p-1 rounded-2xl gap-1.5 sm:gap-2 inline-flex h-auto border border-slate-100 w-max sm:w-auto">
            <TabsTrigger
              value="details"
              className="rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all flex items-center shrink-0"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Personal Details
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all flex items-center shrink-0"
            >
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Work Experience
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="details"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-0"
        >
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Info */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Basic Credentials
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Primary Staff Identity
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <TextInput
                  control={control}
                  errors={errors}
                  name="facultyName"
                  textLable="Faculty Name"
                  placeholderName="Full Name"
                  labelMandatory
                  requiredMsg="Please enter the faculty name"
                  startIcon={<User className="w-4 h-4 text-slate-400" />}
                />
                {/* <TextInput
                  control={control}
                  errors={errors}
                  name="employeeId"
                  textLable="Employee ID"
                  placeholderName="EMP-000"
                /> */}
                <DatePickerInput
                  control={control}
                  errors={errors}
                  name="doj"
                  textLable="Date of Joining"
                  placeholderName="DD/MM/YYYY"
                  labelMandatory
                  requiredMsg="Please select the date of joining"
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="departmentId"
                  textLable="Department"
                  placeholderName="Select department"
                  labelMandatory
                  requiredMsg="Please select the department"
                  options={departments}
                  getOptionLabel={(opt) => opt.department}
                  getOptionValue={(opt) => opt.id}
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="designationId"
                  textLable="Designation"
                  placeholderName="Select designation"
                  labelMandatory
                  requiredMsg="Please select the designation"
                  options={designations}
                  getOptionLabel={(opt) => opt.designationName}
                  getOptionValue={(opt) => opt.id}
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="staffCategoryId"
                  textLable="Staff Category"
                  placeholderName="Select category"
                  labelMandatory
                  requiredMsg="Please select the staff category"
                  options={categories}
                  getOptionLabel={(opt) => opt.name}
                  getOptionValue={(opt) => opt.id}
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="qualification"
                  textLable="Qualification"
                  placeholderName="e.g. M.E., Ph.D"
                  labelMandatory
                  requiredMsg="Please enter the qualification"
                />

                <div className="md:col-span-2">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="specialAreas"
                    textLable="Special Areas"
                    placeholderName="e.g. Machine Learning, Cloud Computing"
                    labelMandatory
                    requiredMsg="Please enter the special areas"
                  />
                </div>
              </div>
            </section>

            {/* Academic Link (Optional) */}
            {staffCategoryIdData?.id === "1" && (
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight text-sm">
                    Academic Link (For Teaching Staff)
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AutocompleteInput
                    control={control}
                    errors={errors}
                    name="degreeId"
                    textLable="Degree"
                    placeholderName="Please select the degree"
                    options={degrees}
                    labelMandatory
                    requiredMsg="Please select the degree"
                    getOptionLabel={(opt) => opt.degreeName}
                    getOptionValue={(opt) => opt.id}
                  />
                  <AutocompleteInput
                    control={control}
                    errors={errors}
                    name="courseId"
                    textLable="Course"
                    placeholderName="Please select the course"
                    options={courses}
                    labelMandatory
                    requiredMsg="Please select the course"
                    disabled={!selectedDegree}
                    getOptionLabel={(opt) => opt.courseName}
                    getOptionValue={(opt) => opt.id}
                  />
                </div>
              </section>
            )}

            {/* Contact & Personal */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                  <Heart className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight text-sm">
                  Personal & Contact
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput
                  control={control}
                  errors={errors}
                  name="emailid"
                  textLable="Email Address"
                  placeholderName="faculty@college.com"
                  labelMandatory
                  requiredMsg="Please enter the email address"
                  startIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  validate={(value: string) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                      return "Invalid email address";
                    }
                    return true;
                  }}
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="phonenumber"
                  textLable="Phone Number"
                  placeholderName="10-digit"
                  labelMandatory
                  requiredMsg="Please enter the phone number"
                  startIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  inputProps={{
                    maxLength: 10,
                  }}
                />
                <DatePickerInput
                  control={control}
                  errors={errors}
                  name="dob"
                  textLable="Date of Birth"
                  placeholderName="DD/MM/YYYY"
                  labelMandatory
                  requiredMsg="Please select the date of birth"
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="gender"
                  textLable="Gender"
                  placeholderName="Select gender"
                  options={[
                    { id: "Male", label: "Male" },
                    { id: "Female", label: "Female" },
                    { id: "Other", label: "Other" },
                  ]}
                  getOptionLabel={(o) => o.label}
                  getOptionValue={(o) => o.id}
                  labelMandatory
                  requiredMsg="Please select the gender"
                />
                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="maritalStatus"
                  textLable="Marital Status"
                  placeholderName="Select marital status"
                  options={["Single", "Married", "Divorced", "Widowed"]}
                  getOptionLabel={(o) => o}
                  getOptionValue={(o) => o}
                  labelMandatory
                  requiredMsg="Please select the marital status"
                />
                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="bloodGroup"
                  textLable="Blood Group"
                  placeholderName="Select blood group"
                  options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                  getOptionLabel={(o) => o}
                  getOptionValue={(o) => o}
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="religion"
                  textLable="Religion"
                  placeholderName="Enter Religion"
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="community"
                  textLable="Community"
                  placeholderName="Enter Community"
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="caste"
                  textLable="Caste"
                  placeholderName="Enter Caste"
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 mb-5 -mx-6 -mt-6">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">
                  Faculty Artifact
                </h3>
              </div>
              <ImageUpload
                control={control}
                errors={errors}
                name="facultyImage"
                label="Profile Image"
              />
            </section>

            {/* Emergency Contact */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 mb-5 -mx-6 -mt-6 text-rose-500">
                <h3 className="font-black text-xs uppercase tracking-widest">
                  Emergency Contact
                </h3>
              </div>
              <div className="space-y-4">
                <TextInput
                  control={control}
                  errors={errors}
                  name="emergencyName"
                  textLable="Contact Name"
                  placeholderName="Full Name"
                  labelMandatory
                  requiredMsg="Please enter the contact name"
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="emergencyNumber"
                  textLable="Contact Number"
                  placeholderName="10-digit"
                  labelMandatory
                  requiredMsg="Please enter the contact number"
                  inputProps={{
                    maxLength: 10,
                  }}
                />
              </div>
            </section>

            {/* Address */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 mb-5 -mx-6 -mt-6 text-indigo-500">
                <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  Address Info
                </h3>
              </div>
              <div className="space-y-4">
                <TextInput
                  control={control}
                  errors={errors}
                  name="address1"
                  textLable="Line 1"
                  placeholderName="Street/Door No"
                  labelMandatory
                  requiredMsg="Please enter the address"
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="address2"
                  textLable="Line 2"
                  placeholderName="Area/Landmark"
                  labelMandatory
                  requiredMsg="Please enter the address"
                />
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="district"
                    textLable="District"
                    placeholderName="District"
                    labelMandatory
                    requiredMsg="Please enter the district"
                  />
                  <TextInput
                    control={control}
                    errors={errors}
                    name="pincode"
                    textLable="Pincode"
                    placeholderName="6xxxxx"
                    labelMandatory
                    requiredMsg="Please enter the pincode"
                    inputProps={{
                      maxLength: 6,
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent
          value="experience"
          className="animate-in slide-in-from-bottom-4 duration-500 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Professional History
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Academic & Industry Experience
              </p>
            </div>
            <button
              onClick={() =>
                append({
                  instituteName: "",
                  startDate: null,
                  endDate: null,
                  yearsOfExp: "",
                  yearsOfExpMon: "",
                  designation: "",
                })
              }
              className="px-6 py-3 bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card
                key={field.id}
                className="rounded-2xl p-8 border-slate-100 shadow-sm relative overflow-hidden group"
              >
                <button
                  onClick={() => remove(index)}
                  className="absolute top-6 right-6 p-2 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <TextInput
                      control={control}
                      errors={errors}
                      name={`facultyExp.${index}.instituteName`}
                      textLable="Institute/Organization Name"
                      placeholderName="Enter Name"
                      labelMandatory
                      requiredMsg="Please enter the institute name"
                    />
                  </div>
                  <TextInput
                    control={control}
                    errors={errors}
                    name={`facultyExp.${index}.designation`}
                    textLable="Designation"
                    placeholderName="e.g. Assistant Professor"
                    labelMandatory
                    requiredMsg="Please enter the designation"
                  />
                  <DatePickerInput
                    control={control}
                    errors={errors}
                    name={`facultyExp.${index}.startDate`}
                    textLable="Start Date"
                  />
                  <DatePickerInput
                    control={control}
                    errors={errors}
                    name={`facultyExp.${index}.endDate`}
                    textLable="End Date"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      control={control}
                      errors={errors}
                      name={`facultyExp.${index}.yearsOfExp`}
                      textLable="Years"
                      placeholderName="YY"
                    />
                    <TextInput
                      control={control}
                      errors={errors}
                      name={`facultyExp.${index}.yearsOfExpMon`}
                      textLable="Months"
                      placeholderName="MM"
                    />
                  </div>
                </div>
              </Card>
            ))}

            {fields.length === 0 && (
              <div className="py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                <Briefcase className="w-12 h-12 text-slate-200" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  No experience records added
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyBioForm;
