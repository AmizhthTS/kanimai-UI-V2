import React, { useState } from "react";
import { UserCheck, UserX, Clock, Calendar, Check, Search, Filter } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const FacultyAttendance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");

  const widgets = [
    { label: "Total Faculty", value: "340", color: "bg-indigo-500", text: "text-indigo-600" },
    { label: "Present Count", value: "312", color: "bg-emerald-500", text: "text-emerald-600" },
    { label: "Absent Count", value: "14", color: "bg-rose-500", text: "text-rose-600" },
    { label: "Late Entries", value: "8", color: "bg-amber-500", text: "text-amber-600" },
    { label: "On-Duty (OD)", value: "6", color: "bg-blue-500", text: "text-blue-600" }
  ];

  const deptAttendanceData = [
    { name: "CSE", Present: 58, Absent: 2, OD: 1 },
    { name: "ECE", Present: 48, Absent: 3, OD: 0 },
    { name: "EEE", Present: 36, Absent: 1, OD: 2 },
    { name: "MECH", Present: 42, Absent: 4, OD: 1 },
    { name: "BIOTECH", Present: 30, Absent: 1, OD: 0 },
    { name: "CIVIL", Present: 25, Absent: 2, OD: 1 }
  ];

  const facultyRoster = [
    { id: "101", name: "Prof. Rajesh Kumar", dept: "CSE", status: "PRESENT", checkIn: "08:25 AM", role: "Professor" },
    { id: "102", name: "Dr. Ananya Rao", dept: "CSE", status: "PRESENT", checkIn: "08:30 AM", role: "Associate Prof." },
    { id: "103", name: "Dr. K. Srinivas", dept: "ECE", status: "LATE", checkIn: "08:50 AM", role: "Assistant Prof." },
    { id: "104", name: "Prof. Maria Joseph", dept: "BIOTECH", status: "ON-DUTY", checkIn: "-", role: "HOD Biotech" },
    { id: "105", name: "Dr. Ramesh Nair", dept: "MECH", status: "ABSENT", checkIn: "-", role: "Professor" },
    { id: "106", name: "Dr. Priya Sen", dept: "EEE", status: "PRESENT", checkIn: "08:15 AM", role: "Assistant Prof." },
    { id: "107", name: "Prof. S. Gautham", dept: "CIVIL", status: "PRESENT", checkIn: "08:28 AM", role: "Professor" }
  ];

  const filteredFaculty = facultyRoster.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.id.includes(searchQuery);
    const matchesDept = selectedDept === "ALL" || f.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Faculty Attendance Monitoring
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Roster & Daily Punctuality Log
            </p>
          </div>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {widgets.map((widget, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
              {widget.label}
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-slate-800">
                {widget.value}
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${widget.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Roster & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department-wise Faculty Statistics */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-500 rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">Department-wise Faculty Statistics</h3>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "bold" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="OD" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Punctuality Graph */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-amber-500 rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">Daily Punctuality Analytics</h3>
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded">AVERAGE</span>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase">On-time Arrivals</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Faculty check-ins before 08:30 AM</p>
              </div>
              <span className="text-xl font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">94.8%</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase">Late Entry Entries</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Faculty check-ins after 08:30 AM</p>
              </div>
              <span className="text-xl font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl">2.4%</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase">Average Absenteeism</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Casual/Medical leave percentage</p>
              </div>
              <span className="text-xl font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-xl">2.8%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-800 text-sm">Roster & Attendance List</h3>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Faculty..."
                className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none w-full sm:w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-600 rounded-xl px-3 py-2 border-none outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="ALL">DEPARTMENTS (ALL)</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="BIOTECH">BIOTECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Employee ID</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Faculty Name</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Designation</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Check-In</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFaculty.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-black text-slate-400">#{f.id}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-700">{f.name}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{f.role}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black">{f.dept}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{f.checkIn}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      f.status === "PRESENT" 
                        ? "bg-emerald-50 text-emerald-600" 
                        : f.status === "ABSENT" 
                          ? "bg-rose-50 text-rose-600" 
                          : f.status === "LATE" 
                            ? "bg-amber-50 text-amber-600" 
                            : "bg-blue-50 text-blue-600"
                    }`}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default FacultyAttendance;
