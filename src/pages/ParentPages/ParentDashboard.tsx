import React, { useEffect, useState } from "react";
import { LayoutDashboard, Calendar, GraduationCap, Wallet, Bus, Loader2, Bell, FileText, ChevronRight } from "lucide-react";
import { parentApi } from "@/services/api";
import { useParentStudent } from "@/contexts/ParentStudentContext";
import { cn } from "@/lib/utils";

const ParentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const { students, activeStudent, setActiveStudent } = useParentStudent();
  const studentId = activeStudent?.id || "1";
  const studentName = activeStudent?.studentname || "Student";

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await parentApi.getDashboardSummary(studentId);
      if (response && response.data) {
        setDashboardData(response.data);
      } else {
        // Fallback mock data based on selected student
        setDashboardData({
          overallAttendancePercentage: activeStudent?.attendance || 85.5,
          totalFeeDue: activeStudent?.feeDue ?? 15000,
          lastSemesterCGPA: activeStudent?.cgpa || 8.4,
          upcomingEvents: [],
          routeName: activeStudent?.routeName || "Route 5 - Downtown"
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      // Fallback mock data
      setDashboardData({
        overallAttendancePercentage: activeStudent?.attendance || 85.5,
        totalFeeDue: activeStudent?.feeDue ?? 15000,
        lastSemesterCGPA: activeStudent?.cgpa || 8.4,
        upcomingEvents: [],
        routeName: activeStudent?.routeName || "Route 5"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeStudent) {
      fetchDashboardData();
    }
  }, [studentId, activeStudent]);

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Welcome back!
        </h1>
        <p className="text-slate-500 font-medium">
          Here is the latest update on {studentName}'s academic progress.
        </p>
      </div>

      {/* Children Quick Switcher - Unique Design Structure */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">Children's Profiles</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Quick switch between profiles to view academic summary</p>
          </div>
          <span className="self-start px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            {students.length} Linked Children
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {students.map((student) => {
            const isActive = student.id === activeStudent?.id;
            return (
              <button
                key={student.id}
                onClick={() => setActiveStudent(student)}
                className={cn(
                  "relative flex flex-col p-5 rounded-2xl border text-left transition-all duration-300 group overflow-hidden active:scale-[0.98]",
                  isActive
                    ? "border-slate-200/85 bg-slate-50/30 shadow-lg scale-[1.01]"
                    : "border-slate-100 bg-transparent hover:bg-slate-50/30 hover:border-slate-200/50 hover:shadow-md"
                )}
              >
                {isActive && (
                  <span className="absolute right-4 top-4 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}

                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center font-black text-white text-xs shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 shrink-0",
                    student.avatarBg
                  )}>
                    {student.studentname.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <h3 className={cn(
                      "font-black text-sm leading-tight transition-colors",
                      isActive ? "text-slate-800" : "text-slate-600 group-hover:text-slate-800"
                    )}>
                      {student.studentname}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                      {student.rollNo}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-100/80 my-4 w-full" />

                <div className="grid grid-cols-3 gap-2 w-full">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50/60 border border-slate-100/50">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Attendance</span>
                    <span className={cn(
                      "text-xs font-black mt-1",
                      student.attendance >= 85 ? "text-emerald-600" : student.attendance >= 75 ? "text-amber-500" : "text-rose-500"
                    )}>
                      {student.attendance}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50/60 border border-slate-100/50">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">GPA</span>
                    <span className="text-xs font-black text-slate-700 mt-1">
                      {student.cgpa}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50/60 border border-slate-100/50">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fees Due</span>
                    <span className={cn(
                      "text-[10px] font-black mt-1",
                      student.feeDue > 0 ? "text-rose-500" : "text-emerald-600"
                    )}>
                      {student.feeDue > 0 ? `₹${student.feeDue.toLocaleString()}` : "Nil"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Attendance</p>
            <h3 className="text-2xl font-black text-slate-800">{dashboardData?.overallAttendancePercentage || 0}%</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Last CGPA</p>
            <h3 className="text-2xl font-black text-slate-800">{dashboardData?.lastSemesterCGPA || "-"}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Fee Due</p>
            <h3 className="text-2xl font-black text-slate-800">₹{dashboardData?.totalFeeDue?.toLocaleString() || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Transport</p>
            <h3 className="text-lg font-black text-slate-800">{dashboardData?.routeName || "-"}</h3>
          </div>
        </div>
      </div>

      {/* Sample Detailed Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Notice Board Widget */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[400px]">
          <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Notice Board</h3>
            </div>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center">
              View All <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="p-0 overflow-y-auto flex-1 divide-y divide-slate-50">
            {[
              { title: "Semester Exam Timetable Released", date: "May 15, 2026", type: "Academic" },
              { title: "Hostel Fee Payment Deadline Extended", date: "May 12, 2026", type: "Finance" },
              { title: "National Level Tech Symposium", date: "May 10, 2026", type: "Event" },
              { title: "Declaration of Holidays for Local Festival", date: "May 05, 2026", type: "General" }
            ].map((notice, idx) => (
              <div key={idx} className="p-5 hover:bg-slate-50/50 transition-colors group cursor-pointer flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center shrink-0 border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{notice.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{notice.date}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{notice.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Widget */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[400px]">
          <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Upcoming Events</h3>
            </div>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {[
              { title: "Parent-Teacher Meeting", date: "24", month: "May", desc: "Discussion on mid-semester performance.", time: "10:00 AM - 01:00 PM" },
              { title: "Annual Cultural Fest - Tarang", date: "05", month: "Jun", desc: "Inter-college cultural competitions.", time: "09:00 AM - 06:00 PM" },
              { title: "Semester Practical Exams", date: "15", month: "Jun", desc: "Lab sessions for core subjects.", time: "As per batch schedule" }
            ].map((event, idx) => (
              <div key={idx} className="flex items-stretch gap-4 p-4 border border-slate-100 rounded-2xl hover:border-emerald-200 hover:shadow-md transition-all group">
                <div className="flex flex-col items-center justify-center bg-emerald-50 rounded-xl px-4 py-2 shrink-0 border border-emerald-100">
                  <span className="text-xl font-black text-emerald-600">{event.date}</span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{event.month}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{event.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{event.desc}</p>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 block">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParentDashboard;
