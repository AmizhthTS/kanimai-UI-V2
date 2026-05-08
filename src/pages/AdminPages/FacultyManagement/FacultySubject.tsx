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
    <div className="space-y-6 pb-16 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner shrink-0">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Faculty - <span className="text-primary">Subject</span>
            </h1>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Academic Assignment Overview
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative group flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search Faculty Name / ID..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-400 placeholder:font-bold placeholder:uppercase placeholder:text-[9px] placeholder:tracking-widest"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button
          onClick={resetFilters}
          className="w-full md:w-auto px-8 py-3.5 bg-rose-50 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Faculty List */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[50vh]">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                  S.No
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Faculty Identity
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Academic Position
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Contact Info
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Syncing Records...
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
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <button
                          onClick={() => fetchSubjectDetails(faculty)}
                          className="text-sm font-black text-primary hover:underline decoration-2 underline-offset-4 transition-all text-left"
                        >
                          {faculty.facultyName}
                        </button>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                          {faculty.facultyId || faculty.employeeId || "No ID"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-700 uppercase">
                          {faculty.course || "-"}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                          {faculty.designationName || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500">
                      {faculty.emailId || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-20 text-center text-slate-400 italic text-sm"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex-1 p-4 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Syncing...
              </span>
            </div>
          ) : faculties.length > 0 ? (
            faculties.map((faculty) => (
              <div
                key={faculty.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-50">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black overflow-hidden shrink-0">
                    {faculty.facultyName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-slate-800 truncate uppercase">
                      {faculty.facultyName}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {faculty.facultyId || faculty.employeeId || "No ID"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-5">
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Academic Position
                    </p>
                    <p className="text-[10px] font-black text-slate-700 uppercase">
                      {faculty.designationName || "Faculty"}
                    </p>
                    <p className="text-[9px] font-bold text-primary uppercase mt-0.5">
                      {faculty.course || "General"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => fetchSubjectDetails(faculty)}
                  className="w-full py-3 bg-primary/10 text-primary font-black text-[9px] uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 border border-primary/5"
                >
                  View Subject Details
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-400 italic text-sm">
              No faculty records found
            </div>
          )}
        </div>

        {/* Pagination Section */}
        <div className="px-4 sm:px-8 py-4 border-t border-slate-100 bg-white flex items-center justify-center sm:justify-end min-h-[70px]">
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
