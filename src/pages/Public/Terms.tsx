import React from "react";
import { Scale, CheckCircle2, AlertCircle, FileCheck, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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
                Terms of <span className="text-primary">Service</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                Effective Date: May 2026
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner rotate-3">
            <Scale className="w-6 h-6 -rotate-3" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Table of Contents */}
          <div className="hidden lg:block space-y-4 sticky top-32 h-fit">
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">
                Service Terms
              </h3>
              <nav className="space-y-3">
                {[
                  "Acceptable Use",
                  "User Accounts",
                  "Intellectual Property",
                  "Liability Limits",
                  "Termination",
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
                By accessing or using Kanimai College ERP, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our services.
              </p>
            </section>

            <section id="acceptable-use" className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  Acceptable Use
                </h2>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  The ERP system is intended for legitimate educational and administrative purposes only. Users must not:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Attempt to gain unauthorized access to other user accounts.</li>
                  <li>Upload malicious software or engage in data scraping.</li>
                  <li>Use the platform for any illegal activities or harassment.</li>
                  <li>Tamper with academic or financial records without authorization.</li>
                </ul>
              </div>
            </section>

            <section id="user-accounts" className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  User Accounts
                </h2>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  You are responsible for maintaining the confidentiality of your login credentials. Any activity performed under your account is your responsibility. You must notify the IT department immediately of any security breaches.
                </p>
              </div>
            </section>

            <section id="liability-limits" className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  Liability Limits
                </h2>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  Kanimai College ERP is provided "as is" without any warranties. While we strive for 100% uptime and data accuracy, we are not liable for any service interruptions or data discrepancies caused by external factors or misuse.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
