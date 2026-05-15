import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Edit,
  Trash2,
  RotateCcw,
  Save,
  Loader2,
  BookOpen,
  X,
  Building,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import { useForm } from "react-hook-form";
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

const CourseSubjectMapping = () => {
  const navigate = useNavigate();
  const [listLoading, setListLoading] = useState(true);
  const [mappings, setMappings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;

  // Filter States
  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedDegree, setSelectedDegree] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const { setValue } = useForm();

  // Modal State
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchDegrees = async () => {
    try {
      const response = await masterApi.getDegreeList({});
      setDegrees(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  const fetchCourses = async (degreeId: number) => {
    try {
      const response = await masterApi.getCourseList({ degreeId });
      setCourses(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  useEffect(() => {
    if (selectedDegree) {
      fetchCourses(selectedDegree.id);
      setSelectedCourse(null);
    } else {
      setCourses([]);
      setSelectedCourse(null);
    }
  }, [selectedDegree]);

  const resetFilters = () => {
    setSelectedDegree(null);
    setSelectedCourse(null);
    setCurrentPage(1);
  };

  const fetchMappings = async () => {
    setListLoading(true);
    try {
      const response = await masterApi.getSubjectMappingList({
        degreeId: selectedDegree?.id || "",
        courseId: selectedCourse?.id || "",
        pageNumber: currentPage - 1,
      });
      setMappings(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching mapping list:", error);
      toast.error("Failed to load mappings");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, [selectedDegree, selectedCourse, currentPage]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this mapping?"))
      return;
    try {
      await masterApi.deleteSubjectMapping(id);
      toast.success("Mapping deleted successfully");
      fetchMappings();
    } catch (error) {
      console.error("Error deleting mapping:", error);
      toast.error("Failed to delete mapping");
    }
  };

  const handleViewSubjects = async (subjects: any) => {
    if (!subjects || subjects.length === 0) return;

    let subjectIds: number[] = [];
    if (typeof subjects === "string") {
      subjectIds = subjects
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    } else if (Array.isArray(subjects)) {
      subjectIds = subjects.map((id) =>
        typeof id === "string" ? parseInt(id) : id,
      );
    }

    if (subjectIds.length === 0) return;

    setShowSubjectModal(true);
    setModalLoading(true);
    try {
      const response = await masterApi.getSubjectsByIds({ subjectIds });
      setSelectedSubjects(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subject details");
      setShowSubjectModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/admin/master")}
            className="p-2.5 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-primary border border-transparent hover:border-slate-100 shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Course - Semester -{" "}
              <span className="text-primary">Subject Mapping</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Academic Structure Configuration
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/master/course-subject-mapping/add")}
          className="w-full sm:w-auto bg-primary text-white font-black text-[10px] py-4 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
        >
          <Save className="w-4 h-4" />
          Add Semester Subject Mapping
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[60vh] overflow-hidden">
        {/* Modern Filter Cockpit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-6 border-b border-slate-100 bg-slate-50/30">
          <div className="lg:col-span-2">
            <Select
              onValueChange={(val) => {
                const deg = degrees.find((d) => d.id.toString() === val);
                setSelectedDegree(deg);
                setSelectedCourse(null);
              }}
              value={selectedDegree?.id?.toString() || ""}
            >
              <SelectTrigger className="w-full h-auto px-4 py-3.5 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <SelectValue placeholder="FILTER BY DEGREE" />
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
          </div>

          <div className="lg:col-span-2">
            <Select
              onValueChange={(val) => {
                const course = courses.find((c) => c.id.toString() === val);
                setSelectedCourse(course);
              }}
              value={selectedCourse?.id?.toString() || ""}
              disabled={!selectedDegree}
            >
              <SelectTrigger className="w-full h-auto px-4 py-3.5 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <SelectValue placeholder="FILTER BY COURSE" />
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
          </div>

          <button
            onClick={resetFilters}
            className="w-full h-auto py-3.5 bg-rose-50 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {listLoading ? (
            <div className="px-6 py-24 text-center">
              <div className="flex flex-col items-center gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Synchronizing Mapping Data...
                </span>
              </div>
            </div>
          ) : mappings.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                        S.No
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Degree
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Academic Course
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        Year
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Semester
                      </th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                        Allocations
                      </th>
                      <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-28">
                        Control
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mappings.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/30 transition-colors group"
                      >
                        <td className="px-10 py-5 text-xs font-black text-slate-300">
                          {((currentPage - 1) * rowsPerPage + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">
                            {item.degreeName}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-black text-slate-800 tracking-tight">
                            {item.courseName}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border border-slate-200 whitespace-nowrap">
                            {item.yearName}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-black text-slate-600">
                            {item.semesterName}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() =>
                              handleViewSubjects(item.subjects || [])
                            }
                            className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-[10px] font-black hover:bg-primary/20 transition-all cursor-pointer border border-primary/20 uppercase tracking-widest whitespace-nowrap"
                          >
                            {item.subjectCount || 0} Subjects
                          </button>
                        </td>
                        <td className="px-10 py-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/master/course-subject-mapping/edit/${item.id}`,
                                )
                              }
                              className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-500 hover:border-emerald-100 hover:shadow-sm rounded-xl transition-all active:scale-95"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Minimal Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {mappings.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 hover:bg-slate-50 transition-colors active:bg-slate-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg uppercase tracking-widest border border-slate-100">
                            {item.semesterName}
                          </span>
                          <button
                            onClick={() =>
                              handleViewSubjects(item.subjects || [])
                            }
                            className="text-[10px] font-black px-2.5 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-widest border border-primary/20"
                          >
                            {item.noOfSubject || item.subjects?.length || 0}{" "}
                            Subjects
                          </button>
                        </div>

                        <div>
                          <h4 className="text-base font-black text-slate-800 leading-tight tracking-tight">
                            {item.courseName}
                          </h4>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                            {item.degreeName} • {item.yearName}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/master/course-subject-mapping/edit/${item.id}`,
                          )
                        }
                        className="p-3.5 bg-white border border-slate-100 text-primary rounded-2xl shadow-sm active:scale-95 flex-shrink-0"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-10 py-24 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-slate-300">
                <BookOpen className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-bold text-sm">
                No academic mappings found.
              </p>
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mt-2">
                Select a Degree and Course to view mappings.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-2 border-t border-slate-100 flex items-center justify-end bg-white mt-auto min-h-[60px]">
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

      {/* Subject Details Modal */}
      <Dialog open={showSubjectModal} onOpenChange={setShowSubjectModal}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl bg-white animate-in zoom-in duration-300">
          <DialogHeader className="bg-slate-50/80 backdrop-blur-md px-10 py-8 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
            <div>
              <DialogTitle className="text-xl font-black text-slate-800 tracking-tight">
                Subject <span className="text-primary">Allocations</span>
              </DialogTitle>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Institutional Academic Structure
              </p>
            </div>
          </DialogHeader>

          <div className="p-10 pt-6">
            <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-50/90 backdrop-blur-sm border-b border-slate-100">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">
                        S.No
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Academic Subject
                      </th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Subject Code
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {modalLoading ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-20 text-center">
                          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                        </td>
                      </tr>
                    ) : selectedSubjects.length > 0 ? (
                      selectedSubjects.map((sub, idx) => (
                        <tr
                          key={sub.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-8 py-5 text-xs font-black text-slate-300">
                            {(idx + 1).toString().padStart(2, "0")}
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-sm font-black text-slate-600">
                              {sub.subjectName}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <span className="text-xs font-black text-primary bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10">
                              {sub.subjectCode}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-20 text-center text-slate-400"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <BookOpen className="w-10 h-10 opacity-20" />
                            <p className="text-sm font-bold">
                              No subject details found.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setShowSubjectModal(false)}
                className="px-10 py-4 bg-slate-800 text-white text-[10px] font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-900 transition-all uppercase tracking-widest active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseSubjectMapping;
