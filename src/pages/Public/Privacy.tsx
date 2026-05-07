import React from "react";
import { Shield, Lock, Eye, FileText, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
                Privacy <span className="text-primary">Policy</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                Last Updated: May 2026
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner rotate-3">
            <Shield className="w-6 h-6 -rotate-3" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Table of Contents */}
          <div className="hidden lg:block space-y-4 sticky top-32 h-fit">
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">
                On This Page
              </h3>
              <nav className="space-y-3">
                {[
                  "Data Collection",
                  "How We Use Data",
                  "Information Security",
                  "Third-Party Sharing",
                  "Your Rights",
                ].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                    className="block text-xs font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-wider"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-12">
            <section id="introduction" className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                At Kanimai College ERP, we take your privacy seriously. This policy describes how we collect, use, and protect your personal and institutional information across our platform.
              </p>
            </section>

            <section id="data-collection" className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Eye className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  Data Collection
                </h2>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  We collect information that you provide directly to us when using the ERP system, including:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Student biographical data (Name, DOB, Address, Contacts)</li>
                  <li>Academic records and attendance history</li>
                  <li>Faculty information and performance metrics</li>
                  <li>Financial transaction data and fee records</li>
                </ul>
              </div>
            </section>

            <section id="how-we-use-data" className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  How We Use Data
                </h2>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  The information we collect is used primarily to facilitate college administration and enhance the educational experience:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-black text-[10px] uppercase tracking-widest text-primary mb-2">Administration</p>
                    <p className="text-xs">Managing enrollment, attendance, and faculty assignments efficiently.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-black text-[10px] uppercase tracking-widest text-primary mb-2">Communication</p>
                    <p className="text-xs">Automated notifications for fee dues, events, and academic updates.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="information-security" className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  Information Security
                </h2>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  We implement industry-standard security measures to protect your data, including end-to-end encryption for sensitive fields, secure socket layer (SSL) technology, and regular security audits of our server infrastructure.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
