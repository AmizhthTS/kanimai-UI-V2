import React, { useState } from "react";
import { Users, GraduationCap, AlertTriangle, Search, ChevronRight } from "lucide-react";

const StudentMonitoring = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const studentStats = [
    { label: "Institution Attendance %", value: "93.4%", desc: "Average daily present", color: "text-emerald-500 bg-emerald-50" },
    { label: "Top-Performing Students", value: "85", desc: "GPA above 9.0 (Outstanding)", color: "text-indigo-500 bg-indigo-50" },
    { label: "Attendance Alerts", value: "32", desc: "Students under 75% threshold", color: "text-rose-500 bg-rose-50" }
  ];

  const topStudents = [
    { rank: "01", name: "Priya Sharma", rollNo: "2026BIO042", dept: "BIOTECH", gpa: "9.1", attendance: "94.2%" },
    { rank: "02", name: "Rahul Deshmukh", rollNo: "2026CSE108", dept: "CSE", gpa: "8.9", attendance: "96.5%" },
    { rank: "03", name: "Sandra Philip", rollNo: "2026ECE024", dept: "ECE", gpa: "8.8", attendance: "95.0%" }
  ];

  const lowAttendanceAlerts = [
    { id: "3717", name: "Karthik Raja", rollNo: "2026CSE085", dept: "CSE", percent: "68%", status: "PARENT NOTIFIED" },
    { id: "3718", name: "Vikram Sen", rollNo: "2026MECH102", dept: "MECH", percent: "72%", status: "WARNING ISSUED" },
    { id: "3719", name: "Deepa Nair", rollNo: "2026CIVIL054", dept: "CIVIL", percent: "64%", status: "PARENT NOTIFIED" },
    { id: "3720", name: "Abhishek Roy", rollNo: "2026ECE202", dept: "ECE", percent: "70%", status: "COUNSELING REQ" }
  ];

  const filteredAlerts = lowAttendanceAlerts.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.rollNo.includes(searchQuery)
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
            Student Monitoring & Alerts
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Overall Student Performance & Attendance Metrics
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {studentStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <p className="text-2xl font-black text-slate-800 mt-2">{stat.value}</p>
              <span className="text-[10px] font-bold text-slate-400 mt-1 block">{stat.desc}</span>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} font-black text-sm shrink-0`}>
              {i === 0 ? "📈" : i === 1 ? "🏆" : "🚨"}
            </div>
          </div>
        ))}
      </div>

      {/* Ranks & Low Attendance Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Performing Students List */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-indigo-500 rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">Top-Performing Students</h3>
            </div>
            <div className="space-y-4">
              {topStudents.map((student, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-indigo-500 font-mono">#{student.rank}</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 leading-tight">{student.name}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{student.rollNo} • {student.dept}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">CGPA {student.gpa}</span>
                    <span className="block text-[8px] text-slate-400 font-bold mt-1 uppercase">Att: {student.attendance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 border border-slate-100">
            View Excellence Registry <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Low Attendance Alerts List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-rose-500 rounded-full" />
                <h3 className="font-bold text-slate-800 text-sm">Attendance Alert Trigger (Under 75%)</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search alert..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border-none rounded-xl text-[10px] font-bold focus:ring-2 focus:ring-primary/20 outline-none w-36"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="pb-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Roll No</th>
                    <th className="pb-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Dept</th>
                    <th className="pb-3 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendance</th>
                    <th className="pb-3 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAlerts.map((a, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 text-xs font-black text-slate-700">{a.name}</td>
                      <td className="py-3 text-xs font-bold text-slate-500">{a.rollNo}</td>
                      <td className="py-3 text-xs font-bold text-slate-500">{a.dept}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[9px] font-black">{a.percent}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-[8px] font-black px-2 py-0.5 rounded-full border border-slate-200 bg-white text-slate-600 uppercase">
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentMonitoring;
