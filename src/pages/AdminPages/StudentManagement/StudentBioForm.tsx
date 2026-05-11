import React, { useState, useEffect } from "react";
import { parse, isValid, format } from "date-fns";
import {
  User,
  ChevronLeft,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Info,
  Users,
  Building2,
  CreditCard,
  Gift,
  FileText,
  Calendar,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { masterApi, studentApi } from "@/services/api";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { validateAadharNumber } from "@/utils";
import { validateAlphaNumericOnly } from "@/utils";

// Standard Inputs
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import DatePickerInput from "@/components/Inputs/DatePickerInput";
import CheckboxInput from "@/components/Inputs/CheckboxInput";
import ImageUpload from "@/components/Inputs/ImageUpload";

const StudentBioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Master Data
  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [transportFees, setTransportFees] = useState<any[]>([]);

  // Documents
  const [documents, setDocuments] = useState<any[]>([
    {
      docname: "",
      filedata: "",
      filename: "",
      filetype: "",
      studentid: id || "",
    },
  ]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      studentName: "",
      doj: "",
      degreeId: "",
      semesterId: "",
      courseId: "",
      batch: "",
      sectionId: "",
      appNo: "",
      lateralEntry: false,
      status: 1,
      rollNo: "",
      regno: "",
      emisNumber: "",
      adhaarno: "",
      phonenumber: "",
      whatsappNumber: "",
      instituteName: "",
      previousMark: "",
      previousDegree: "",
      religion: "",
      community: "",
      caste: "",
      emailid: "",
      dob: "",
      gender: "",
      bloodGroup: "",
      hosteler: false,
      mess: false,
      transport: false,
      previouslyPursued: false,
      fatherName: "",
      motherName: "",
      fatherMobNumber: "",
      motherMobNumber: "",
      fatherOccupation: "",
      motherOccupation: "",
      address1: "",
      address2: "",
      state: "Tamil Nadu",
      district: "Virudhunagar",
      country: "India",
      pincode: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      concessionType: "noConcession",
      concessionRefName: "",
      concessionDate: "",
      concessionRemarks: "",
      referralName: "",
      referralRemarks: "",
      alumniStudent: false,
      busNo: "",
      studentImage: "",
    },
  });

  const selectedDegree = watch("degreeId");
  const transportAvail = watch("transport");
  const fetchMasterData = async () => {
    try {
      const [degRes, semRes, secRes] = await Promise.all([
        masterApi.getDegreeList({}),
        masterApi.getSemesterList({}),
        masterApi.getSectionList({}),
      ]);
      const allDegrees = degRes.data.responseModelList || [];
      const allSemesters = semRes.data.responseModelList || [];
      const allSections = secRes.data.responseModelList || [];

      setDegrees(allDegrees);
      setSemesters(allSemesters);
      setSections(allSections);

      // Generate Batches
      const currentYear = new Date().getFullYear();
      const batchList = [];
      for (let i = currentYear + 1; i > currentYear - 5; i--) {
        batchList.push(i.toString());
      }
      setBatches(batchList);

      if (isEdit) await fetchStudentData(allDegrees, allSemesters, allSections);
      if (isEdit) await fetchStudentImage();
    } catch (error) {
      console.error("Error fetching master data:", error);
    }
  };
  useEffect(() => {
    const fetchTransportFees = async () => {
      if (transportAvail) {
        try {
          const response = await masterApi.getFeeNamesByType("Transport");
          setTransportFees(response.data.responseModelList || []);
        } catch (error) {
          console.error("Error fetching transport fees:", error);
        }
      }
    };
    fetchTransportFees();
  }, [transportAvail]);

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

  const fetchStudentData = async (
    allDegrees: any[],
    allSemesters: any[],
    allSections: any[],
  ) => {
    if (!id) return;
    setFetching(true);
    try {
      const response = await studentApi.getStudentById(id);
      const data = response.data;
      if (data) {
        // Find objects for Autocomplete
        const degreeObj = allDegrees.find(
          (d) => d.id.toString() === data.degreeId?.toString(),
        );
        const semesterObj = allSemesters.find(
          (s) => s.id.toString() === data.semesterId?.toString(),
        );
        const sectionObj = allSections.find(
          (s) => s.id.toString() === data.sectionId?.toString(),
        );

        // Handle Course Mapping
        let courseObj = data.courseId;
        const degId = degreeObj?.id || data.degreeId;
        if (degId) {
          const courseRes = await masterApi.getCourseList({});
          const filteredCourses = (
            courseRes.data.responseModelList || []
          ).filter((c: any) => c.degreeId.toString() === degId.toString());
          setCourses(filteredCourses);
          courseObj =
            filteredCourses.find(
              (c) => c.id.toString() === data.courseId?.toString(),
            ) || data.courseId;
        }
        const parseToDate = (dateStr: any) => {
          if (!dateStr) return null;
          if (dateStr instanceof Date) return dateStr;
          const formats = ["dd/MM/yyyy", "dd/MM/yy", "yyyy-MM-dd"];
          for (const fmt of formats) {
            const parsed = parse(dateStr, fmt, new Date());
            if (isValid(parsed)) return parsed;
          }
          const native = new Date(dateStr);
          return isValid(native) ? native : null;
        };

        const doj = parseToDate(data.doj);
        const dob = parseToDate(data.dob);
        const concessionDate = parseToDate(data.concessionDate);

        reset({
          ...data,
          doj: doj,
          dob: dob,
          concessionDate: concessionDate,
          degreeId: degreeObj || data.degreeId,
          semesterId: semesterObj || data.semesterId,
          sectionId: sectionObj || data.sectionId,
          courseId: courseObj,
          studentImage: data.studentImage?.startsWith("ZGF0Y")
            ? atob(data.studentImage)
            : data.studentImage,
          concessionType:
            data.qualConcession === "Yes"
              ? "qualConcession"
              : data.familyConcession === "Yes"
                ? "familyConcession"
                : data.diffAbledConcession === "Yes"
                  ? "diffAbledConcession"
                  : "noConcession",
        });
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      toast.error("Failed to load student data");
    } finally {
      setFetching(false);
    }
  };
  const fetchStudentImage = async () => {
    if (!id) return;
    setFetching(true);
    try {
      const response = await studentApi.getStudentImage(id);
      const data = response.data;
      if (data?.image) {
        reset({
          ...getValues(),
          studentImage: data.image.startsWith("ZGF0Y")
            ? atob(data.image)
            : data.image,
        });
      }
    } catch (error) {
      console.error("Error fetching student image:", error);
      toast.error("Failed to load student image");
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
        val && typeof val === "object" ? val.id || val.value : val;

      const formatToBackendDate = (date: any) => {
        if (!date) return "";
        const d = new Date(date);
        return isValid(d) ? format(d, "dd/MM/yyyy") : "";
      };

      const payload = {
        ...data,
        doj: formatToBackendDate(data.doj),
        dob: formatToBackendDate(data.dob),
        concessionDate: formatToBackendDate(data.concessionDate),
        degreeId: extractId(data.degreeId),
        courseId: extractId(data.courseId),
        semesterId: extractId(data.semesterId),
        sectionId: extractId(data.sectionId),
        batch: extractId(data.batch),
        gender: extractId(data.gender),
        bloodGroup: extractId(data.bloodGroup),
        lateralEntry: data.lateralEntry ? 1 : 0,
        hosteler: data.hosteler ? 1 : 0,
        mess: data.mess ? 1 : 0,
        transport: data.transport ? 1 : 0,
        alumniStudent: data.alumniStudent ? 1 : 0,
        qualConcession: data.concessionType === "qualConcession" ? 1 : 0,
        familyConcession: data.concessionType === "familyConcession" ? 1 : 0,
        diffAbledConcession:
          data.concessionType === "diffAbledConcession" ? 1 : 0,
        noConcession: data.concessionType === "noConcession" ? "Yes" : "No", // Kept Yes/No for noConcession as per logic, but user example shows ""
        createdby: sessionStorage.getItem("UserName") || "admin",
      };

      // Ensure noConcession matches user example if empty string is preferred
      if (payload.noConcession === "No") payload.noConcession = "";
      if (payload.noConcession === "Yes") payload.noConcession = ""; // User example shows "noConcession": "" even if others are 0
      delete (payload as any).studentImage;
      const response = isEdit
        ? await studentApi.updateStudentBio(payload)
        : await studentApi.saveStudentBio(payload);

      if (response.data.status === "SUCCESS") {
        const studentId = response.data.id || id;

        // Upload student image if a new one is selected
        if (
          data.studentImage &&
          typeof data.studentImage === "object" &&
          data.studentImage.file
        ) {
          try {
            const imageFormData = new FormData();
            imageFormData.append("file", data.studentImage.file);
            imageFormData.append("fileName", data.studentImage.fileName);
            await studentApi.saveStudentImage(studentId, imageFormData);
          } catch (imageError) {
            console.error("Student image upload error:", imageError);
            toast.error("Bio saved, but image failed to upload");
          }
        }

        // Save documents if any valid ones exist
        const validDocs = documents
          .filter((d) => d.docname && d.filedata)
          .map((d) => ({ ...d, studentid: studentId }));
        debugger;
        if (validDocs.length > 0) {
          try {
            validDocs.forEach(async (doc) => {
              const docFormData = new FormData();
              docFormData.append(`docname`, doc.docname || "");
              docFormData.append(`filename`, doc.filename || "");
              docFormData.append(`file`, doc.filedata || "");
              await studentApi.saveStudentDocuments(studentId, docFormData);
              // if (doc.filedata) {
              //   // If filedata is a string (base64), convert it to a blob first
              //   // The backend expects a file
              //   if (typeof doc.filedata === "string") {
              //     // Remove data URL prefix if present
              //     const base64 = doc.filedata.replace(/^data:.*;base64,/, "");
              //     const byteCharacters = atob(base64);
              //     const byteNumbers = new Array(byteCharacters.length);

              //     for (let i = 0; i < byteCharacters.length; i++) {
              //       byteNumbers[i] = byteCharacters.charCodeAt(i);
              //     }

              //     const byteArray = new Uint8Array(byteNumbers);
              //     const blob = new Blob([byteArray], {
              //       type: doc.filetype || "application/octet-stream",
              //     });
              //     docFormData.append(
              //       `documents[${index}].file`,
              //       blob,
              //       doc.filename || `document_${index}`,
              //     );
              //   } else if (doc.filedata instanceof File) {
              //     docFormData.append(`documents[${index}].file`, doc.filedata);
              //   }
              // }
            });
          } catch (docError) {
            console.error("Document save error:", docError);
            toast.error("Bio saved, but some documents failed to upload");
          }
        }

        toast.success(
          isEdit
            ? "Student updated successfully"
            : "Student enrolled successfully",
        );
        navigate("/admin/student/bio");
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentChange = (index: number, field: string, value: any) => {
    const newDocs = [...documents];
    newDocs[index][field] = value;
    setDocuments(newDocs);
  };

  const handleFileUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleDocumentChange(index, "filedata", reader.result);
        handleDocumentChange(index, "filename", file.name);
        handleDocumentChange(index, "filetype", file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      {
        docname: "",
        filedata: "",
        filename: "",
        filetype: "",
        studentid: id || "",
      },
    ]);
  };

  const removeDocument = (index: number) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Retrieving Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate("/admin/student/bio")}
            className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-all border border-slate-100 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner rotate-3">
              <User className="w-7 h-7 -rotate-3" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                {isEdit ? "Update" : "Add"}{" "}
                <span className="text-primary">Student</span>
              </h1>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">
                Biographical Records
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/student/bio")}
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
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl sm:rounded-2xl gap-1.5 sm:gap-2 mb-2 sm:mb-6 inline-flex h-auto border border-slate-100 whitespace-nowrap min-w-full sm:min-w-0">
            <TabsTrigger
              value="details"
              className="rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Biographical Data
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Verification Vault
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="details"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-0"
        >
          <div className="lg:col-span-2 space-y-6">
            {/* Identity Matrix */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />

              <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Student Information
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Primary Student Credentials
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="studentName"
                    textLable="Full Student Name"
                    placeholderName="Enter Student Full Name"
                    labelMandatory
                    requiredMsg="Please enter the full student name"
                    startIcon={<User className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="batch"
                  textLable="Admission Batch"
                  placeholderName="YEAR"
                  requiredMsg="Please enter the admission batch"
                  labelMandatory
                  options={batches}
                  getOptionLabel={(opt) => opt}
                  getOptionValue={(opt) => opt}
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="semesterId"
                  textLable="Semester"
                  placeholderName="CURRENT"
                  requiredMsg="Please enter the semester"
                  labelMandatory
                  options={semesters}
                  getOptionLabel={(opt) => opt.semesterName}
                  getOptionValue={(opt) => opt.id}
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="degreeId"
                  textLable="Degree"
                  placeholderName="LEVEL"
                  requiredMsg="Please enter the degree"
                  labelMandatory
                  options={degrees}
                  getOptionLabel={(opt) => opt.degreeName}
                  getOptionValue={(opt) => opt.id}
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="courseId"
                  textLable="Department Course"
                  placeholderName="PROGRAM"
                  requiredMsg="Please enter the course"
                  labelMandatory
                  options={courses}
                  disabled={!selectedDegree}
                  getOptionLabel={(opt) => opt.courseName}
                  getOptionValue={(opt) => opt.id}
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="sectionId"
                  textLable="Class Section"
                  placeholderName="SECTION"
                  requiredMsg="Please enter the section"
                  labelMandatory
                  options={sections}
                  getOptionLabel={(opt) => opt.sectionName}
                  getOptionValue={(opt) => opt.id}
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="appNo"
                  textLable="Application No"
                  placeholderName="APP-000"
                  requiredMsg="Please enter the application number"
                  labelMandatory
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="regno"
                  textLable="Registration No"
                  placeholderName="REG-000"
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="rollNo"
                  textLable="Institutional Roll No"
                  placeholderName="ROLL-000"
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="phonenumber"
                  textLable="Mobile Primary"
                  placeholderName="10-DIGIT NUMBER"
                  requiredMsg="Please enter the phone number"
                  labelMandatory
                  startIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  inputProps={{ maxLength: 10 }}
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="whatsappNumber"
                  textLable="WhatsApp Number"
                  placeholderName="W-APP NUMBER"
                  requiredMsg="Please enter the whatsapp number"
                  labelMandatory
                  startIcon={<Phone className="w-4 h-4 text-emerald-500" />}
                  inputProps={{ maxLength: 10 }}
                />

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="gender"
                  textLable="Gender"
                  placeholderName="SELECT"
                  requiredMsg="Please select the gender"
                  labelMandatory
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                  getOptionLabel={(opt) => opt.label}
                  getOptionValue={(opt) => opt.value}
                />

                <DatePickerInput
                  control={control}
                  errors={errors}
                  name="dob"
                  textLable="Date of Birth"
                  placeholderName="SELECT DATE"
                  labelMandatory
                  requiredMsg="Please select the date of birth"
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="emisNumber"
                  textLable="EMIS Number"
                  placeholderName="EMIS-000"
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="adhaarno"
                  textLable="Aadhar Number"
                  placeholderName="12-DIGIT AADHAR"
                  onKeyDownData={validateAadharNumber}
                  inputProps={{ maxLength: 12 }}
                />

                <div className="md:col-span-2">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="emailid"
                    textLable="Primary Email ID"
                    placeholderName="student@institute.com"
                    startIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    validate={(value: string) => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(value)) {
                        return "Invalid email address";
                      }
                      return true;
                    }}
                  />
                </div>

                <AutocompleteInput
                  control={control}
                  errors={errors}
                  name="bloodGroup"
                  textLable="Blood Group"
                  placeholderName="BLOOD"
                  options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                  getOptionLabel={(opt) => opt}
                  getOptionValue={(opt) => opt}
                />

                <DatePickerInput
                  control={control}
                  errors={errors}
                  name="doj"
                  textLable="Date of Joining"
                  placeholderName="SELECT DATE"
                  labelMandatory
                  requiredMsg="Please enter the date of joining"
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* Student Image */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 mb-5 -mx-6 -mt-6">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">
                  Student Portal Image
                </h3>
              </div>
              <ImageUpload
                control={control}
                errors={errors}
                name="studentImage"
                label="Profile Artifact"
              />
            </section>

            {/* Quick Logistics */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 mb-5 -mx-6 -mt-6">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">
                  Enrollment Logistics
                </h3>
              </div>
              <div className="space-y-4">
                <CheckboxInput
                  control={control}
                  errors={errors}
                  name="lateralEntry"
                  textLable="Lateral Entry?"
                />
                {/* <CheckboxInput
                  control={control}
                  errors={errors}
                  name="hosteler"
                  textLable="Hostel Resident?"
                />
                {watch("hosteler") ? (
                  <CheckboxInput
                    control={control}
                    errors={errors}
                    name="mess"
                    textLable="Avails Mess?"
                  />
                ) : (
                  ""
                )} */}
                <CheckboxInput
                  control={control}
                  errors={errors}
                  name="transport"
                  textLable="Avails Transport?"
                />
                {watch("transport") ? (
                  <AutocompleteInput
                    control={control}
                    errors={errors}
                    name="busNo"
                    textLable="Bus Route"
                    placeholderName="SELECT BUS"
                    labelMandatory={true}
                    options={transportFees}
                    getOptionLabel={(opt) => opt.feeName}
                    getOptionValue={(opt) => opt.id}
                    requiredMsg="Please select the Bus"
                  />
                ) : (
                  // <div className="flex items-center space-x-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  //   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  //     Bus:
                  //   </span>
                  //   <input
                  //     {...register("busNo")}
                  //     className="bg-transparent w-full text-xs font-bold text-primary focus:outline-none"
                  //     placeholder="BUS-00"
                  //   />
                  // </div>
                  ""
                )}
                <CheckboxInput
                  control={control}
                  errors={errors}
                  name="previouslyPursued"
                  textLable="Previously pursued here?"
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* Cultural & Institutional Identity */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <TextInput
                  control={control}
                  errors={errors}
                  name="instituteName"
                  textLable="Previous Institute"
                  placeholderName="Enter Institute Name"
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="previousDegree"
                  textLable="Previous Board"
                  placeholderName="Enter Previous Board"
                />
                <TextInput
                  control={control}
                  errors={errors}
                  name="previousMark"
                  textLable="Mark %"
                  placeholderName="Enter Mark %"
                  inputProps={{ maxLength: 3 }}
                />
              </div>
            </section>

            {/* Family & Address Matrix */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />

              <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Family Information
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Guardian Details & Residency
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="fatherName"
                    textLable="Father / Guardian Name"
                    placeholderName="NAME"
                    startIcon={<User className="w-4 h-4 text-slate-400" />}
                  />
                  <TextInput
                    control={control}
                    errors={errors}
                    name="fatherOccupation"
                    textLable="Father's Occupation"
                    placeholderName="PROFESSION"
                  />
                  <div className="sm:col-span-2">
                    <TextInput
                      control={control}
                      errors={errors}
                      name="fatherMobNumber"
                      textLable="Father's Mobile"
                      placeholderName="CONTACT"
                      startIcon={<Phone className="w-4 h-4 text-slate-400" />}
                    />
                  </div>
                  <TextInput
                    control={control}
                    errors={errors}
                    name="motherName"
                    textLable="Mother / Guardian Name"
                    placeholderName="NAME"
                    startIcon={<User className="w-4 h-4 text-slate-400" />}
                  />
                  <TextInput
                    control={control}
                    errors={errors}
                    name="motherOccupation"
                    textLable="Mother's Occupation"
                    placeholderName="PROFESSION"
                  />
                  <div className="sm:col-span-2">
                    <TextInput
                      control={control}
                      errors={errors}
                      name="motherMobNumber"
                      textLable="Mother's Mobile"
                      placeholderName="CONTACT"
                      startIcon={<Phone className="w-4 h-4 text-slate-400" />}
                      inputProps={{ maxLength: 10 }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="address1"
                    textLable="Residency Address Line 1"
                    placeholderName="STREET / PLOT NO"
                    startIcon={<MapPin className="w-4 h-4 text-slate-400" />}
                  />
                  <TextInput
                    control={control}
                    errors={errors}
                    name="address2"
                    textLable="Residency Address Line 2"
                    placeholderName="AREA / LANDMARK"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      control={control}
                      errors={errors}
                      name="district"
                      textLable="District"
                    />
                    <TextInput
                      control={control}
                      errors={errors}
                      name="pincode"
                      textLable="Pincode"
                      placeholderName="PINCODE"
                      inputProps={{ maxLength: 6 }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Financial Architecture */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />

              <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Bank Information
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Banking & Transaction Data
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="bankName"
                    textLable="Primary Banking Institution"
                    placeholderName="FULL BANK NAME"
                    startIcon={<Building2 className="w-4 h-4 text-slate-400" />}
                  />
                </div>
                <div className="lg:col-span-2">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="accountNumber"
                    textLable="Ledger Account Number"
                    placeholderName="AC/NO"
                  />
                </div>
                <TextInput
                  control={control}
                  errors={errors}
                  name="ifscCode"
                  textLable="IFSC Branch Code"
                  placeholderName="IFSC"
                  onKeyDownData={validateAlphaNumericOnly}
                />
                <div className="lg:col-span-3">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="accountHolderName"
                    textLable="Account Holder Name"
                    placeholderName="NAME AS IN BANK"
                  />
                </div>
              </div>
            </section>

            {/* Concession Intelligence */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />

              <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Concession Information
                  </h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Scholarship & Waiver Logic
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <Controller
                  control={control}
                  name="concessionType"
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                      {[
                        {
                          id: "qualConcession",
                          label: "Merit Based",
                          color: "text-indigo-500",
                          bg: "bg-indigo-50",
                        },
                        {
                          id: "familyConcession",
                          label: "Parentless",
                          color: "text-emerald-500",
                          bg: "bg-emerald-50",
                        },
                        {
                          id: "diffAbledConcession",
                          label: "Others",
                          color: "text-amber-500",
                          bg: "bg-amber-50",
                        },
                        {
                          id: "noConcession",
                          label: "No Concession",
                          color: "text-slate-500",
                          bg: "bg-slate-50",
                        },
                      ].map((c) => (
                        <Label
                          key={c.id}
                          htmlFor={c.id}
                          className={`flex items-center gap-3 p-4 rounded-xl border border-slate-100 cursor-pointer transition-all hover:bg-slate-50 ${field.value === c.id ? "ring-2 ring-primary/20 bg-primary/5 border-primary/20" : "bg-white"}`}
                        >
                          <RadioGroupItem
                            value={c.id}
                            id={c.id}
                            className="sr-only"
                          />
                          <div
                            className={`w-6 h-6 rounded-full ${c.bg} flex items-center justify-center ${c.color} border border-slate-100 shadow-sm`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${field.value === c.id ? "bg-primary" : "bg-transparent"} transition-all`}
                            />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-600">
                            {c.label}
                          </span>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextInput
                    control={control}
                    errors={errors}
                    name="concessionRefName"
                    textLable="Concession Ref Name"
                    placeholderName="REF NAME"
                  />
                  <DatePickerInput
                    control={control}
                    errors={errors}
                    name="concessionDate"
                    textLable="Concession Date"
                  />
                  <TextInput
                    control={control}
                    errors={errors}
                    name="concessionRemarks"
                    textLable="Concession Remarks"
                    placeholderName="REMARKS"
                  />
                  <TextInput
                    control={control}
                    errors={errors}
                    name="referralName"
                    textLable="Recommended By"
                    placeholderName="PERSON NAME"
                    startIcon={<User className="w-4 h-4 text-slate-400" />}
                  />
                  <div className="md:col-span-2">
                    <TextInput
                      control={control}
                      errors={errors}
                      name="referralRemarks"
                      textLable="Officer Remarks"
                      placeholderName="ENTER REMARKS"
                    />
                  </div>
                  <div className="flex items-center space-x-2.5 md:col-span-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mt-2">
                    <CheckboxInput
                      control={control}
                      errors={errors}
                      name="alumniStudent"
                      textLable="Is Alumni Student?"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-slate-50 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    Verification Vault
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Digital Certificate Management
                  </p>
                </div>
              </div>
              <button
                onClick={addDocument}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add New Artifact
              </button>
            </div>

            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-6 px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 bg-slate-50/30 rounded-t-2xl">
                <div className="col-span-1">Ref</div>
                <div className="col-span-4">Artifact Label</div>
                <div className="col-span-5">File Repository</div>
                <div className="col-span-2 text-right px-4">Actions</div>
              </div>

              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 p-4 md:p-4 rounded-[1.5rem] bg-slate-50/50 items-start md:items-center hover:bg-white hover:shadow-lg border border-transparent hover:border-slate-100 transition-all duration-300 group relative"
                >
                  <div className="md:col-span-1 flex items-center gap-2">
                    <span className="md:hidden text-[10px] font-black text-slate-400 uppercase">
                      #
                    </span>
                    <span className="text-sm font-black text-slate-300 group-hover:text-primary transition-colors">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="w-full md:col-span-4">
                    <label className="md:hidden text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">
                      Select Artifact Type
                    </label>
                    <select
                      value={doc.docname}
                      onChange={(e) =>
                        handleDocumentChange(index, "docname", e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        -- Select Artifact --
                      </option>
                      <option value="10 Marksheet">10 Marksheet</option>
                      <option value="11 Marksheet">11 Marksheet</option>
                      <option value="12 Marksheet">12 Marksheet</option>
                      <option value="Aadhar Card">Aadhar Card</option>
                      <option value="Consolidated Marksheet">
                        Consolidated Marksheet
                      </option>
                      <option value="Convocation Certificate">
                        Convocation Certificate
                      </option>
                      <option value="Community Certificate">
                        Community Certificate
                      </option>
                      <option value="First Graduate Certificate">
                        First Graduate Certificate
                      </option>
                      <option value="Provisional Certificate">
                        Provisional Certificate
                      </option>
                      <option value="Transfer Certificate">
                        Transfer Certificate
                      </option>
                      <option value="Concession Certificate">
                        Concession Certificate
                      </option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className="w-full md:col-span-5">
                    <label className="md:hidden text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">
                      Upload Document
                    </label>
                    <div className="relative group/file">
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(index, e)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="h-11 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-between transition-all group-hover/file:border-primary/50 group-hover/file:bg-primary/5">
                        <span className="text-[10px] font-black text-slate-500 truncate max-w-[200px] sm:max-w-[250px]">
                          {doc.filename || "CLICK TO UPLOAD ARTIFACT"}
                        </span>
                        <Upload className="w-4 h-4 text-slate-300 group-hover/file:text-primary transition-colors shrink-0" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:col-span-2 flex justify-end">
                    <button
                      onClick={() => removeDocument(index)}
                      className="w-full md:w-11 h-11 rounded-xl bg-white text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-slate-100 shadow-sm active:scale-90 group/btn gap-2 md:gap-0"
                    >
                      <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      <span className="md:hidden text-xs font-black uppercase tracking-widest">
                        Remove Artifact
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentBioForm;
