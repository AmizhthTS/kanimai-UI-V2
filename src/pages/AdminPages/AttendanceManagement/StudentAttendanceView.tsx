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
  Edit2,
  Save,
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
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/admin/student/attendance")}
            className="p-3 bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all shadow-inner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                {student?.studentName || "Loading..."}
                <span className="text-xs font-bold text-slate-400 border-l border-slate-200 pl-2 uppercase tracking-widest">
                  {student?.rollNo}
                </span>
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Building className="w-3 h-3" /> {student?.degreeName} |{" "}
                  {student?.courseName}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 border-l border-slate-200 pl-4">
                  <Calendar className="w-3 h-3" /> {student?.batch} Batch |{" "}
                  {student?.sectionName}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 border-l border-slate-200 pl-4">
                  <GraduationCap className="w-3 h-3" /> {student?.semesterName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Attendance Details
          </span>
          <div className="flex items-center gap-3 ml-10">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Month
            </span>
            <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEditMode ? (
            <>
              <button
                onClick={() => setIsEditMode(false)}
                className="p-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                Close
              </button>
              {/* <button
                onClick={onSaveAttendance}
                disabled={saving}
                className="p-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button> */}
            </>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
            >
              <Edit2 className="w-4 h-4" />
              Edit Attendance
            </button>
          )}
          <button
            onClick={fetchAttendance}
            className="p-2.5 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
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
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Loading Attendance...
                    </span>
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
                    className="py-20 text-center text-slate-400 italic"
                  >
                    No attendance data found for this month
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

export default StudentAttendanceView;
