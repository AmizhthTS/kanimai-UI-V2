import React from "react";
import { Users, UserCheck, Building, Banknote, Calendar, Bell, ChevronRight, GraduationCap, ClipboardCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from "recharts";
import { format } from "date-fns";

const PrincipalDashboard = () => {
  const principalName = sessionStorage.getItem("UserName") || "Dr. Charles";

  const stats = [
    { label: "Institution Students", value: "4,850", icon: Users, color: "bg-indigo-500", detail: "Active enrollment" },
    { label: "Teaching Faculty", value: "340", icon: UserCheck, color: "bg-blue-500", detail: "Ratio: 1:14" },
    { label: "Academic Departments", value: "12", icon: Building, color: "bg-rose-500", detail: "CSE, ECE, Mech, etc." },
    { label: "Annual Collection", value: "₹ 14.2M", icon: Banknote, color: "bg-teal-500", detail: "92% collection rate" }
  ];

  const attendanceData = [
    { day: "Mon", Present: 94.2 },
    { day: "Tue", Present: 95.1 },
    { day: "Wed", Present: 94.8 },
    { day: "Thu", Present: 93.6 },
    { day: "Fri", Present: 92.5 },
    { day: "Sat", Present: 95.8 }
  ];

  const departmentGPAData = [
    { name: "CSE", GPA: 8.4, Attendance: 95 },
    { name: "ECE", GPA: 8.1, Attendance: 92 },
    { name: "EEE", GPA: 7.8, Attendance: 91 },
    { name: "MECH", GPA: 7.5, Attendance: 88 },
    { name: "BIOTECH", GPA: 8.6, Attendance: 96 },
    { name: "CIVIL", GPA: 7.6, Attendance: 89 }
  ];

  const upcomingAlerts = [
    { title: "Staff Council Meeting", date: "May 29, 03:00 PM", desc: "Discussion on upcoming NAAC accreditation visit." },
    { title: "Semester Exam Commencement", date: "June 8, 2026", desc: "Timetable schedules published online." },
    { title: "Alumni Meet 2026", date: "June 15, 2026", desc: "Registrations reached over 800+ entries." }
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Principal Dashboard
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            Welcome, <span className="text-primary">{principalName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
          <Calendar className="w-4 h-4 text-primary" />
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 ${stat.color} transition-transform group-hover:scale-110`} />
              <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 block">{stat.detail}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real-time Student Attendance Monitor */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">Real-time Student Attendance Trend</h3>
            </div>
            <span className="text-[10px] font-bold text-primary bg-indigo-50 px-2 py-0.5 rounded">WEEKLY</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "bold" }} />
                <Area type="monotone" dataKey="Present" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" name="Attendance %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notices & Circulars */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-rose-500 rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">Administrative Broadcasts</h3>
            </div>
            <div className="space-y-4">
              {upcomingAlerts.map((alert, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">{alert.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1.5 leading-tight">{alert.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-1 leading-normal">{alert.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-4 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-1">
            Publish Announcement <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Row 3: Department Performance Analytics */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-teal-500 rounded-full" />
            <h3 className="font-bold text-slate-800 text-sm">Department Performance & Workloads</h3>
          </div>
          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">COMPARATIVE STATEMENT</span>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentGPAData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} label={{ value: 'Attendance %', angle: -90, position: 'insideLeft', style: { fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' } }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} label={{ value: 'GPA', angle: 90, position: 'insideRight', style: { fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' } }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "bold" }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
              <Bar yAxisId="left" dataKey="Attendance" fill="#0d9488" name="Attendance %" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="GPA" fill="#6366f1" name="Average GPA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default PrincipalDashboard;
