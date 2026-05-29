import React, { useState } from "react";
import { ClipboardCheck, ShieldAlert, Users, BellRing, Settings } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { toast } from "sonner";

const AdvancedAttendanceDashboard = () => {
  const [notiRule, setNotiRule] = useState(true);

  const stats = [
    { label: "Daily Present", value: "4,480", color: "bg-emerald-500", trend: "92.4% rate" },
    { label: "Daily Absent", value: "370", color: "bg-rose-500", trend: "7.6% rate" },
    { label: "Late Entry Entries", value: "65", color: "bg-amber-500", trend: "Check-in > 08:35 AM" },
    { label: "Half-Day Leaves", value: "15", color: "bg-blue-500", trend: "Approved casual" }
  ];

  const heatmapDays = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    rate: Math.floor(88 + Math.random() * 10)
  }));

  const triggerAlertTest = () => {
    toast.success("Test notification broadcasted to all parents of absent students!");
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Advanced Attendance Monitoring
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Heatmaps, Telemetry & Automated Rule Triggers
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{stat.label}</span>
              <p className="text-2xl font-black text-slate-800 mt-2">{stat.value}</p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
              <span className="text-[10px] font-bold text-slate-400">{stat.trend}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Attendance Heatmap */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">Attendance Heatmap (Past 30 Days)</h3>
            </div>
            <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">PERCENT PRESENT</span>
          </div>
          
          <div className="grid grid-cols-7 sm:grid-cols-10 gap-3">
            {heatmapDays.map((d) => (
              <div 
                key={d.day}
                className={`aspect-square rounded-xl border flex flex-col items-center justify-center text-center p-2 transition-all hover:scale-105 cursor-pointer ${
                  d.rate >= 95 
                    ? "bg-emerald-500 text-white border-emerald-600 shadow-sm" 
                    : d.rate >= 92 
                      ? "bg-emerald-400 text-white border-emerald-500" 
                      : d.rate >= 90
                        ? "bg-emerald-300 text-emerald-900 border-emerald-400"
                        : "bg-amber-100 text-amber-900 border-amber-200"
                }`}
                title={`Day ${d.day}: ${d.rate}% present`}
              >
                <span className="text-[9px] font-black opacity-60">D{d.day}</span>
                <span className="text-xs font-black mt-0.5">{d.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Automated Alert Rules */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-rose-500 rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">Automated Alerts Rules</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellRing className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase leading-none">Parent Notify</h4>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1">SMS if absent in Hr 1</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase leading-none">Low Attendance Alert</h4>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1">Warning if under 75%</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notiRule} 
                    onChange={() => setNotiRule(!notiRule)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          <button 
            onClick={triggerAlertTest}
            className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-slate-950/10 active:scale-95"
          >
            Trigger Test Alerts
          </button>
        </div>

      </div>

    </div>
  );
};

export default AdvancedAttendanceDashboard;
