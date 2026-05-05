import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Calendar,
  CreditCard,
  Building2,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Download,
  Loader2,
  CheckCircle2,
  X,
  Info,
  Users,
} from "lucide-react";
import { studentApi } from "@/services/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const StudentBioView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [monthYear, setMonthYear] = useState(
    new Date().toISOString().slice(0, 7),
  ); // YYYY-MM

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [bioRes, docRes, payRes] = await Promise.all([
        studentApi.getStudentById(id),
        studentApi.getStudentDocuments(id),
        studentApi.getStudentPayments(id),
      ]);
      setStudent(bioRes.data);
      setDocuments(docRes.data || []);
      setPayments(payRes.data || []);

      // Fetch attendance for current month
      fetchAttendance(monthYear);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (my: string) => {
    if (!id) return;
    try {
      const res = await studentApi.getStudentAttendance(
        id,
        my.split("-")[1],
        my.split("-")[0],
      );
      setAttendance(res.data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (monthYear) {
      fetchAttendance(monthYear);
    }
  }, [monthYear]);

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const response = await studentApi.downloadDocument(docId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "document.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Failed to download document");
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
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-[2rem] bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group">
            {student?.studentImage ? (
              <img
                src={student.studentImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-slate-300" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {student?.studentName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
              <span className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full">
                <Building2 className="w-3.5 h-3.5" /> {student?.courseName}
              </span>
              <span className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                <Calendar className="w-3.5 h-3.5" /> {student?.batch} Batch
              </span>
              <span className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                Section {student?.sectionName || "A"}
              </span>
              <span className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">
                Semester {student?.semesterId}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => navigate("/admin/student/bio")}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-800 hover:shadow-lg transition-all flex items-center justify-center group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate(`/admin/student/bio/edit/${student.id}`)}
            className="px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-[1.5rem] gap-2 inline-flex h-auto border border-slate-100 shadow-sm">
          <TabsTrigger
            value="details"
            className="rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all flex items-center gap-2"
          >
            <User className="w-4 h-4" /> Basic Details
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Documents
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Attendance
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" /> Payment
          </TabsTrigger>
        </TabsList>

        {/* Basic Details Content */}
        <TabsContent
          value="details"
          className="space-y-6 animate-in slide-in-from-bottom-4 duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Info className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                      Personal Information
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: "Student Name", value: student?.studentName },
                    {
                      label: "Phone Number",
                      value: student?.mobNumber || "-",
                      icon: <Phone className="w-3.5 h-3.5" />,
                    },
                    {
                      label: "Whatsapp Number",
                      value: student?.whatsappNumber || "-",
                    },
                    { label: "Gender", value: student?.gender || "-" },
                    {
                      label: "Email ID",
                      value: student?.emailId || "-",
                      icon: <Mail className="w-3.5 h-3.5" />,
                    },
                    { label: "DOB", value: student?.dob || "-" },
                    { label: "Blood Group", value: student?.bloodGroup || "-" },
                    { label: "Religion", value: student?.religion || "-" },
                    { label: "Caste", value: student?.caste || "-" },
                    { label: "Community", value: student?.community || "-" },
                    {
                      label: "Aadhar Number",
                      value: student?.aadharNumber || "-",
                    },
                    {
                      label: "Transport",
                      value: student?.transport
                        ? `Yes (Bus ${student.busNo})`
                        : "No",
                    },
                    {
                      label: "Institution Name",
                      value: student?.institutionName || "-",
                    },
                    {
                      label: "Previous Degree",
                      value: student?.previousDegree || "-",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5 group">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.icon && (
                          <span className="text-slate-300 group-hover:text-primary transition-colors">
                            {item.icon}
                          </span>
                        )}
                        <span className="text-sm font-bold text-slate-700">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Family Info */}
              <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                      <Users className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                      Family Information
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      {[
                        { label: "Father's Name", value: student?.fatherName },
                        {
                          label: "Father's Occupation",
                          value: student?.fatherOccupation,
                        },
                        {
                          label: "Father's Phone",
                          value: student?.fatherMobNumber,
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {item.label}
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {item.value || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-6">
                      {[
                        { label: "Mother's Name", value: student?.motherName },
                        {
                          label: "Mother's Occupation",
                          value: student?.motherOccupation,
                        },
                        {
                          label: "Mother's Phone",
                          value: student?.motherMobNumber,
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {item.label}
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {item.value || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Residency Address
                      </span>
                      <span className="text-sm font-bold text-slate-700 leading-relaxed">
                        {student?.address1} {student?.address2},<br />
                        {student?.district}, {student?.state} -{" "}
                        {student?.pincode}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-gradient-to-br from-primary to-indigo-700 p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-white/20 backdrop-blur-md border-4 border-white/30 p-1">
                    {student?.studentImage ? (
                      <img
                        src={student.studentImage}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-[2.25rem]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">
                      {student?.studentName}
                    </h3>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">
                      {student?.rollNo || "Registration Pending"}
                    </p>
                  </div>
                  <div className="w-full pt-4 space-y-3">
                    <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase">
                        Status
                      </span>
                      <span className="bg-emerald-500 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bank Information */}
              <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                      Bank Details
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {[
                    { label: "Bank Name", value: student?.bankName },
                    { label: "Account Number", value: student?.accNumber },
                    { label: "IFSC Code", value: student?.ifscCode },
                    { label: "Account Holder", value: student?.accHolderName },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {item.value || "-"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Documents Content */}
        <TabsContent
          value="documents"
          className="animate-in slide-in-from-bottom-4 duration-500"
        >
          <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Verification Vault
                  </CardTitle>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {documents.length} ARTIFACTS TOTAL
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                      S.No
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Document Name
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      File Identity
                    </th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {documents.length > 0 ? (
                    documents.map((doc, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-all group"
                      >
                        <td className="px-8 py-5 text-sm font-black text-slate-300">
                          {(index + 1).toString().padStart(2, "0")}
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-black text-slate-800">
                            {doc.docname}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-bold text-slate-500">
                            {doc.filename}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => handleDownload(doc.id, doc.filename)}
                            className="px-4 py-2 bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 ml-auto"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-20">
                          <FileText className="w-16 h-16" />
                          <span className="text-sm font-black uppercase tracking-widest">
                            No Documents Available
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Content */}
        <TabsContent
          value="attendance"
          className="animate-in slide-in-from-bottom-4 duration-500 space-y-6"
        >
          <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Attendance Information
                  </CardTitle>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    SELECT MONTH
                  </span>
                  <input
                    type="month"
                    value={monthYear}
                    onChange={(e) => setMonthYear(e.target.value)}
                    className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      1 Hour
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      2 Hour
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      3 Hour
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      4 Hour
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      5 Hour
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attendance.length > 0 ? (
                    attendance.map((att, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-all group"
                      >
                        <td className="px-8 py-5 text-sm font-black text-slate-800">
                          {formatArrayDate(att.dateString)}
                        </td>
                        {[
                          att.hour1,
                          att.hour2,
                          att.hour3,
                          att.hour4,
                          att.hour5,
                        ].map((hour, idx) => (
                          <td key={idx} className="px-8 py-5 text-center">
                            <span
                              className={`text-xs font-black ${hour === "P" ? "text-emerald-500" : hour === "A" ? "text-rose-500" : "text-slate-300"}`}
                            >
                              {hour || "-"}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <span className="text-sm font-black text-slate-300 uppercase tracking-widest italic">
                          No attendance records for this month
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Content */}
        <TabsContent
          value="payment"
          className="animate-in slide-in-from-bottom-4 duration-500"
        >
          <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <CreditCard className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                  Financial Ledger
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Fee Description
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Amount
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Mode
                    </th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Receipt No
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.length > 0 ? (
                    payments.map((pay, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-all group"
                      >
                        <td className="px-8 py-5">
                          <span className="text-sm font-black text-slate-800">
                            {pay.feeName}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="text-sm font-black text-primary">
                            ₹{pay.amount?.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center text-sm font-bold text-slate-600">
                          {formatArrayDate(pay.paidDate)}
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                            {pay.paymentMode}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right text-sm font-black text-slate-400 group-hover:text-slate-800 transition-colors">
                          #{pay.recieptNumber}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <span className="text-sm font-black text-slate-300 uppercase tracking-widest italic">
                          No payment history found
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentBioView;
