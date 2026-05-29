import React, { useState } from "react";
import { Users, Search, GraduationCap } from "lucide-react";

const StudentManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const studentList = [
    { rollNo: "2026CSE001", name: "Arjun Sharma", semester: "Semester 4", attendance: "85.5%", gpa: "8.4", assignments: "10/10 Completed" },
    { rollNo: "2026CSE042", name: "Kiran Patil", semester: "Semester 4", attendance: "74.0%", gpa: "7.2", assignments: "8/10 Completed" },
    { rollNo: "2026CSE085", name: "Karthik Raja", semester: "Semester 6", attendance: "68.2%", gpa: "6.9", assignments: "7/10 Completed" },
    { rollNo: "2026CSE108", name: "Rahul Deshmukh", semester: "Semester 6", attendance: "96.5%", gpa: "8.9", assignments: "10/10 Completed" },
    { rollNo: "2026CSE120", name: "Aparna Sen", semester: "Semester 8", attendance: "91.2%", gpa: "8.5", assignments: "9/10 Completed" }
  ];

  const filteredStudents = studentList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 relative z-10 shrink-0">
          <Users className="w-8 h-8" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Student Management
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Monitor Department Student Performance, Marks & Absences
          </p>
        </div>
      </div>

      {/* Roster & Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-800 text-sm">CSE Student Academic Roster</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student..."
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
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Roll Number</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Semester</th>
                <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendance %</th>
                <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Average GPA</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Assignments Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-black text-slate-400">{s.rollNo}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-700">{s.name}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{s.semester}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      Number(s.attendance.replace("%", "")) >= 75 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>
                      {s.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-black text-slate-700">{s.gpa}</td>
                  <td className="px-6 py-4 text-right text-xs font-bold text-slate-500">{s.assignments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StudentManagement;
