import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { facultyApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";

const FacultySubject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 10;

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await facultyApi.getFacultyList({
        staffCategoryId: 1, // Only Teaching Staff as per user snippet
        pageNumber: currentPage - 1,
        searchStr: searchQuery,
      });
      setFaculties(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      toast.error("Failed to load faculty list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFaculties();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const fetchSubjectDetails = (faculty: any) => {
    navigate(`/admin/faculty/subjects/view/${faculty.id}`);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Faculty - <span className="text-primary">Subject</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Academic Assignment Overview
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Faculty Name / ID"
            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-400 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button
          onClick={resetFilters}
          className="px-6 py-3 bg-rose-50 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Faculty List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[60vh]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                  S.No
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Faculty ID
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Faculty Name
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Designation
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Course
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Faculty Email ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Syncing Faculty Records...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : faculties.length > 0 ? (
                faculties.map((faculty, index) => (
                  <tr
                    key={faculty.id}
                    className="hover:bg-slate-50/50 transition-all group"
                  >
                    <td className="px-8 py-5 text-sm font-black text-slate-300">
                      {((currentPage - 1) * rowsPerPage + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-600">
                      {faculty.facultyId || "NO ID"}
                    </td>
                    <td className="px-8 py-5">
                      <button
                        onClick={() => fetchSubjectDetails(faculty)}
                        className="text-sm font-black text-primary hover:underline decoration-2 underline-offset-4 transition-all"
                      >
                        {faculty.facultyName}
                      </button>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">
                      {faculty.designationName || "-"}
                    </td>
                    <td className="px-8 py-5 text-xs font-black text-slate-700">
                      {faculty.course || "-"}
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500">
                      {faculty.emailId || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-20 text-center text-slate-400 italic text-sm"
                  >
                    No faculty records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-4 border-t border-slate-100 bg-white flex items-center justify-end min-h-[70px]">
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

export default FacultySubject;
