import React from "react";
import { Users, UserCheck, ClipboardCheck, BookOpen, Calendar, Bell, ChevronRight, Check, X } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { format } from "date-fns";

const HODDashboard = () => {
  const hodName = sessionStorage.getItem("UserName") || "Dr. Sarah";

  const stats = [
    { label: "Department Students", value: "1,200", icon: Users, color: "bg-indigo-500", detail: "CSE Department" },
    { label: "Department Faculty", value: "58", icon: UserCheck, color: "bg-blue-500", detail: "Active: 54 present" },
    { label: "Class Sections", value: "24", icon: BookOpen, color: "bg-teal-500", detail: "Semesters 2, 4, 6, 8" },
    { label: "Pending Approvals", value: "8", icon: ClipboardCheck, color: "bg-rose-500", detail: "Leaves & Corrections" }
  ];

  const studentPerformance = [
    { name: "Sem 2", Attendance: 94.5, PassRate: 88 },
    { name: "Sem 4", Attendance: 92.1, PassRate: 85 },
    { name: "Sem 6", Attendance: 93.8, PassRate: 91 },
    { name: "Sem 8", Attendance: 95.0, PassRate: 96 }
  ];

  const approvalsQueue = [
    { name: "Prof. Rajesh Kumar", type: "Casual Leave", date: "May 30, 2026", details: "Attending family function" },
    { name: "Dr. Ananya Rao", type: "On-Duty Approval", date: "June 2, 2026", details: "Presenting paper at IEEE" },
    { name: "Karthik Raja (Student)", type: "Attendance Correction", date: "May 26, 2026", details: "Was marked absent during OD" }
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            HOD Dashboard
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            Welcome, <span className="text-primary">{hodName}</span> • Head of CSE Dept
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

      {/* Charts & Approvals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Student Attendance & Pass Rates Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-500 rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">Department Semester Analytics</h3>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">CSE OVERVIEW</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "bold" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                <Bar dataKey="Attendance" fill="#0d9488" name="Attendance %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PassRate" fill="#4f46e5" name="Pass Rate %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Approvals Queue */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-rose-500 rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">Quick Approval Queue</h3>
            </div>
            <div className="space-y-4">
              {approvalsQueue.map((req, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-slate-400 uppercase">{req.type}</span>
                    <span className="text-[9px] font-bold text-slate-400">{req.date}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">{req.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{req.details}</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-200/50">
                    <button className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" /> Approve
                    </button>
                    <button className="flex-1 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1">
                      <X className="w-3 h-3" /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-4 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-1">
            View All Approvals <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default HODDashboard;
