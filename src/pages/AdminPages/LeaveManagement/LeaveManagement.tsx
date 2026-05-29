import React, { useState } from "react";
import { Calendar, Search, Check, X, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

const LeaveManagement = () => {
  const [search, setSearch] = useState("");
  const [leaves, setLeaves] = useState([
    { id: "1", applicant: "Prof. Rajesh Kumar (Faculty)", type: "Casual Leave", dates: "May 30 - May 31", reason: "Family Marriage Ceremony", status: "PENDING" },
    { id: "2", applicant: "Dr. Ananya Rao (Faculty)", type: "Duty Leave (OD)", dates: "June 2 - June 4", reason: "IEEE Research Presentation", status: "PENDING" },
    { id: "3", applicant: "Arjun Sharma (Student)", type: "Medical Leave", dates: "May 25 - May 28", reason: "Recovering from Viral Fever", status: "APPROVED" }
  ]);

  const handleAction = (id: string, action: "APPROVED" | "REJECTED") => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
    if (action === "APPROVED") {
      toast.success("Leave request approved");
    } else {
      toast.error("Leave request rejected");
    }
  };

  const filtered = leaves.filter(l => 
    l.applicant.toLowerCase().includes(search.toLowerCase()) || l.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Leave Management
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Review and approve faculty and student leave applications
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Applications Roster</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leaves..."
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
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Applicant</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Leave Type</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Dates</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
                <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-black text-slate-700">{l.applicant}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      l.type.includes("Casual") ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                    }`}>
                      {l.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{l.dates}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500 max-w-xs truncate">{l.reason}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      l.status === "APPROVED" 
                        ? "bg-emerald-50 text-emerald-600" 
                        : l.status === "PENDING"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-rose-50 text-rose-600"
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {l.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleAction(l.id, "APPROVED")} className="p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleAction(l.id, "REJECTED")} className="p-1.5 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 italic">No Action Required</span>
                    )}
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

export default LeaveManagement;
