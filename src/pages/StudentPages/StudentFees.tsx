import React from "react";
import { Wallet } from "lucide-react";

const StudentFees = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Fee Details</h1>
            <p className="text-sm font-medium text-slate-500">View pending dues and payment history</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
           <p className="text-slate-400 font-bold">Fee details will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentFees;
