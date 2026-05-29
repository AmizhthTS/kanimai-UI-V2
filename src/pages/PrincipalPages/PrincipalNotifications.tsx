import React, { useState } from "react";
import { Bell, ShieldAlert, Users, Volume2, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PrincipalNotifications = () => {
  const [notiType, setNotiType] = useState("EMERGENCY");
  const [content, setContent] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [sentList, setSentList] = useState([
    { type: "CIRCULAR", date: "May 27, 2026", text: "Staff meeting scheduled for June 2nd, 2026.", target: "Staff" },
    { type: "ANNOUNCEMENT", date: "May 25, 2026", text: "NAAC Mock accreditation scheduled next Wednesday.", target: "Staff & Students" },
    { type: "EMERGENCY", date: "May 20, 2026", text: "Due to heavy rains, college remains closed today.", target: "All" }
  ]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Please enter notification message.");
      return;
    }
    setBroadcasting(true);
    setTimeout(() => {
      setBroadcasting(false);
      setSentList((prev) => [
        { type: notiType, date: "Today", text: content, target: notiType === "PARENT" ? "Parents" : notiType === "STAFF" ? "Staff" : "All" },
        ...prev
      ]);
      setContent("");
      toast.success("Notification broadcasted successfully!");
    }, 1500);
  };

  const types = [
    { id: "EMERGENCY", label: "Emergency Alert", icon: ShieldAlert, color: "text-rose-500 bg-rose-50 border-rose-200" },
    { id: "STAFF", label: "Staff Announcement", icon: Volume2, color: "text-blue-500 bg-blue-50 border-blue-200" },
    { id: "CIRCULAR", label: "Circular Release", icon: Bell, color: "text-indigo-500 bg-indigo-50 border-indigo-200" },
    { id: "PARENT", label: "Parent Notification", icon: Users, color: "text-teal-500 bg-teal-50 border-teal-200" }
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 relative z-10 shrink-0">
          <Bell className="w-8 h-8 animate-swing" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Principal Notifications
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Compose and broadcast emergency alerts, circulars, and announcements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Compose Notification Form */}
        <form onSubmit={handleBroadcast} className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h3 className="font-bold text-slate-800 text-sm">Compose & Select Channels</h3>
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-2 gap-4">
            {types.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div 
                  key={idx}
                  onClick={() => setNotiType(t.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    notiType === t.id 
                      ? "border-primary bg-indigo-50/20 shadow-sm" 
                      : "border-slate-100 hover:bg-slate-50 bg-white"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    notiType === t.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-slate-700 leading-tight">{t.label}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Notification Message</label>
            <textarea
              rows={5}
              placeholder="Type your message to broadcast..."
              className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={broadcasting}
            className="w-full py-4 bg-primary hover:bg-primary/95 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {broadcasting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Broadcasting Message...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Broadcast Notification
              </>
            )}
          </button>
        </form>

        {/* Previous Notifications Logs */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-rose-500 rounded-full" />
            <h3 className="font-bold text-slate-800 text-sm">Previous broadcasts</h3>
          </div>
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {sentList.map((log, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${
                    log.type === "EMERGENCY" 
                      ? "bg-rose-50 text-rose-600 border border-rose-100" 
                      : log.type === "CIRCULAR" 
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-100" 
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">{log.date}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{log.text}</p>
                <div className="pt-2 border-t border-slate-200/50 flex justify-between items-center">
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Target: {log.target}</span>
                  <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">SENT</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes swing {
          0%, 100% { transform: rotate(0); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-15deg); }
          60% { transform: rotate(10deg); }
          80% { transform: rotate(-10deg); }
        }
        .animate-swing {
          animation: swing 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PrincipalNotifications;
