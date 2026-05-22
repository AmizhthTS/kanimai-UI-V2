import React, { useState, useEffect } from "react";
import {
  Wallet,
  CreditCard,
  Loader2,
  Download,
  AlertCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { parentApi } from "@/services/api";
import { useParentStudent } from "@/contexts/ParentStudentContext";

const ParentFees = () => {
  const [loading, setLoading] = useState(true);
  const [feesData, setFeesData] = useState<any>(null);

  const { activeStudent } = useParentStudent();
  const studentId = activeStudent?.id || "1";
  const studentName = activeStudent?.name || "Student";

  const fetchFees = async () => {
    setLoading(true);
    try {
      // const response = await parentApi.getFees(studentId);
      // if (response && response.data) {
      //   setFeesData(response.data);
      // } else {
      // Mock fallback based on studentId
      if (studentId === "2") {
        setFeesData({
          totalDue: 0,
          pendingFees: [],
          paymentHistory: [
            {
              transactionId: "TXN111222",
              feeType: "Tuition Fee - Semester 1",
              amountPaid: 20000,
              paymentDate: "2025-10-15",
              status: "Success",
              paymentMode: "Net Banking",
            },
          ],
        });
      } else if (studentId === "3") {
        setFeesData({
          totalDue: 8500,
          pendingFees: [
            {
              feeId: 301,
              feeType: "Tuition Fee - Semester 5",
              amount: 8500,
              dueDate: "2026-06-01",
            },
          ],
          paymentHistory: [
            {
              transactionId: "TXN333444",
              feeType: "Tuition Fee - Semester 4",
              amountPaid: 22000,
              paymentDate: "2025-11-20",
              status: "Success",
              paymentMode: "UPI",
            },
          ],
        });
      } else {
        // Arjun (CSE) Default
        setFeesData({
          totalDue: 15000,
          pendingFees: [
            {
              feeId: 101,
              feeType: "Tuition Fee - Semester 4",
              amount: 10000,
              dueDate: "2026-06-01",
            },
            {
              feeId: 102,
              feeType: "Transport Fee",
              amount: 5000,
              dueDate: "2026-06-01",
            },
          ],
          paymentHistory: [
            {
              transactionId: "TXN987654",
              feeType: "Tuition Fee - Semester 3",
              amountPaid: 25000,
              paymentDate: "2025-12-10",
              status: "Success",
              paymentMode: "Net Banking",
            },
            {
              transactionId: "TXN123456",
              feeType: "Hostel Fee",
              amountPaid: 10000,
              paymentDate: "2025-12-12",
              status: "Success",
              paymentMode: "UPI",
            },
          ],
        });
      }
      // }
    } catch (error) {
      console.error("Error fetching fees:", error);
      // Mock fallback
      setFeesData({
        totalDue: 15000,
        pendingFees: [
          {
            feeId: 101,
            feeType: "Tuition Fee - Semester 4",
            amount: 10000,
            dueDate: "2026-06-01",
          },
        ],
        paymentHistory: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [studentId]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-blue-500 tracking-tight">
              Fee & Payments
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Financial Overview for {studentName}
            </p>
          </div>
        </div>

        <div className="bg-blue-500 text-white px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/20 relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
            Total Outstanding Due
          </p>
          <h2 className="text-3xl font-black mt-1">
            ₹{feesData?.totalDue?.toLocaleString() || 0}
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Loading Fee Data...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pending Dues Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
              <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">
                  Pending Dues
                </h3>
              </div>

              <div className="p-6 flex-1">
                {feesData?.pendingFees?.length > 0 ? (
                  <div className="space-y-4">
                    {feesData.pendingFees.map((fee: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-rose-200 hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-black text-slate-800 text-sm leading-tight">
                              {fee.feeType}
                            </h4>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1 block">
                              Due: {fee.dueDate}
                            </span>
                          </div>
                          <span className="text-lg font-black text-rose-600">
                            ₹{fee.amount.toLocaleString()}
                          </span>
                        </div>
                        <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 opacity-60">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    <p className="text-sm font-black text-slate-600">
                      All Clear!
                    </p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-center">
                      No pending dues at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment History Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-full">
              <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">
                  Payment History
                </h3>
              </div>

              <div className="p-0">
                {feesData?.paymentHistory?.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {feesData.paymentHistory.map(
                      (history: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-800 text-sm">
                                {history.feeType}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  TXN: {history.transactionId}
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  {history.paymentDate}
                                </span>
                              </div>
                              <span className="inline-block mt-2 px-2 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">
                                {history.paymentMode}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto">
                            <span className="text-lg font-black text-emerald-600">
                              ₹{history.amountPaid.toLocaleString()}
                            </span>
                            <button className="mt-0 sm:mt-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm active:scale-95">
                              <Download className="w-3.5 h-3.5" />
                              Receipt
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                    <FileText className="w-12 h-12 opacity-20" />
                    <p className="text-sm font-black text-slate-600">
                      No History
                    </p>
                    <p className="text-[10px] uppercase tracking-widest font-bold">
                      No past payments recorded yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentFees;
