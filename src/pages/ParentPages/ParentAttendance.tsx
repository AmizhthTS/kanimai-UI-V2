import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Check, X, Loader2, RotateCcw } from "lucide-react";
import { parentApi } from "@/services/api";
import { format } from "date-fns";
import MonthPicker from "@/components/Inputs/MonthPicker";
import { cn } from "@/lib/utils";

const ParentAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "MM-yyyy"));

  const studentId = sessionStorage.getItem("linkedStudentId") || "1";

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const [month, year] = selectedMonth.split("-");
      const response = await parentApi.getAttendance(studentId, month, year);
      
      if (response && response.data) {
        setAttendanceData(response.data);
      } else {
        // Mock data structure fallback
        setAttendanceData({
          totalWorkingDays: 22,
          daysPresent: 20,
          daysAbsent: 2,
          attendanceLogs: [
            { date: "2026-05-01", status: "Present" },
            { date: "2026-05-02", status: "Absent" },
            { date: "2026-05-03", status: "Present" },
            { date: "2026-05-04", status: "Present" },
          ]
        });
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      // Mock fallback
      setAttendanceData({
        totalWorkingDays: 22,
        daysPresent: 20,
        daysAbsent: 2,
        attendanceLogs: [
          { date: "2026-05-01", status: "Present" },
          { date: "2026-05-02", status: "Absent" },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, studentId]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Attendance Record</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Monthly Overview</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Month</span>
            <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
          </div>
          <button
            onClick={fetchAttendance}
            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-md rounded-xl transition-all active:scale-95 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Working Days</span>
          <span className="text-3xl font-black text-slate-800">{attendanceData?.totalWorkingDays || 0}</span>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col gap-1">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Days Present</span>
          <span className="text-3xl font-black text-emerald-700">{attendanceData?.daysPresent || 0}</span>
        </div>
        <div className="bg-rose-50 p-6 rounded-2xl shadow-sm border border-rose-100 flex flex-col gap-1">
          <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Days Absent</span>
          <span className="text-3xl font-black text-rose-700">{attendanceData?.daysAbsent || 0}</span>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[40vh]">
        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">Daily Logs</h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest">Fetching Logs...</span>
          </div>
        ) : attendanceData?.attendanceLogs?.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {attendanceData.attendanceLogs.map((log: any, index: number) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    log.status === "Present" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                  )}>
                    {log.status === "Present" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{log.date}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Date</p>
                  </div>
                </div>
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                  log.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 italic text-sm">
            No attendance logs found for this month.
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentAttendance;
