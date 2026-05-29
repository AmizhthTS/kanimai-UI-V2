import React, { useState } from "react";
import { Building, Search, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

const HostelManagement = () => {
  const [search, setSearch] = useState("");
  const [allocations, setAllocations] = useState([
    { id: "1", student: "Arjun Sharma", rollNo: "2026CSE001", block: "A-Block (Men's)", room: "Room 102", bed: "Bed-A", status: "Occupied" },
    { id: "2", student: "Karthik Raja", rollNo: "2026CSE085", block: "A-Block (Men's)", room: "Room 102", bed: "Bed-B", status: "Occupied" },
    { id: "3", student: "Priya Sharma", rollNo: "2026BIO042", block: "C-Block (Women's)", room: "Room 305", bed: "Bed-A", status: "Occupied" }
  ]);

  const handleAllocate = () => {
    toast.success("Room allocated successfully!");
  };

  const filtered = allocations.filter(a => 
    a.student.toLowerCase().includes(search.toLowerCase()) || a.rollNo.includes(search)
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Hostel Management
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Manage room allocations, hostellers attendance & visitor check-ins
            </p>
          </div>
        </div>
        <button 
          onClick={handleAllocate}
          className="bg-primary text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" /> ALLOCATE ROOM
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Room Allocation Status</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hosteller..."
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
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Hosteller</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Roll No</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Block</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Room / Bed No</th>
                <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Allocation</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((a, idx) => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">0{idx+1}</td>
                  <td className="px-6 py-4 text-xs font-black text-slate-800">{a.student}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{a.rollNo}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">{a.block}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">{a.room} / {a.bed}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black">
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
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

export default HostelManagement;
