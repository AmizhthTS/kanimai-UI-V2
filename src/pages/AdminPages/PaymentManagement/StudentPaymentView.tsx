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
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import { Input } from "@/components/ui/input";

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

  // Wallet Modal
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [walletAmountInput, setWalletAmountInput] = useState("");
  const [walletList, setWalletList] = useState<any[]>([]);

  // Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  const {
    control: paymentControl,
    handleSubmit: handlePaymentFormSubmit,
    reset: resetPaymentForm,
    formState: { errors: paymentErrors },
    watch: paymentWatch,
    setValue: setPaymentValue,
  } = useForm({
    defaultValues: {
      id: "",
      transId: "",
      recieptNumber: "",
      amount: "",
      paymentMode: null as any,
      remarks: "",
      discountPercent: 0,
      discountValue: 0,
      discountType: 0,
      file: null as any,
      fileName: "",
    },
  });
  let paymentMode = paymentWatch("paymentMode");
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
    resetPaymentForm({
      id: fee.id,
      transId: "",
      recieptNumber: "",
      amount: fee.dueAmount?.toString() || "",
      paymentMode: null,
      remarks: "",
      discountPercent: 0,
      discountValue: 0,
      discountType: 0,
      file: "",
      fileName: "",
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (data: any) => {
    const amount = Number(data.amount) || 0;
    const dueAmount = Number(selectedFee?.dueAmount) || 0;
    const isPartialDue = selectedFee?.partialDue === true;
    const pModeName =
      data.paymentMode?.name || data.paymentMode?.id || data.paymentMode || "";

    if (isPartialDue && dueAmount < amount) {
      toast.error("In this amount is greater than Total Amount");
      return;
    } else if (!isPartialDue) {
      if (dueAmount !== amount && dueAmount > amount) {
        toast.error("In this Amount not a Partial Due Applicable");
        return;
      } else if (
        dueAmount < amount ||
        (pModeName === "Wallet" && (student?.wallet || 0) < amount)
      ) {
        toast.error("In this amount is greater than Total Amount");
        return;
      }
    }

    if (
      isPartialDue &&
      pModeName === "Wallet" &&
      (student?.wallet || 0) < amount
    ) {
      toast.error("In this amount is greater than Wallet Balance");
      return;
    }

    let discountType = 0;
    let discountPercent = Number(data.discountPercent) || 0;
    let discountValue = Number(data.discountValue) || 0;

    if (discountPercent !== 0) {
      discountType = 1;
      if (discountValue === 0) {
        discountValue = Number(
          (dueAmount * (discountPercent / 100)).toFixed(2),
        );
      }
    } else if (discountValue !== 0) {
      discountType = 2;
      discountPercent = 0;
    } else {
      discountType = 0;
      discountPercent = 0;
      discountValue = 0;
    }

    try {
      const formData = new FormData();
      formData.append("studentId", id || "");
      formData.append("feeName", selectedFee?.feeName || "");
      formData.append("amount", amount.toString());
      formData.append("discountPercent", discountPercent.toString());
      formData.append("discountValue", discountValue.toString());
      formData.append("discountType", discountType.toString());
      formData.append("recieptNumber", data.recieptNumber || "");

      formData.append("paymentMode", pModeName);
      formData.append("transId", data.transId || "");

      if (data.remarks && data.remarks !== "") {
        formData.append("remarks", data.remarks);
      }
      formData.append("feeId", selectedFee?.feeId || "");
      formData.append("feeDueId", selectedFee?.id || ""); // id refers to feeDueId in the list

      if (data.file) {
        formData.append("file", data.file);
        formData.append("fileName", data.file.name || data.fileName || "");
      }

      await studentApi.saveStudentFee(formData);
      toast.success("Payment Updated successfully !!");
      setShowPaymentModal(false);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Payment Update Failed");
    }
  };
  const handleGetWalletList = async () => {
    try {
      const response = await studentApi.getStudentWalletList(id);
      setWalletList(response.data);
    } catch (error) {
      toast.error("Failed to fetch wallet list");
    }
  };

  const handleAddWallet = async () => {
    if (
      !walletAmountInput ||
      isNaN(Number(walletAmountInput)) ||
      Number(walletAmountInput) <= 0
    ) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await studentApi.updateWallet({
        studentid: id,
        balance: Number(walletAmountInput),
      });
      toast.success("Wallet amount added successfully");
      setWalletAmountInput("");
      setIsAddingWallet(false);
      fetchData(); // Refresh to get the new wallet amount
    } catch (error) {
      toast.error("Failed to add wallet amount");
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
          <button
            onClick={() => {
              setIsAddingWallet(false);
              setShowWalletModal(true);
              handleGetWalletList();
            }}
            className="flex flex-col gap-1 bg-amber-50/50 hover:bg-amber-100/50 rounded-2xl p-4 border border-amber-100 relative group transition-all text-left hover:shadow-sm"
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                Wallet Amount <Wallet className="w-3 h-3" />
              </span>
              <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-4 h-4" />
              </div>
            </div>
            <span className="text-sm font-black text-amber-700 mt-1">
              ₹{student?.wallet?.toLocaleString() || "0.00"}
            </span>
          </button>
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
        <DialogContent className="sm:max-w-[550px] w-[95vw] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
          <DialogHeader className="px-10 py-8 bg-slate-900 text-white flex flex-row items-center justify-between space-y-0 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight uppercase">
                  Payment <span className="text-primary">Entry</span>
                </DialogTitle>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Update Amount & Discounts
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          <div className="p-8 md:p-10 space-y-8 overflow-y-auto max-h-[calc(100vh-10rem)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div className="md:col-span-2">
                <AutocompleteInput
                  control={paymentControl}
                  errors={paymentErrors}
                  name="paymentMode"
                  textLable="Payment Mode"
                  placeholderName="Select Category"
                  requiredMsg="Required"
                  labelMandatory
                  options={[
                    { id: "Cash", name: "Cash" },
                    { id: "Challan", name: "Challan" },
                    { id: "Cheque", name: "Cheque" },
                    { id: "Net banking", name: "Net banking" },
                    { id: "Wallet", name: "Wallet" },
                  ]}
                  getOptionLabel={(opt: any) => opt.name}
                  getOptionValue={(opt: any) => opt.id}
                  icon={<CreditCard className="w-4 h-4 text-slate-400" />}
                />
              </div>
              {paymentMode?.name !== "Wallet" && (
                <div className="md:col-span-2">
                  <TextInput
                    control={paymentControl}
                    errors={paymentErrors}
                    name="transId"
                    textLable={
                      paymentMode?.name === "Cash"
                        ? "Voucher Number"
                        : `${paymentMode?.name} Number`
                    }
                    placeholderName={
                      paymentMode?.name === "Cash"
                        ? "Enter Voucher Number"
                        : `Enter ${paymentMode?.name} Number`
                    }
                    icon={<FileText className="w-4 h-4 text-slate-400" />}
                    requiredMsg={
                      ["Challan", "Cheque", "Net banking"].includes(
                        paymentMode?.name,
                      )
                        ? "Required"
                        : ""
                    }
                    labelMandatory={[
                      "Challan",
                      "Cheque",
                      "Net banking",
                    ].includes(paymentMode?.name)}
                    inputProps={{
                      disabled: ["Wallet"].includes(paymentMode?.name),
                    }}
                  />
                </div>
              )}
              {paymentMode?.name === "Wallet" && (
                <div className="md:col-span-2">
                  <p className="text-sm font-bold text-slate-800">
                    Current Wallet Balance: ₹{student?.wallet || 0}
                  </p>
                </div>
              )}
              <div className="md:col-span-2">
                <TextInput
                  control={paymentControl}
                  errors={paymentErrors}
                  name="recieptNumber"
                  textLable="Receipt Number"
                  placeholderName="Enter Receipt Number"
                  icon={<FileText className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div className="md:col-span-2">
                <TextInput
                  control={paymentControl}
                  errors={paymentErrors}
                  name="amount"
                  textLable="Amount (Rs.)"
                  placeholderName="0.00"
                  type="number"
                  requiredMsg="Required"
                  labelMandatory
                  icon={<Wallet className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div>
                <TextInput
                  control={paymentControl}
                  errors={paymentErrors}
                  name="discountPercent"
                  textLable="Discount (%)"
                  placeholderName="0"
                  type="number"
                />
              </div>

              <div>
                <TextInput
                  control={paymentControl}
                  errors={paymentErrors}
                  name="discountValue"
                  textLable="Discount (Rs.)"
                  placeholderName="0"
                  type="number"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Attachment
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setPaymentValue("file", e.target.files[0]);
                        setPaymentValue("fileName", e.target.files[0].name);
                      }
                    }}
                    accept=".pdf,.jpeg,.png,.jpg"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <TextInput
                  control={paymentControl}
                  errors={paymentErrors}
                  name="remarks"
                  textLable="Remarks"
                  placeholderName="Enter any remarks"
                  icon={<Edit2 className="w-4 h-4 text-slate-400" />}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 h-12 bg-slate-50 hover:bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentFormSubmit(handlePaymentSubmit)}
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Update
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Wallet Details Modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
          <DialogHeader className="px-8 py-6 bg-slate-900 text-white flex flex-row items-center justify-between space-y-0 border-b border-white/5">
            <DialogTitle className="text-xl font-black tracking-tight uppercase">
              Wallet <span className="text-primary">Details</span>
            </DialogTitle>
            <div className="flex items-center gap-3">
              {!isAddingWallet && (
                <button
                  onClick={() => setIsAddingWallet(true)}
                  className="w-8 h-8 bg-primary hover:bg-primary/90 rounded-lg flex items-center justify-center transition-colors shadow-lg"
                  title="Add Wallet"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              )}
              <button
                onClick={() => {
                  setShowWalletModal(false);
                  setIsAddingWallet(false);
                }}
                className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          <div className="p-8 bg-slate-50/50">
            {isAddingWallet ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  Add Wallet
                </h3>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Wallet Amount <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={walletAmountInput}
                    onChange={(e) => setWalletAmountInput(e.target.value)}
                    className="text-sm pr-12 border-primary focus-visible:ring-primary"
                    placeholder="Enter Amount"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleAddWallet}
                    className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Add to Wallet
                  </button>
                  <button
                    onClick={() => setIsAddingWallet(false)}
                    className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        No
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Transaction Type
                      </th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Wallet Amount
                      </th>
                      <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {walletList.length > 0 ? (
                      walletList.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/30 transition-colors"
                        >
                          <td className="px-6 py-5 text-xs font-bold text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-5 text-xs font-black text-slate-700">
                            {item.transtype || "-"}
                          </td>
                          <td className="px-6 py-5 text-sm font-black text-amber-600 text-center">
                            ₹{item.amount?.toLocaleString() || "0"}
                          </td>
                          <td className="px-6 py-5 text-xs font-bold text-slate-500 text-right">
                            {formatArrayDate(item.createdtime) || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-16 text-center">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Wallet className="w-10 h-10 text-slate-200" />
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                              No Data Available
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="p-6 border-t border-slate-100 flex justify-center bg-slate-50">
                  <button
                    onClick={() => setShowWalletModal(false)}
                    className="px-10 h-12 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPaymentView;
