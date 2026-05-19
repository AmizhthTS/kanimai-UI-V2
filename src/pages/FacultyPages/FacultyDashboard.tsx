import React from "react";
import { Users, BookOpen, Calendar, Clock } from "lucide-react";

const FacultyDashboard = () => {
  const userName = sessionStorage.getItem("UserName") || "Faculty";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Here's what's happening with your classes today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Assigned Subjects", value: "4", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Classes Today", value: "3", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Students", value: "120", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Pending Attendance", value: "1", icon: Calendar, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-800">{stat.value}</span>
            </div>
            <p className="text-sm font-bold text-slate-500 mt-4">{stat.label}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
           <h2 className="text-lg font-bold text-slate-800 mb-4">Today's Schedule</h2>
           <div className="text-sm text-slate-500 flex items-center justify-center h-40">No classes scheduled for the next hours.</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
           <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Announcements</h2>
           <div className="text-sm text-slate-500 flex items-center justify-center h-40">No new announcements.</div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
