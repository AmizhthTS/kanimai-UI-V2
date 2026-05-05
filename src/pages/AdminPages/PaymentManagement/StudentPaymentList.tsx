import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Filter,
  Plus,
  Eye,
  Loader2,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Calendar,
  Building,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import { masterApi, studentApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const StudentPaymentList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 10;

  // Masters
  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);

  // Filter values
  const [selectedDegree, setSelectedDegree] = useState<any>("");
  const [selectedCourse, setSelectedCourse] = useState<any>("");
  const [selectedBatch, setSelectedBatch] = useState<any>("");

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);

  const fetchInitialData = async () => {
    try {
      const [degRes, batchRes, secRes, semRes] = await Promise.all([
        masterApi.getDegreeList({}),
        masterApi.getYearList({}),
        masterApi.getClassSectionList({}),
        masterApi.getSemesterList({}),
      ]);

      setDegrees(
        Array.isArray(degRes.data?.responseModelList)
          ? degRes.data.responseModelList
          : [],
      );
      setBatches(
        Array.isArray(batchRes.data?.responseModelList)
          ? batchRes.data.responseModelList.map((b: any) => b.year)
          : [],
      );
      setSections(
        Array.isArray(secRes.data?.responseModelList)
          ? secRes.data.responseModelList
          : [],
      );
      setSemesters(
        Array.isArray(semRes.data?.responseModelList)
          ? semRes.data.responseModelList
          : [],
      );
    } catch (error) {
      console.error("Error fetching masters:", error);
    }
  };

  const fetchCourses = async (degreeId: any) => {
    if (!degreeId) {
      setCourses([]);
      return;
    }
    try {
      const response = await masterApi.getCourseList({});
      const filtered = (response.data.responseModelList || []).filter(
        (c: any) => c.degreeId.toString() === degreeId.toString(),
      );
      setCourses(filtered);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentApi.getStudentList({
        searchStr: searchQuery,
        degreeId: selectedDegree || "",
        courseId: selectedCourse || "",
        pageNumber: currentPage - 1,
        reqType: "payment", // Based on context
        batch: selectedBatch || "",
      });
      setStudents(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load student payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedDegree) {
      fetchCourses(selectedDegree);
      setSelectedCourse("");
    }
  }, [selectedDegree]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, selectedDegree, selectedCourse, selectedBatch]);

  // Report Modal form with react-hook-form
  const {
    control,
    handleSubmit: handleFormSubmit,
    watch: watchForm,
    setValue: setFormValue,
    reset: resetForm,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      degreeId: "",
      courseId: "",
      batch: "",
      sectionId: "",
      semesterId: "",
    },
  });

  const reportDegree = watchForm("degreeId");

  useEffect(() => {
    if (reportDegree) {
      fetchCourses(reportDegree);
      setFormValue("courseId", "");
    }
  }, [reportDegree]);

  const onReportSubmit = (data: any) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setDownloadReady(false);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setDownloadReady(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadReport = async () => {
    const data = watchForm();
    try {
      const res = await studentApi.downloadPaymentReport(data);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Payment_Pending_Report_${data.batch}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      toast.success("Report downloaded successfully");
      setShowReportModal(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to download report");
    }
  };
  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Student <span className="text-amber-500">Payments</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Financial Overview & Dues
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-6 py-3 bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 border border-slate-100"
          >
            <Download className="w-4 h-4" />
            Payment Report
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              placeholder="Search student by name, ID"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500/20 outline-none transition-all placeholder:text-slate-400 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Select
            onValueChange={(value) => {
              setSelectedDegree(value);
            }}
            value={selectedDegree || ""}
          >
            <SelectTrigger className="w-full h-auto px-6 py-4 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="FILTER BY DEGREE" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {degrees.map((deg) => (
                <SelectItem
                  key={deg.id}
                  value={deg.id.toString()}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-600 focus:bg-amber-500 focus:text-white rounded-xl py-3"
                >
                  {deg.degreeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              setSelectedCourse(value);
            }}
            value={selectedCourse || ""}
            disabled={!selectedDegree}
          >
            <SelectTrigger className="w-full h-auto px-6 py-4 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all shadow-sm disabled:opacity-50">
              <div className="flex items-center gap-3">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="FILTER BY COURSE" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {courses.map((course) => (
                <SelectItem
                  key={course.id}
                  value={course.id.toString()}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-600 focus:bg-amber-500 focus:text-white rounded-xl py-3"
                >
                  {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              setSelectedBatch(value);
            }}
            value={selectedBatch || ""}
          >
            <SelectTrigger className="w-full h-auto px-6 py-4 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="FILTER BY BATCH" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {batches.map((batch) => (
                <SelectItem
                  key={batch}
                  value={batch}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-600 focus:bg-amber-500 focus:text-white rounded-xl py-3"
                >
                  {batch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payment List Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[60vh]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                  S.No
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Student Name
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Academic Info
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Batch
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Due Amount
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Syncing Financial Data...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/50 transition-all group"
                  >
                    <td className="px-8 py-5 text-sm font-black text-slate-300">
                      {((currentPage - 1) * rowsPerPage + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:bg-amber-500 group-hover:text-white transition-all">
                          {student.studentName?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">
                            {student.studentName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {student.rollNo || "NO ID"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-500/60" />
                        <span className="text-xs font-black">
                          {student.deptName}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                        {student.batch}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-sm font-black text-rose-500">
                        ₹{student.dueAmount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() =>
                          navigate(`/admin/student/payment/view/${student.id}`)
                        }
                        className="p-2.5 hover:bg-amber-50 text-slate-400 hover:text-amber-500 rounded-xl transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-20 text-center text-slate-400 italic"
                  >
                    No students found matching filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Pagination */}
        <div className="px-8 py-4 border-t border-slate-100 bg-white flex items-center justify-end min-h-[70px]">
          {totalCount > 1 && (
            <CustomPagination
              totalPages={totalCount}
              page={currentPage - 1}
              onPageChange={(_: any, newPage: number) =>
                setCurrentPage(newPage + 1)
              }
            />
          )}
        </div>
      </div>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
          <DialogHeader className="px-10 py-8 bg-slate-900 text-white flex flex-row items-center justify-between space-y-0 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/20">
                <FileText className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight uppercase">
                  Payment <span className="text-amber-500">Report</span>
                </DialogTitle>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Generate Pending Dues Excel
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div className="md:col-span-2">
                <AutocompleteInput
                  control={control}
                  errors={formErrors}
                  name="degreeId"
                  textLable="Academic Degree"
                  placeholderName="Select Degree"
                  requiredMsg="Required"
                  labelMandatory
                  options={degrees}
                  getOptionLabel={(opt: any) => opt.degreeName}
                  getOptionValue={(opt: any) => opt.id}
                  icon={<Building className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div className="md:col-span-2">
                <AutocompleteInput
                  control={control}
                  errors={formErrors}
                  name="courseId"
                  textLable="Select Course"
                  placeholderName="Select Course"
                  requiredMsg="Required"
                  labelMandatory
                  disabled={!reportDegree}
                  options={courses}
                  getOptionLabel={(opt: any) => opt.courseName}
                  getOptionValue={(opt: any) => opt.id}
                  icon={<GraduationCap className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <AutocompleteInput
                control={control}
                errors={formErrors}
                name="batch"
                textLable="Admission Batch"
                placeholderName="YEAR"
                requiredMsg="Required"
                labelMandatory
                options={batches}
                getOptionLabel={(opt: any) => opt}
                getOptionValue={(opt: any) => opt}
                icon={<Calendar className="w-4 h-4 text-slate-400" />}
              />

              <AutocompleteInput
                control={control}
                errors={formErrors}
                name="sectionId"
                textLable="Class Section"
                placeholderName="SECTION"
                requiredMsg="Required"
                labelMandatory
                options={sections}
                getOptionLabel={(opt: any) => opt.sectionName}
                getOptionValue={(opt: any) => opt.id}
                icon={<Filter className="w-4 h-4 text-slate-400" />}
              />

              <div className="md:col-span-2">
                <AutocompleteInput
                  control={control}
                  errors={formErrors}
                  name="semesterId"
                  textLable="Semester (Optional)"
                  placeholderName="Select Semester"
                  options={semesters}
                  getOptionLabel={(opt: any) => `Semester ${opt.semesterId}`}
                  getOptionValue={(opt: any) => opt.id}
                  icon={<FileText className="w-4 h-4 text-slate-400" />}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Compiling Data...
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                      {generationProgress}%
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>
              ) : downloadReady ? (
                <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-inner border border-emerald-100">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Report Prepared
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                      Ready for download
                    </p>
                  </div>
                  <button
                    onClick={downloadReport}
                    className="w-full h-16 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-slate-800 mt-2 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    Download Excel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleFormSubmit(onReportSubmit)}
                  className="w-full h-16 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  Generate Report
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPaymentList;
