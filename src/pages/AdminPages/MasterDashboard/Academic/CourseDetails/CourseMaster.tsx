import React, { useState, useEffect } from "react";
import { ChevronLeft, Search, Edit, Trash2, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";

const CourseMaster = () => {
  const navigate = useNavigate();
  const [listLoading, setListLoading] = useState(true);

  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchCourses = async () => {
    setListLoading(true);
    try {
      const response = await masterApi.getCourseList({
        searchStr: searchQuery,
        pageNumber: currentPage - 1,
      });
      setCourses(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await masterApi.deleteCourse(id);
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/master")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Course <span className="text-primary">Details</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Academic Configuration
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/master/course/add")}
          className="bg-primary text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          ADD NEW COURSE
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Course List</h3>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-medium w-full sm:w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
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
          ) : courses.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        S.No
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        Degree
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        Course Name
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        Short Name
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        Final Semester
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        Starting Year
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {courses.map((course, index) => (
                      <tr
                        key={course.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">
                          {((currentPage - 1) * rowsPerPage + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg whitespace-nowrap">
                            {course.degreeName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                            {course.courseName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black px-2 py-1 bg-slate-100 text-slate-600 rounded-lg uppercase">
                            {course.shortName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-600 whitespace-nowrap">
                            {course.semesterName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-600">
                            {course.batch}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/master/course/edit/${course.id}`
                                )
                              }
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
                {courses.map((course, index) => (
                  <div
                    key={course.id}
                    className="p-5 hover:bg-slate-50 transition-colors active:bg-slate-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">
                            #
                            {((currentPage - 1) * rowsPerPage + index + 1)
                              .toString()
                              .padStart(2, "0")}
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md uppercase tracking-wider">
                            {course.degreeName}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-800 leading-tight">
                          {course.courseName}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md uppercase tracking-widest border border-slate-200">
                            {course.shortName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 italic">
                            Batch: {course.batch}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/admin/master/course/edit/${course.id}`)
                        }
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
            <div className="px-6 py-12 text-center text-slate-400 italic text-sm">
              No courses found matching your search.
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

export default CourseMaster;
