import React from "react";
import { Headphones, Mail, MessageSquare, Globe, ChevronLeft, Send, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                Help & <span className="text-primary">Support</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                We're here to assist you 24/7
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner rotate-3">
            <Headphones className="w-6 h-6 -rotate-3" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contact Cards */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Email Support</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">For general inquiries and technical issues, reach our team via email.</p>
            <a href="mailto:support@kanimai.edu" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
              support@kanimai.edu
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Knowledge Base</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Browse our detailed documentation and user guides for the ERP system.</p>
            <button className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
              View Documentation
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Institutional Portal</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Access campus resources and administrative portals directly.</p>
            <button className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
              Go to Portal
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Support Form */}
        <div className="mt-12 bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Send us a Message</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Have a specific question or feedback? Fill out the form below and our support coordinators will get back to you within 24 hours.</p>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Your Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">How can we help?</label>
                <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none transition-all h-32 resize-none" placeholder="Describe your issue or question..."></textarea>
              </div>
              <button className="px-10 py-4 bg-primary text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3 active:scale-95">
                Dispatch Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
