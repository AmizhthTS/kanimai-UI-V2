import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Download,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  User,
  GraduationCap,
  Calendar,
  Building,
  Eye,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi, studentApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import { useForm, Controller } from "react-hook-form";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { X, CheckCircle2, RotateCcw } from "lucide-react";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";

const StudentBioList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 10;

  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any>("");

  // Export Modal States
  const [showExportModal, setShowExportModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);

  const [batches, setBatches] = useState<any[]>([]);
  const [selectedDegree, setSelectedDegree] = useState<any>("");
  const [selectedCourse, setSelectedCourse] = useState<any>("");

  const {
    control,
    handleSubmit: handleFormSubmit,
    watch: watchForm,
    reset: resetForm,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      batch: "",
    },
  });

  const fetchInitialData = async () => {
    try {
      const response = await masterApi.getDegreeList({});
      setDegrees(
        Array.isArray(response.data?.responseModelList)
          ? response.data.responseModelList
          : [],
      );
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  const fetchCourses = async (degreeId: any) => {
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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentApi.getStudentList({
        searchStr: searchQuery,
        degreeId: selectedDegree || "",
        courseId: selectedCourse || "",
        pageNumber: currentPage - 1,
        reqType: "bio",
        batch: selectedBatch || "",
      });
      setStudents(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load student list");
    } finally {
      setLoading(false);
    }
  };
  const generateBatchList = () => {
    const currentYear = new Date().getFullYear();
    const minYears = 4;
    const batchList = [];
    for (let i = currentYear; i > currentYear - minYears; i--) {
      batchList.push(i.toString());
    }
    setBatches(batchList);
  };
  useEffect(() => {
    fetchInitialData();
    generateBatchList();
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

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDegree("");
    setSelectedCourse("");
    setSelectedBatch("");
    setCurrentPage(1);
  };

  const handleExport = () => {
    resetForm();
    setShowExportModal(true);
    setGenerationProgress(0);
    setDownloadReady(false);
    setIsGenerating(false);
  };

  const onReportSubmit = async (data: any) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setDownloadReady(false);

    // Simulate progress for UI feedback
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadReady(true);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadReport = async () => {
    const data = watchForm();
    setExporting(true);
    try {
      const response = await studentApi.exportStudentList({
        batch: data.batch,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Student_Bio_Report_Batch_${data.batch}_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      toast.success("Report downloaded successfully");
      setShowExportModal(false);
      resetForm();
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to download report");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Student <span className="text-primary">Bio Information</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Management & Records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-6 py-3 bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 border border-slate-100 disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export Data
          </button>
          <button
            onClick={() => navigate("/admin/student/bio/add")}
            className="px-6 py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add New Student
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="relative group lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search student by name, ID"
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-400 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select
            onValueChange={setSelectedDegree}
            value={selectedDegree || ""}
          >
            <SelectTrigger className="w-full h-auto px-4 py-3 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="DEGREE" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {degrees.map((deg) => (
                <SelectItem
                  key={deg.id}
                  value={deg.id.toString()}
                  className="text-[10px] font-black uppercase py-3"
                >
                  {deg.degreeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={setSelectedCourse}
            value={selectedCourse || ""}
            disabled={!selectedDegree}
          >
            <SelectTrigger className="w-full h-auto px-4 py-3 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="COURSE" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {courses.map((course) => (
                <SelectItem
                  key={course.id}
                  value={course.id.toString()}
                  className="text-[10px] font-black uppercase py-3"
                >
                  {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedBatch} value={selectedBatch || ""}>
            <SelectTrigger className="w-full h-auto px-4 py-3 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="BATCH" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {batches.map((batch) => (
                <SelectItem
                  key={batch}
                  value={batch}
                  className="text-[10px] font-black uppercase py-3"
                >
                  {batch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={resetFilters}
            className="w-full sm:col-span-2 md:col-span-1 h-auto py-4 bg-rose-50 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[60vh]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                  S.No
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Student Details
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Academic Info
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Batch
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Syncing Student Data...
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
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:bg-primary group-hover:text-white transition-all">
                          {student.studentName?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">
                            {student.studentName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {student.rollNo || "NO REG NO"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <GraduationCap className="w-3.5 h-3.5 text-primary/60" />
                          <span className="text-xs font-black">
                            {student.deptName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600`}
                      >
                        {student.batch}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/student/bio/view/${student.id}`)
                          }
                          className="p-2.5 hover:bg-primary/5 text-slate-400 hover:text-primary rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/student/bio/edit/${student.id}`)
                          }
                          className="p-2.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-xl transition-all"
                          title="Edit Bio"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center text-slate-400 italic text-sm"
                  >
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 sm:px-8 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 min-h-[70px]">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest order-2 sm:order-1">
            Showing {students.length} of {totalCount} Records
          </div>
          <div className="order-1 sm:order-2">
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
      </div>

      {/* Export Report Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
          <DialogHeader className="px-10 py-8 bg-slate-900 text-white flex flex-row items-center justify-between space-y-0 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight uppercase">
                  Student Bio <span className="text-primary">Report</span>
                </DialogTitle>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Generate Student Bio Excel
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-6">
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
            </div>

            <div className="pt-6 border-t border-slate-50">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Compiling Data...
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                      {generationProgress}%
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
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
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
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

export default StudentBioList;
