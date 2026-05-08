import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  Loader2,
  CalendarCheck,
  Plus,
  LayoutGrid,
  Building,
  GraduationCap,
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

const DayOrderFacultyMapping = () => {
  const navigate = useNavigate();
  const [listLoading, setListLoading] = useState(true);
  const [mappings, setMappings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      const response = await masterApi.getDegreeList({ searchStr: "" });
      setDegrees(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  const fetchCourses = async (degreeId: string) => {
    try {
      const response = await masterApi.getCourseList({
        searchStr: "",
        degreeId: degreeId,
      });
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
    setSearchQuery("");
    setCurrentPage(1);
  };

  const fetchMappings = async () => {
    setListLoading(true);
    try {
      const response = await masterApi.getCourseSectionList({
        searchStr: searchQuery,
        degreeId: selectedDegree?.id || "",
        courseId: selectedCourse?.id || "",
        pageNumber: currentPage - 1,
      });
      setMappings(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching course-section mappings:", error);
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
  }, [searchQuery, currentPage, selectedDegree, selectedCourse]);

  const handleEdit = (mapping: any) => {
    navigate(`/admin/master/dayorder-faculty-mapping/edit/${mapping.id}`);
  };

  const handleViewTimetable = (mapping: any) => {
    navigate(
      `/admin/master/dayorder-faculty-mapping/timetable/${mapping.courseId}/semester/${mapping.semesterId}/section/${mapping.sectionId}`,
      { state: { mapping } },
    );
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
              Day Order <span className="text-primary">Faculty Mapping</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Timetable & Section Management
            </p>
          </div>
        </div>

        <div className="md:w-auto w-full flex justify-end">
          <button
            onClick={() =>
              navigate("/admin/master/dayorder-faculty-mapping/add")
            }
            className="bg-primary text-white font-bold text-xs py-2.5 px-4 sm:mt-0 mt-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            CREATE SECTION MAPPING
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
                  Fetching mappings...
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
                        Degree / Course
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Year
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Semester
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Section
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">
                        Actions
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
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-800">
                              {item.courseName}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {item.degreeName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-black">
                            {item.yearName || item.yearId}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-bold text-slate-600">
                            {item.semesterName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider">
                            {item.sectionName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewTimetable(item)}
                              className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-wider"
                            >
                              <LayoutGrid className="w-3 h-3" />
                              Timetable
                            </button>
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
                            {item.yearName || item.yearId}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-slate-800 leading-tight">
                            {item.courseName}
                          </h4>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {item.degreeName} • {item.semesterName}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest">
                            Section {item.sectionName}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewTimetable(item)}
                              className="px-3 py-1.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-95"
                            >
                              <LayoutGrid className="w-3.5 h-3.5" />
                              Timetable
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-3 bg-white border border-slate-100 text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm flex-shrink-0"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-6 py-20 text-center text-slate-400 italic text-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <CalendarCheck className="w-8 h-8 opacity-20" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-500 not-italic">
                    No section mappings found
                  </p>
                  <p className="text-[10px] uppercase tracking-widest font-bold">
                    Create one to start scheduling
                  </p>
                </div>
              </div>
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
    </div>
  );
};

export default DayOrderFacultyMapping;
