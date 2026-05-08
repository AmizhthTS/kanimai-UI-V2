import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Calendar,
  X,
  Check,
  RotateCcw,
  Loader2,
  User,
  GraduationCap,
  Building,
  Building2,
  Edit2,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { studentApi, masterApi } from "@/services/api";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { cn } from "@/lib/utils";
import MonthPicker from "@/components/Inputs/MonthPicker";

const StudentAttendanceView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [dayHours, setDayHours] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "MM-yyyy"),
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchDayHours = async () => {
    try {
      const response = await masterApi.getDayHourList({});
      setDayHours(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching day hours:", error);
    }
  };

  const fetchStudentData = async () => {
    if (!id) return;
    try {
      const response = await studentApi.getStudentById(id);
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const fetchAttendance = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [month, year] = selectedMonth.split("-");
      const response = await studentApi.getStudentAttendance(id, month, year);
      setAttendanceData(response.data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayHours();
    fetchStudentData();
  }, [id]);

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, id]);

  const getAttendanceValue = (dateStr: string, hourId: number) => {
    const dayData = attendanceData.find((d) => d.dateString === dateStr);
    if (!dayData) return null;
    const hourData = dayData.studentAttendanceViewDayOrderMapDTOs.find(
      (h: any) => h.dayHourId === hourId,
    );
    return hourData ? hourData.attendanceValue : null;
  };

  const handleAttendanceChange = async (dateStr: string, hourId: number) => {
    if (!isEditMode) return;

    const day = attendanceData.find((d) => d.dateString === dateStr);
    const hourDTO = day?.studentAttendanceViewDayOrderMapDTOs.find(
      (h: any) => h.dayHourId === hourId,
    );

    // Only enable edit option if backend data exists (has an ID)
    if (!hourDTO || !hourDTO.id) return;

    // Cycle: 1 (Present) -> -1 (Absent)
    const nextValue = hourDTO.attendanceValue === 1 ? -1 : 1;

    try {
      await studentApi.saveAttendance(hourDTO.id, nextValue.toString());

      // Update local state for immediate feedback
      setAttendanceData((prev) =>
        prev.map((d) => {
          if (d.dateString === dateStr) {
            return {
              ...d,
              studentAttendanceViewDayOrderMapDTOs:
                d.studentAttendanceViewDayOrderMapDTOs.map((h: any) =>
                  h.id === hourDTO.id
                    ? { ...h, attendanceValue: nextValue }
                    : h,
                ),
            };
          }
          return d;
        }),
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Failed to update attendance");
    }
  };

  const onSaveAttendance = async () => {
    setSaving(true);
    try {
      await studentApi.saveAttendance(id, "save");
      toast.success("Attendance updated successfully");
      setIsEditMode(false);
      fetchAttendance();
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const renderAttendanceIcon = (value: any) => {
    if (value === 1)
      return <Check className="w-4 h-4 text-emerald-500 mx-auto" />;
    if (value === -1) return <X className="w-4 h-4 text-rose-500 mx-auto" />;
    return <span className="text-slate-200 mx-auto">-</span>;
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-300 hover:shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group shrink-0">
            {student?.studentImage ? (
              <img
                src={student.studentImage}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <User className="w-12 h-12 text-slate-300" />
            )}
          </div>
          <div className="text-center sm:text-left space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              {student?.studentName || "Loading..."}
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-200 pt-1 sm:pt-0 sm:pl-2 uppercase tracking-widest">
                {student?.rollNo}
              </span>
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                <Building2 className="w-3 h-3" /> {student?.courseName}
              </span>
              <span className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <Calendar className="w-3 h-3" /> {student?.batch}
              </span>
              <span className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                Sem {student?.semesterId}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full md:w-auto">
          <button
            onClick={() => navigate("/admin/student/attendance")}
            className="w-full md:w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-800 hover:shadow-lg transition-all flex items-center justify-center group active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="md:hidden ml-2 font-black text-xs uppercase tracking-widest text-slate-600">
              Back to List
            </span>
          </button>
        </div>
      </div>

      {/* Filters & Actions Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:inline">
            Attendance Period
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50 p-2 sm:p-0 rounded-xl sm:bg-transparent">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 sm:ml-4">
              Month
            </span>
            <div className="flex-1 sm:flex-none">
              <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isEditMode ? (
            <button
              onClick={() => setIsEditMode(false)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95"
            >
              Finish Editing
            </button>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Mode
            </button>
          )}
          <button
            onClick={fetchAttendance}
            className="p-2.5 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Attendance Matrix */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[50vh]">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">
                  Date
                </th>
                {dayHours.map((hour) => (
                  <th
                    key={hour.id}
                    className="px-4 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    {hour.hourName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={dayHours.length + 1}
                    className="py-20 text-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Syncing Records...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : attendanceData.length > 0 ? (
                attendanceData.map((day) => (
                  <tr
                    key={day.dateString}
                    className="hover:bg-slate-50/50 transition-all group"
                  >
                    <td className="px-8 py-5 text-sm font-black text-slate-600">
                      {day.dateString}
                    </td>
                    {dayHours.map((hour) => (
                      <td
                        key={hour.id}
                        className={cn(
                          "px-4 py-5 text-center transition-all",
                          isEditMode && "cursor-pointer hover:bg-slate-100/50",
                        )}
                        onClick={() =>
                          handleAttendanceChange(day.dateString, hour.id)
                        }
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all mx-auto",
                            isEditMode
                              ? "bg-white shadow-sm ring-1 ring-slate-100 hover:ring-primary hover:shadow-primary/10 scale-110"
                              : "group-hover:bg-white",
                          )}
                        >
                          {renderAttendanceIcon(
                            getAttendanceValue(day.dateString, hour.id),
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={dayHours.length + 1}
                    className="py-20 text-center text-slate-400 italic text-sm"
                  >
                    No attendance records for this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Loading...
              </span>
            </div>
          ) : attendanceData.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {attendanceData.map((day) => (
                <div key={day.dateString} className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-700">
                      {day.dateString}
                    </h4>
                    {isEditMode && (
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 animate-pulse">
                        Tap to toggle
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 gap-2">
                    {dayHours.map((hour) => (
                      <div
                        key={hour.id}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <span className="text-[7px] font-black text-slate-400 uppercase">
                          {hour.hourName}
                        </span>
                        <div
                          onClick={() =>
                            handleAttendanceChange(day.dateString, hour.id)
                          }
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                            isEditMode
                              ? "bg-white shadow-md border border-primary/20 scale-105 active:scale-95"
                              : "bg-slate-50",
                          )}
                        >
                          {renderAttendanceIcon(
                            getAttendanceValue(day.dateString, hour.id),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 italic text-sm">
              No records found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceView;
