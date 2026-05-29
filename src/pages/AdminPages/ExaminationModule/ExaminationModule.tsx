import React, { useState } from "react";
import { GraduationCap, Search, Plus, Calendar, Download } from "lucide-react";
import { toast } from "sonner";

const ExaminationModule = () => {
  const [search, setSearch] = useState("");
  const [exams, setExams] = useState([
    { id: "1", subject: "Machine Learning (CSE-401)", date: "June 8, 2026", session: "Forenoon (FN)", halls: "Hall 1, Hall 2, Hall 5" },
    { id: "2", subject: "Compiler Design (CSE-402)", date: "June 10, 2026", session: "Forenoon (FN)", halls: "Hall 1, Hall 3" },
    { id: "3", subject: "Computer Networks (CSE-403)", date: "June 12, 2026", session: "Afternoon (AN)", halls: "Hall 2, Hall 4" }
  ]);

  const handlePublish = () => {
    toast.success("Semester exam results published successfully!");
  };

  const filtered = exams.filter(e => 
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Examination Module
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Schedule exams, generate hall tickets, publish results & rank lists
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePublish}
            className="bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center gap-2 active:scale-95"
          >
            PUBLISH RESULTS
          </button>
          <button 
            onClick={() => toast.success("Hall tickets generated for all registered students!")}
            className="bg-primary text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center gap-2 active:scale-95"
          >
            GENERATE HALL TICKETS
          </button>
        </div>
      </div>

      {/* Roster / Schedule */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Exam Timetable & Seating</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search exam..."
              className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">S.No</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Subject Name</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Exam Date</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Session</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Allotted Halls</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((e, idx) => (
                <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">0{idx+1}</td>
                  <td className="px-6 py-4 text-xs font-black text-slate-800">{e.subject}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{e.date}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">{e.session}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{e.halls}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => toast.success("Roster downloaded")} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                      <Download className="w-4 h-4" />
                    </button>
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

export default ExaminationModule;
