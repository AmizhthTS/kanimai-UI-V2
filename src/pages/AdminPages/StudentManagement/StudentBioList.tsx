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
import { X, CheckCircle2 } from "lucide-react";

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
  const [exportBatch, setExportBatch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);

  const [batches, setBatches] = useState<any[]>([]);
  const [selectedDegree, setSelectedDegree] = useState<any>("");
  const [selectedCourse, setSelectedCourse] = useState<any>("");

  // const { control, watch, setValue } = useForm({
  //   defaultValues: {
  //     degreeId: {},
  //     courseId: {},
  //   },
  // });

  // const selectedDegree = watch("degreeId");
  // const selectedCourse = watch("courseId");

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

  const handleExport = () => {
    setShowExportModal(true);
    setGenerationProgress(0);
    setDownloadReady(false);
    setIsGenerating(false);
  };

  const generateReport = async () => {
    if (!exportBatch) {
      toast.error("Please select a batch");
      return;
    }

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
    setExporting(true);
    try {
      const response = await studentApi.exportStudentList({
        batch: exportBatch,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Student_Bio_Report_Batch_${exportBatch}_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      toast.success("Report downloaded successfully");
      setShowExportModal(false);
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
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md">
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
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name, reg no"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-400 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
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
              setSelectedCourse(""); // Reset course when degree changes
            }}
            value={selectedDegree || ""}
          >
            <SelectTrigger className="w-full h-auto px-6 py-4 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="FILTER BY DEGREE" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {degrees.map((deg: any) => (
                <SelectItem
                  key={deg.id}
                  value={deg.id.toString()}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-600 focus:bg-primary focus:text-white rounded-xl py-3"
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
            <SelectTrigger className="w-full h-auto px-6 py-4 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm disabled:opacity-50">
              <div className="flex items-center gap-3">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="FILTER BY COURSE" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {courses.map((course: any) => (
                <SelectItem
                  key={course.id}
                  value={course.id.toString()}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-600 focus:bg-primary focus:text-white rounded-xl py-3"
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
            disabled={!selectedCourse}
          >
            <SelectTrigger className="w-full h-auto px-6 py-4 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm disabled:opacity-50">
              <div className="flex items-center gap-3">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="FILTER BY BATCH" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {batches.map((batch: any) => (
                <SelectItem
                  key={batch}
                  value={batch}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-600 focus:bg-primary focus:text-white rounded-xl py-3"
                >
                  {batch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[60vh]">
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

      {/* Export Report Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <DialogHeader className="px-8 py-6 bg-white border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-xl font-black text-slate-800 tracking-tight">
              Student Bio Report
            </DialogTitle>
          </DialogHeader>

          <div className="p-10 space-y-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-1">
                Batch Name <span className="text-rose-500">*</span>
              </label>
              <Select value={exportBatch} onValueChange={setExportBatch}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  {batches.map((batch) => (
                    <SelectItem
                      key={batch}
                      value={batch}
                      className="rounded-xl font-bold py-3"
                    >
                      {batch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-center gap-8">
              {!downloadReady ? (
                <button
                  onClick={generateReport}
                  disabled={isGenerating || !exportBatch}
                  className="w-full py-4 bg-pink-500 text-white font-black text-[11px] uppercase tracking-widest rounded-[1.25rem] shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isGenerating ? "Processing..." : "Generate Report"}
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    Report Ready
                  </span>
                </div>
              )}

              {(isGenerating || downloadReady) && (
                <div className="w-full space-y-3">
                  <div className="relative h-10 w-full bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-50">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300 ease-out flex items-center justify-center"
                      style={{
                        width: `${generationProgress}%`,
                        backgroundImage:
                          "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
                        backgroundSize: "1rem 1rem",
                      }}
                    >
                      <span className="text-[10px] font-black text-white">
                        {generationProgress}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {downloadReady && (
                <button
                  onClick={downloadReport}
                  className="w-full py-4 bg-slate-600 text-white font-black text-[11px] uppercase tracking-widest rounded-[1.25rem] shadow-lg shadow-slate-200 hover:bg-slate-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Download
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
