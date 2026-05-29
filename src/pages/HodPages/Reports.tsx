import React, { useState } from "react";
import { Flag, FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const HODReports = () => {
  const [reportType, setReportType] = useState("DEPT_ATTENDANCE");
  const [downloading, setDownloading] = useState(false);

  const reportsList = [
    { id: "DEPT_ATTENDANCE", name: "CSE Student Attendance Roster", desc: "Detailed summary of student attendance grouped by semesters (2, 4, 6, 8) and sections." },
    { id: "GRADE_DISTRIBUTION", name: "Grade & Marks Distribution Statements", desc: "Average marks, final pass percentages, and subject-wise failure charts for the recent internal examinations." },
    { id: "FACULTY_WORKLOAD", name: "Faculty Workload & Timetable Logs", desc: "Teaching hours distribution, course mappings, and subject allocations for CSE department faculty." }
  ];

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast.success("Department report generated and downloaded!");
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 relative z-10 shrink-0">
          <Flag className="w-8 h-8" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Department Reports
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Download CSE Department performance sheets and faculty logs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Report List Select */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h3 className="font-bold text-slate-800 text-sm">Available Statement Types</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reportsList.map((r, idx) => (
              <div 
                key={idx}
                onClick={() => setReportType(r.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  reportType === r.id 
                    ? "border-primary bg-indigo-50/30 shadow-sm" 
                    : "border-slate-100 hover:bg-slate-50 bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    reportType === r.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-tight">{r.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 max-w-lg leading-relaxed">{r.desc}</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  reportType === r.id ? "border-primary bg-primary" : "border-slate-300"
                }`}>
                  {reportType === r.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Summary and Download triggers */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-indigo-500 rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">Specification Log</h3>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Selected report</span>
                <span className="text-xs font-black text-slate-700 uppercase mt-0.5 block">
                  {reportsList.find(r => r.id === reportType)?.name}
                </span>
              </div>

              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Scope</span>
                <span className="text-xs font-bold text-slate-500 mt-0.5 block">Computer Science & Engineering</span>
              </div>

              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Format</span>
                <span className="text-xs font-bold text-slate-500 mt-0.5 block">Excel Worksheet (.xlsx) / PDF</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="w-full mt-6 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Compiling Report...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Compile & Download
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default HODReports;
