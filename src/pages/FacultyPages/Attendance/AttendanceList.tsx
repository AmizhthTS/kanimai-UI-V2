import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  Search,
  Loader2,
  GraduationCap,
  Layers,
  Building2,
  Clock,
  Layout,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";
import { attendanceApi } from "@/services/api";
import { toast } from "sonner";

const AttendanceList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const facultyId = sessionStorage.getItem("userID") || "1";
  const facultyName = sessionStorage.getItem("UserName") || "Faculty";

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await attendanceApi.getFacultySubjects(facultyId);
      setSubjects(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load attendance-mapped subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const filteredSubjects = subjects.filter((item) =>
  //   item.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   item.subjectCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   item.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="flex items-center gap-5 sm:gap-6 relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3 transition-all hover:rotate-0 shrink-0">
            <CalendarCheck className="w-6 h-6 sm:w-8 sm:h-8 -rotate-3 transition-all" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Faculty <span className="text-primary">Attendance</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              Mark student attendance for your mapped subjects
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-primary/10 overflow-hidden min-h-[50vh]">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24">
                  S.No
                </th>
                <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Academic Mapping
                </th>
                <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Subject Details
                </th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center w-48">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-5">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </div>
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                        Synchronizing Academic Map...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : subjects.length > 0 ? (
                subjects.map((item, idx) => (
                  <tr
                    key={idx}
                    className="group hover:bg-primary/5 transition-all duration-300"
                  >
                    <td className="px-10 py-6">
                      <span className="text-xs font-black text-slate-300 group-hover:text-primary transition-colors">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-primary transition-all shadow-sm">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            {item.courseName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 ml-12">
                          <span className="text-[10px] font-black text-primary uppercase">
                            SEM: {item.semesterName}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 uppercase">
                            SEC: {item.sectionName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 group-hover:text-primary transition-colors uppercase">
                          {item.subjectName}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                          CODE: {item.subjectCode}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() =>
                          navigate(`/faculty/attendance/update`, {
                            state: { subject: item },
                          })
                        }
                        className="px-6 py-2.5 bg-white border border-primary/10 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 flex items-center gap-2 mx-auto"
                      >
                        Mark Attendance
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                        <ClipboardCheck className="w-10 h-10" />
                      </div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        No assigned subjects found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Attendance Card View */}
        <div className="lg:hidden p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Loading Map...
              </p>
            </div>
          ) : subjects.length > 0 ? (
            subjects.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-primary/5 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-50">
                  <div className="w-11 h-11 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-slate-800 truncate uppercase">
                      {item.subjectName}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      CODE: {item.subjectCode}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-black text-slate-300">
                      #{(idx + 1).toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Academic Target
                    </p>
                    <p className="text-[10px] font-black text-slate-700 uppercase truncate">
                      {item.courseName}
                    </p>
                  </div>
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Placement
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-primary">
                        SEM: {item.semesterName}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500">
                        SEC: {item.sectionName}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/faculty/attendance/update`, {
                      state: { subject: item },
                    })
                  }
                  className="w-full py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  Mark Attendance
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <ClipboardCheck className="w-12 h-12 text-slate-100 mx-auto mb-3" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                No assigned subjects
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
