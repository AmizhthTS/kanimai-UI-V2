import React, { useState } from "react";
import { Bell, Send, Mail, MessageSquare, PhoneCall, Loader2 } from "lucide-react";
import { toast } from "sonner";

const NotificationCenter = () => {
  const [channel, setChannel] = useState("SMS");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState([
    { id: "1", channel: "SMS", date: "May 27, 2026", msg: "Fee reminder for Semester 4 students: Last date is June 1st.", status: "DELIVERED" },
    { id: "2", channel: "Email", date: "May 25, 2026", msg: "Invitation to NAAC Accreditation Staff Seminar.", status: "DELIVERED" },
    { id: "3", channel: "WhatsApp", date: "May 20, 2026", msg: "Urgent: College closed today due to local administrative holiday.", status: "FAILED" }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setLogs(prev => [
        { id: Date.now().toString(), channel, date: "Today", msg: message, status: "DELIVERED" },
        ...prev
      ]);
      setMessage("");
      toast.success(`${channel} message broadcasted successfully!`);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Notification Center
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Broadcast circulars via SMS, Email, Push alerts, and WhatsApp
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compose Form */}
        <form onSubmit={handleSend} className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h3 className="font-bold text-slate-800 text-sm">Compose & Channel Selection</h3>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { id: "SMS", icon: MessageSquare, label: "SMS" },
              { id: "Email", icon: Mail, label: "Email" },
              { id: "Push", icon: Bell, label: "Push Alert" },
              { id: "WhatsApp", icon: MessageSquare, label: "WhatsApp" }
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  onClick={() => setChannel(c.id)}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    channel === c.id 
                      ? "border-primary bg-indigo-50/20 text-primary font-black" 
                      : "border-slate-100 hover:bg-slate-50 bg-white text-slate-500 font-bold"
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-[10px] uppercase tracking-widest block">{c.label}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Broadcast Message</label>
            <textarea
              rows={4}
              placeholder="Type your alert contents here..."
              className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={sending}
            className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending Broadcast...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Broadcast Notification
              </>
            )}
          </button>
        </form>

        {/* Logs */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-amber-500 rounded-full" />
            <h3 className="font-bold text-slate-800 text-sm">Transmission Logs</h3>
          </div>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div key={log.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded uppercase">
                    {log.channel}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">{log.date}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{log.msg}</p>
                <div className="pt-2 border-t border-slate-200/50 flex justify-end">
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                    log.status === "DELIVERED" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
