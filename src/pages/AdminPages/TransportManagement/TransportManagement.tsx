import React, { useState } from "react";
import { Bus, Search, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

const TransportManagement = () => {
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState([
    { id: "1", number: "TN-37-BX-1234", route: "Route 5 - Downtown", driver: "Suresh Kumar", status: "Active", capacity: "50 Seater" },
    { id: "2", number: "TN-37-BY-5678", route: "Route 2 - Westside", driver: "Manoj Singh", status: "Active", capacity: "40 Seater" },
    { id: "3", number: "TN-37-BZ-9012", route: "Route 10 - Uptown", driver: "Karthik Raj", status: "Maintenance", capacity: "50 Seater" }
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm("Confirm delete vehicle?")) {
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success("Vehicle deleted successfully");
    }
  };

  const filtered = vehicles.filter(v => 
    v.number.toLowerCase().includes(search.toLowerCase()) || v.driver.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Transport Management
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Vehicle fleet, Route tracking & Driver Roster
            </p>
          </div>
        </div>
        <button 
          onClick={() => toast.success("Add Vehicle form opened (simulation)")}
          className="bg-primary text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" /> ADD NEW VEHICLE
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Active Transport Fleet</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search fleet..."
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
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Vehicle No</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Route</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Driver</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Capacity</th>
                <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((v, i) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">0{i+1}</td>
                  <td className="px-6 py-4 text-xs font-black text-slate-800">{v.number}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{v.route}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">{v.driver}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{v.capacity}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      v.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(v.id)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg">
                        <Trash2 className="w-4 h-4" />
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

export default TransportManagement;
