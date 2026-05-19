import React, { useEffect, useState } from "react";
import { GraduationCap, Calendar, Wallet, Bus } from "lucide-react";
import { studentApi } from "@/services/api";

const StudentDashboard = () => {
  const userName = sessionStorage.getItem("UserName") || "Student";
  const studentId = sessionStorage.getItem("userID") || "1";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-900/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-indigo-200 font-medium mt-2 max-w-lg leading-relaxed">
              Here's a quick overview of your academic progress, attendance, and upcoming events for this semester.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Attendance", value: "85%", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Overall Grade", value: "A", icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Fee Due", value: "₹0", icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Transport", value: "Active", icon: Bus, color: "text-blue-600", bg: "bg-blue-50" },
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
           <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Marks</h2>
           <div className="text-sm text-slate-500 flex items-center justify-center h-40">No recent marks available.</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
           <h2 className="text-lg font-bold text-slate-800 mb-4">Announcements</h2>
           <div className="text-sm text-slate-500 flex items-center justify-center h-40">No new announcements.</div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
