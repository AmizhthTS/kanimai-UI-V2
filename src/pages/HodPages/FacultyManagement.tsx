import React, { useState } from "react";
import { UserCheck, Search, Filter, Briefcase, Award, Clock } from "lucide-react";

const FacultyManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const facultyList = [
    { id: "CSE01", name: "Prof. Rajesh Kumar", designation: "Professor", workload: "16 hrs/week", status: "PRESENT", checkIn: "08:25 AM", courses: "Machine Learning, Deep Learning" },
    { id: "CSE02", name: "Dr. Ananya Rao", designation: "Associate Prof.", workload: "14 hrs/week", status: "PRESENT", checkIn: "08:30 AM", courses: "Data Structures, Algorithms" },
    { id: "CSE03", name: "Dr. K. Srinivas", designation: "Assistant Prof.", workload: "18 hrs/week", status: "LATE", checkIn: "08:50 AM", courses: "Web Technologies, Java" },
    { id: "CSE04", name: "Prof. Maria Joseph", designation: "Assistant Prof.", workload: "16 hrs/week", status: "ON-DUTY", checkIn: "-", courses: "Database Management Systems" },
    { id: "CSE05", name: "Dr. Ramesh Nair", designation: "Professor", workload: "12 hrs/week", status: "ABSENT", checkIn: "-", courses: "Theory of Computation" }
  ];

  const filteredFaculty = facultyList.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.id.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 relative z-10 shrink-0">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Faculty Management
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Monitor Department Staff Attendance, Workloads & Subjects
          </p>
        </div>
      </div>

      {/* Roster & Grid */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-800 text-sm">CSE Department Faculty Roster</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty..."
              className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none w-full sm:w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Faculty Name</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Designation</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Workload</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Courses</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily check-in</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFaculty.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-black text-slate-400">#{f.id}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-700">{f.name}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{f.designation}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{f.workload}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500 max-w-xs truncate">{f.courses}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">{f.checkIn}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase ${
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

export default FacultyManagement;
