import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  Loader2,
  GraduationCap,
  Plus,
  Building,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const FeeCourseMapping = () => {
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
      const response = await masterApi.getFeeCourseMappingList({
        degreeId: selectedDegree?.id || "",
        courseId: selectedCourse?.id || "",
        pageNumber: currentPage - 1,
      });
      setMappings(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching fee-course mappings:", error);
      toast.error("Failed to load mapping list");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMappings();
    }, 400);
    return () => clearTimeout(timer);
  }, [selectedDegree, selectedCourse, currentPage]);

  const handleEdit = (mapping: any) => {
    navigate(`/admin/master/fee-course-mapping/edit/${mapping.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this fee mapping?"))
      return;
    try {
      await masterApi.deleteFeeCourseMapping(id);
      toast.success("Mapping deleted successfully");
      fetchMappings();
    } catch (error) {
      console.error("Error deleting mapping:", error);
      toast.error("Failed to delete mapping");
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex md:flex-row flex-col items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/master")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Fee Detail <span className="text-primary">Course Mapping</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Financial Configuration
            </p>
          </div>
        </div>

        <div className="md:w-auto w-full flex justify-end">
          <button
            onClick={() => navigate("/admin/master/fee-course-mapping/add")}
            className="bg-primary text-white font-bold text-xs py-2.5 px-4 sm:mt-0 mt-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            ADD FEE MAPPING
          </button>
        </div>
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
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Fetching data...
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
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">
                        S.No
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Course
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Batch
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Fee Name
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Due Date / Days
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Fee Amount
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mappings.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">
                          {((currentPage - 1) * rowsPerPage + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-600">
                            {item.courseName || "All"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-black">
                            {item.batch}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-600">
                          {item.feeName}
                        </td>
                        <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                          {item.dueDate || item.dueDays}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-black text-primary">
                            ₹
                            {Number(item.amount).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg transition-all"
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

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {mappings.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-5 hover:bg-slate-50 transition-colors active:bg-slate-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">
                            #
                            {((currentPage - 1) * rowsPerPage + index + 1)
                              .toString()
                              .padStart(2, "0")}
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md uppercase tracking-wider">
                            Batch {item.batch}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-slate-800 leading-tight">
                            {item.feeName}
                          </h4>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {item.courseName || "All Courses"}
                          </p>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Amount
                            </span>
                            <span className="text-base font-black text-primary">
                              ₹
                              {Number(item.amount).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Due Info
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {item.dueDate || item.dueDays}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEdit(item)}
                        className="p-3 bg-white border border-slate-100 text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm flex-shrink-0"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-6 py-20 text-center text-slate-400 italic text-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 opacity-20" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-500 not-italic">
                    No fee mappings found
                  </p>
                  <p className="text-[10px] uppercase tracking-widest font-bold">
                    Try adjusting your search
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-2 border-t border-slate-100 flex items-center justify-end bg-white mt-auto min-h-[60px]">
          {totalCount > rowsPerPage && (
            <CustomPagination
              totalPages={Math.ceil(totalCount / rowsPerPage)}
              page={currentPage - 1}
              onPageChange={(_: any, newPage: number) =>
                setCurrentPage(newPage + 1)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeCourseMapping;
