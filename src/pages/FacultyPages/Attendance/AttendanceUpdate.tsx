import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Clock,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  ArrowLeft,
  Filter,
  Users,
  ChevronRight,
  Info,
  CalendarCheck2,
  Building2,
  Layers,
} from "lucide-react";
import { attendanceApi, dashboardApi, masterApi } from "@/services/api";
import { toast } from "sonner";
import { format, isSameDay } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const AttendanceUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const subjectData = location.state?.subject;

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [dayHours, setDayHours] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPresent, setAllPresent] = useState(false);

  // Attendance Statuses: 1 (Present), -1 (Absent), 2 (OD)
  const [attendanceMap, setAttendanceMap] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    if (!subjectData) {
      toast.error("Invalid subject access");
      navigate("/faculty/attendance");
      return;
    }
    fetchInitialData();
  }, [subjectData]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [hoursRes, studentsRes, holidaysRes] = await Promise.all([
        masterApi.getDayHourList({ searchStr: "", pageNumber: 0 }),
        attendanceApi.getStudentAttendanceList({
          courseId: subjectData.courseId,
          semesterId: subjectData.semesterId,
          sectionId: subjectData.sectionId,
          searchStr: "",
        }),
        dashboardApi.getHolidayList(),
      ]);

      setDayHours(hoursRes.data.responseModelList || []);
      setHolidays(holidaysRes.data.responseModelList || []);

      const studentList = studentsRes.data.responseModelList || [];
      setStudents(studentList);

      // Removed default 'P' initialization as per requirement.
      // Students start unmarked.
      setAttendanceMap({});

      // Check for existing attendance if date/hour is changed (logic handled in separate effect)
    } catch (error) {
      console.error("Error loading attendance data:", error);
      toast.error("Failed to load student list");
    } finally {
      setLoading(false);
    }
  };

  // Check for existing attendance when date or hour changes
  useEffect(() => {
    if (selectedHours.length > 0 && selectedDate) {
      fetchExistingAttendance();
    }
  }, [selectedDate, selectedHours]);

  const fetchExistingAttendance = async () => {
    setAttendanceMap({});
    // Note: The original logic shows updating attendance for a single hour or multiple hours
    // For simplicity in the first pass, we handle based on the last selected hour if multiple
    const lastHour = selectedHours[selectedHours.length - 1];
    if (!lastHour) return;

    try {
      const response = await attendanceApi.getFacultyAttendanceData({
        subjectId: subjectData.subjectId,
        semesterId: subjectData.semesterId,
        sectionId: subjectData.sectionId,
        dateString: selectedDate,
        dayHourId: lastHour,
      });

      if (response.data && response.data.length > 0) {
        const existingMap: Record<string, number> = {};
        response.data.forEach((att: any) => {
          existingMap[att.studentId] = att.attendanceValue; // status expected from API
        });
        setAttendanceMap(existingMap);
        toast.info("Existing attendance loaded for this period");
      }
    } catch (error) {
      console.error("No existing attendance found or error:", error);
    }
  };

  const toggleStatus = (studentId: string) => {
    setAttendanceMap((prev) => {
      const current = prev[studentId];
      let next: number;
      if (current === 1) next = -1;
      else if (current === -1) next = 2;
      else if (current === 2) next = 1;
      else next = 1;
      return { ...prev, [studentId]: next };
    });
  };

  const handleAllPresent = (checked: boolean) => {
    setAllPresent(checked);
    const updatedMap = { ...attendanceMap };

    if (checked) {
      // Mark all currently filtered students as Present (1)
      filteredStudents.forEach((student) => {
        updatedMap[student.id] = 1;
      });
    } else {
      // Unmark all currently filtered students
      filteredStudents.forEach((student) => {
        delete updatedMap[student.id];
      });
    }
    setAttendanceMap(updatedMap);
  };

  const stats = useMemo(() => {
    const values = Object.values(attendanceMap);
    return {
      total: students.length,
      present: values.filter((v) => v === 1).length,
      absent: values.filter((v) => v === -1).length,
      od: values.filter((v) => v === 2).length,
    };
  }, [students, attendanceMap]);

  const filteredStudents = students.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId?.toString().includes(searchQuery),
  );

  const onSave = async () => {
    if (selectedHours.length === 0) {
      toast.warning("Please select at least one hour period");
      return;
    }

    const studentAttendanceDTOList = Object.entries(attendanceMap).map(
      ([id, status]) => ({
        studentId: parseInt(id),
        attendanceValue: status,
      }),
    );

    setLoading(true);
    try {
      // API expects one request per hour according to the provided loop logic
      const promises = selectedHours.map((hourId) => {
        const payload = {
          semesterId: subjectData.semesterId,
          sectionId: subjectData.sectionId,
          subjectId: subjectData.subjectId,
          courseId: subjectData.courseId,
          dateString: selectedDate,
          dayHourId: parseInt(hourId),
          totalstudents: stats.total,
          noofpresent: stats.present,
          noofod: stats.od,
          noofabsent: stats.absent,
          studentAttendanceDTOList: studentAttendanceDTOList,
        };
        return attendanceApi.saveStudentAttendance(payload);
      });

      await Promise.all(promises);
      toast.success("Attendance saved successfully for all selected hours!");
      navigate("/faculty/attendance");
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const isHoliday = holidays.some((h) =>
    isSameDay(new Date(h.date), new Date(selectedDate)),
  );

  if (!subjectData) return null;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-700">
      {/* Header & Context */}
      <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-primary/10 flex flex-col gap-6 sm:gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-40 -mt-40 blur-3xl" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10 text-center lg:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-slate-400 hover:bg-primary/10 transition-all active:scale-95 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight truncate max-w-full">
                  {subjectData.subjectName}
                </h1>
                <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/10 shrink-0">
                  {subjectData.subjectCode}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" /> {subjectData.courseName}
                </span>
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> {subjectData.semesterName}{" "}
                  | {subjectData.sectionName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <div className="flex-1 sm:flex-none bg-emerald-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl flex flex-col items-center border border-emerald-100/50">
                <span className="text-lg sm:text-xl font-black text-emerald-600">
                  {stats.present}
                </span>
                <span className="text-[8px] sm:text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">
                  Present
                </span>
              </div>

              <div className="flex-1 sm:flex-none bg-blue-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl flex flex-col items-center border border-blue-100/50">
                <span className="text-lg sm:text-xl font-black text-blue-600">
                  {stats.od}
                </span>
                <span className="text-[8px] sm:text-[9px] font-black text-blue-500/60 uppercase tracking-widest">
                  OD
                </span>
              </div>

              <div className="flex-1 sm:flex-none bg-rose-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl flex flex-col items-center border border-rose-100/50">
                <span className="text-lg sm:text-xl font-black text-rose-600">
                  {stats.absent}
                </span>
                <span className="text-[8px] sm:text-[9px] font-black text-rose-500/60 uppercase tracking-widest">
                  Absent
                </span>
              </div>
            </div>

            <button
              onClick={onSave}
              disabled={loading || isHoliday}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Finalize Record
            </button>
          </div>
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 pt-6 border-t border-primary/10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Session Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-5 pr-5 py-3.5 bg-primary/5 border border-primary/10 rounded-2xl text-xs font-bold text-slate-600 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all"
              />
              {isHoliday && (
                <div className="absolute -bottom-6 left-1 flex items-center gap-1.5 text-[10px] font-bold text-rose-500 uppercase tracking-wide">
                  <AlertCircle className="w-3 h-3" /> Holiday: No session
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Hour Period
            </label>
            <div className="flex flex-wrap gap-2">
              {dayHours.map((hour) => (
                <button
                  key={hour.id}
                  onClick={() => {
                    setSelectedHours((prev) =>
                      prev.includes(hour.id.toString())
                        ? prev.filter((h) => h !== hour.id.toString())
                        : [...prev, hour.id.toString()],
                    );
                  }}
                  className={cn(
                    "px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all",
                    selectedHours.includes(hour.id.toString())
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "bg-primary/5 border-primary/10 text-slate-400 hover:bg-primary/10",
                  )}
                >
                  {hour.hourName}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end gap-2">
            <div className="flex items-center gap-3 bg-primary/5 px-6 py-3.5 rounded-2xl border border-primary/10 w-full hover:bg-primary/[0.07] transition-all group">
              <input
                type="checkbox"
                id="allPresent"
                checked={allPresent}
                onChange={(e) => handleAllPresent(e.target.checked)}
                className="w-5 h-5 rounded-lg border-primary/20 text-primary focus:ring-primary transition-all cursor-pointer"
              />
              <label
                htmlFor="allPresent"
                className="text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none flex-1"
              >
                Mark All Present
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-300" />
              </div>
              <input
                type="text"
                placeholder="SEARCH STUDENTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-3.5 bg-primary/5 border border-primary/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Present
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
            <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
              On Duty (OD)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
            <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Absent
            </span>
          </div>
        </div>
      </div>

      {/* Student Cards Grid */}
      {loading ? (
        <div className="py-40 flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
            Assembling Roster...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredStudents.map((student) => {
            const status = attendanceMap[student.id];
            return (
              <button
                key={student.id}
                onClick={() => toggleStatus(student.id)}
                className={cn(
                  "relative p-5 sm:p-6 rounded-[2rem] border-2 transition-all duration-300 group overflow-hidden flex flex-col items-center text-center gap-4 active:scale-95 shadow-sm h-full",
                  status === 1 &&
                    "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10",
                  status === -1 &&
                    "bg-rose-500 border-rose-500 text-white shadow-rose-500/10",
                  status === 2 &&
                    "bg-blue-500 border-blue-500 text-white shadow-blue-500/10",
                  !status &&
                    "bg-white border-primary/10 hover:border-primary/30",
                )}
              >
                {/* Status Overlay */}
                <div className="absolute top-4 right-4 transition-transform group-hover:scale-125 z-20">
                  {status === 1 && (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                  )}
                  {status === -1 && (
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                  )}
                  {status === 2 && (
                    <CalendarCheck2 className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                  )}
                </div>

                <div
                  className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] border-4 p-1 shadow-xl transition-all duration-300 relative z-10",
                    status === 1 && "border-emerald-200 bg-emerald-500/10",
                    status === -1 && "border-rose-200 bg-rose-500/10",
                    status === 2 && "border-blue-200 bg-blue-500/10",
                    !status && "border-primary/5 bg-primary/5",
                  )}
                >
                  {student.studentImage || student.image ? (
                    <img
                      src={student.studentImage || student.image}
                      alt={student.studentName}
                      className="w-full h-full object-cover rounded-[1.25rem]"
                      onError={(e: any) => {
                        e.target.src = ""; // Fallback
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User
                        className={cn(
                          "w-8 h-8 sm:w-10 sm:h-10",
                          status ? "text-white/40" : "text-slate-200",
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1 relative z-10">
                  <p
                    className={cn(
                      "text-[10px] sm:text-xs font-black uppercase tracking-tight line-clamp-2 px-1 leading-tight",
                      status ? "text-white" : "text-slate-800",
                    )}
                  >
                    {student.studentName}
                  </p>
                  <p
                    className={cn(
                      "text-[8px] sm:text-[9px] font-bold uppercase tracking-widest",
                      status ? "text-white/60" : "text-slate-400",
                    )}
                  >
                    ID: {student.studentId || student.id}
                  </p>
                </div>

                {/* Interaction Hint */}
                <div
                  className={cn(
                    "absolute bottom-0 inset-x-0 py-1.5 transition-all z-10",
                    status === 1 && "bg-emerald-600",
                    status === -1 && "bg-rose-600",
                    status === 2 && "bg-blue-600",
                    !status && "bg-primary/5",
                  )}
                >
                  <span
                    className={cn(
                      "text-[7px] sm:text-[8px] font-black uppercase tracking-widest",
                      status ? "text-white" : "text-slate-400 opacity-40",
                    )}
                  >
                    {status === 1
                      ? "Present"
                      : status === -1
                        ? "Absent"
                        : status === 2
                          ? "On Duty"
                          : "Unmarked"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {!loading && filteredStudents.length === 0 && (
        <div className="py-40 bg-white rounded-[2.5rem] border-2 border-dashed border-primary/10 flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-100">
            <Users className="w-10 h-10" />
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            No students found
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceUpdate;
