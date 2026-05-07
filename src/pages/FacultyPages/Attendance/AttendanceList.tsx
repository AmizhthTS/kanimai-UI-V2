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
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3 transition-all hover:rotate-0">
            <CalendarCheck className="w-8 h-8 -rotate-3 transition-all" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Faculty <span className="text-primary">Attendance</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              Mark student attendance for your mapped subjects
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-primary/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  S.No
                </th>
                <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Course
                </th>
                <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Semester
                </th>
                <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Section
                </th>
                <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Subject Name
                </th>
                <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Subject Code
                </th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-10 py-32 text-center">
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
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-primary transition-all shadow-sm">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {item.courseName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                        {item.semesterName}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <Layout className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 uppercase">
                          {item.sectionName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-black text-slate-800 group-hover:text-primary transition-colors">
                        {item.subjectName}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest group-hover:bg-primary/10 transition-all">
                        {item.subjectCode}
                      </span>
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
                  <td colSpan={7} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                        <ClipboardCheck className="w-10 h-10" />
                      </div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        No assigned subjects found for attendance marking
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
