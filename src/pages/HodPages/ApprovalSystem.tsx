import React, { useState } from "react";
import { ClipboardCheck, Check, X, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

const ApprovalSystem = () => {
  const [approvals, setApprovals] = useState([
    { id: "1", name: "Prof. Rajesh Kumar", type: "Casual Leave", date: "May 30, 2026", desc: "Attending a family marriage function.", status: "PENDING" },
    { id: "2", name: "Dr. Ananya Rao", type: "On-Duty Approval", date: "June 2, 2026", desc: "Attending and presenting research paper at IEEE conference.", status: "PENDING" },
    { id: "3", name: "Karthik Raja (Student)", type: "Attendance Correction", date: "May 26, 2026", desc: "Marked absent in Hour 3, was representing college in sports meet.", status: "PENDING" },
    { id: "4", name: "Prof. Maria Joseph", type: "Duty Leave (OD)", date: "June 4, 2026", desc: "External examiner assignment at Anna University.", status: "PENDING" }
  ]);

  const handleAction = (id: string, action: "APPROVED" | "REJECTED") => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
    if (action === "APPROVED") {
      toast.success("Request approved successfully!");
    } else {
      toast.error("Request rejected.");
    }
  };

  const pendingCount = approvals.filter((a) => a.status === "PENDING").length;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              HOD Approval System
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Approve leave requests, duty leaves, and student attendance corrections
            </p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-2xl hidden md:flex items-center gap-2 shrink-0">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-black text-rose-700 uppercase">{pendingCount} Action Required</span>
        </div>
      </div>

      {/* Roster list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approvals.map((app) => (
          <div 
            key={app.id} 
            className={`p-6 bg-white rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
              app.status === "PENDING" 
                ? "border-slate-100 shadow-sm" 
                : app.status === "APPROVED"
                  ? "border-emerald-200 bg-emerald-50/10 opacity-80"
                  : "border-rose-200 bg-rose-50/10 opacity-60"
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded ${
                  app.type.includes("Leave") ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                }`}>
                  {app.type}
                </span>
                <span className="text-[9px] font-bold text-slate-400">{app.date}</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800">{app.name}</h4>
                <p className="text-[11px] text-slate-400 font-bold mt-1 leading-relaxed">{app.desc}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <div>
                {app.status === "PENDING" ? (
                  <span className="text-[8px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded uppercase">AWAITING DECISION</span>
                ) : (
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                    app.status === "APPROVED" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  }`}>
                    {app.status}
                  </span>
                )}
              </div>
              
              {app.status === "PENDING" && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction(app.id, "APPROVED")}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all shadow-sm shadow-emerald-200"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button 
                    onClick={() => handleAction(app.id, "REJECTED")}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all shadow-sm shadow-rose-200"
                  >
                    <X className="w-3.5 h-3.5" /> Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ApprovalSystem;
