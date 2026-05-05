import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Download,
  Eye,
  Trash2,
  Edit2,
  Wallet,
  Plus,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { studentApi } from "@/services/api";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const formatArrayDate = (dateArray: any) => {
  if (Array.isArray(dateArray)) {
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
  }
  if (typeof dateArray === "string") {
    return dateArray.split("T")[0];
  }
  return "-";
};

const StudentPaymentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [feeDues, setFeeDues] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({
    id: "", // Fee Due ID
    recieptNumber: "",
    amount: "",
    paymentMode: "",
    remarks: "",
    discountPercent: 0,
    discountValue: 0,
    discountType: 0,
  });

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [studentRes, duesRes, payRes] = await Promise.all([
        studentApi.getStudentPaymentInfo(id),
        studentApi.getStudentFeeDue(id),
        studentApi.getStudentPaymentHistory(id),
      ]);
      setStudent(studentRes.data);
      setFeeDues(duesRes.data || []);
      setPayments(payRes.data || []);
    } catch (error) {
      toast.error("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handlePayClick = (fee: any) => {
    setSelectedFee(fee);
    setPaymentForm({
      id: fee.id,
      recieptNumber: "",
      amount: fee.dueAmount?.toString() || "",
      paymentMode: "",
      remarks: "",
      discountPercent: 0,
      discountValue: 0,
      discountType: 0,
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentForm.paymentMode || !paymentForm.amount) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      await studentApi.saveStudentFee({
        ...paymentForm,
        studentId: id,
      });
      toast.success("Payment processed successfully");
      setShowPaymentModal(false);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Failed to process payment");
    }
  };

  const handleDeleteFee = async (feeId: string) => {
    if (!window.confirm("Are you sure you want to delete this fee entry?"))
      return;
    try {
      await studentApi.deleteFeeDue(feeId);
      toast.success("Fee entry deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete fee entry");
    }
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      const res = await studentApi.downloadPaymentReceipt(paymentId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Receipt_${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Failed to download receipt");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header Profile Section */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg">
              <CreditCard className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {student?.studentName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  {student?.courseName} | {student?.batch} Batch | Section{" "}
                  {student?.sectionName} | Semester {student?.semesterId}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/student/payment")}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-800 hover:shadow-lg transition-all flex items-center justify-center group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-4 border-t border-slate-50">
          <div className="flex flex-col gap-1 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Date of Joining
            </span>
            <span className="text-sm font-black text-slate-700">
              {formatArrayDate(student?.doj)}
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-rose-50/50 rounded-2xl p-4 border border-rose-100">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
              Due Amount
            </span>
            <span className="text-sm font-black text-rose-600">
              ₹{student?.dueAmount?.toLocaleString() || "0.00"}
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-amber-50/50 rounded-2xl p-4 border border-amber-100 relative group">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
              Wallet Amount <Wallet className="w-3 h-3" />
            </span>
            <span className="text-sm font-black text-amber-700">
              ₹{student?.walletAmount?.toLocaleString() || "0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={["fee-details", "payment-details"]}
        className="space-y-6"
      >
        {/* Fee Details */}
        <AccordionItem value="fee-details" className="border-none">
          <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-800">
                  Fee Details
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50 border-y border-slate-100">
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Fee Name
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Total Amount
                      </th>
                      <th className="px-6 py-4 text-centert text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Concession Amount
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Paid
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Due
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Partial Due
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Due Date
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Last Paid Date
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {feeDues.length > 0 ? (
                      feeDues.map((fee, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/30 transition-all group"
                        >
                          <td className="px-6 py-4 text-[11px] font-bold text-slate-500">
                            {formatArrayDate(fee.createdTime)}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-slate-800">
                            {fee.feeName}
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                            ₹{fee.totalAmount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                            ₹{fee.concessionAmount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-bold text-emerald-500">
                            ₹{fee.paidAmount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-black text-rose-500">
                            ₹{fee.dueAmount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${fee.partialDue ? "bg-amber-50 text-amber-500" : "bg-slate-100 text-slate-400"}`}
                            >
                              {fee.partialDue ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-[11px] font-bold text-slate-500">
                            {formatArrayDate(fee.dueDate)}
                          </td>
                          <td className="px-6 py-4 text-center text-[11px] font-bold text-slate-500">
                            {formatArrayDate(fee.lastPaidDate)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handlePayClick(fee)}
                                className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg transition-all"
                                title="Add Payment"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFee(fee.id)}
                                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                                title="Delete Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-10 text-center text-slate-400 italic"
                        >
                          No fee records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Payment Details */}
        <AccordionItem value="payment-details" className="border-none">
          <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-800">
                  Payment Details
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50 border-y border-slate-100">
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Fee Name
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Mode
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Receipt Number
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Download
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {payments.length > 0 ? (
                      payments.map((pay, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/30 transition-all group"
                        >
                          <td className="px-6 py-4 text-sm font-black text-slate-800">
                            {pay.feeName}
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-black text-primary">
                            ₹{pay.amount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-[11px] font-bold text-slate-500">
                            {formatArrayDate(pay.paidDate)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                              {pay.paymentMode}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-[11px] font-black text-slate-400">
                            #{pay.recieptNumber}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDownloadReceipt(pay.id)}
                              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-xl transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-10 text-center text-slate-400 italic"
                        >
                          No payment history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

      {/* Payment Entry Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <DialogHeader className="px-8 py-6 bg-primary border-b border-white/10 flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-xl font-black text-white tracking-tight uppercase">
              Amount Entry
            </DialogTitle>
          </DialogHeader>

          <div className="p-10 space-y-8 bg-indigo-50/30">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Payment Mode <span className="text-rose-500">*</span>
                </label>
                <Select
                  onValueChange={(val) =>
                    setPaymentForm({ ...paymentForm, paymentMode: val })
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-white">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100">
                    <SelectItem
                      value="Cash"
                      className="rounded-xl font-bold py-3"
                    >
                      Cash
                    </SelectItem>
                    <SelectItem
                      value="Online"
                      className="rounded-xl font-bold py-3"
                    >
                      Online
                    </SelectItem>
                    <SelectItem
                      value="Wallet"
                      className="rounded-xl font-bold py-3"
                    >
                      Wallet
                    </SelectItem>
                    <SelectItem
                      value="Cheque"
                      className="rounded-xl font-bold py-3"
                    >
                      Cheque
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Receipt Number
                </label>
                <Input
                  value={paymentForm.recieptNumber}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      recieptNumber: e.target.value,
                    })
                  }
                  placeholder="Enter Receipt Number"
                  className="h-12 rounded-2xl border-slate-100 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Amount (Rs.) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                  className="h-12 rounded-2xl border-slate-100 bg-white font-black text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Discount (%)
                  </label>
                  <Input
                    type="number"
                    value={paymentForm.discountPercent}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        discountPercent: Number(e.target.value),
                      })
                    }
                    className="h-12 rounded-2xl border-slate-100 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Discount (Rs.)
                  </label>
                  <Input
                    type="number"
                    value={paymentForm.discountValue}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        discountValue: Number(e.target.value),
                      })
                    }
                    className="h-12 rounded-2xl border-slate-100 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Remarks
                </label>
                <Input
                  value={paymentForm.remarks}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, remarks: e.target.value })
                  }
                  placeholder="Enter Remarks"
                  className="h-12 rounded-2xl border-slate-100 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => setShowPaymentModal(false)}
                variant="outline"
                className="flex-1 h-14 border-slate-200 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl bg-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                className="flex-1 h-14 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-500/20"
              >
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPaymentView;
