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
import { masterApi, studentApi } from "@/services/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MonthPicker from "@/components/Inputs/MonthPicker";
import { format } from "date-fns";
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
  const [dayHours, setDayHours] = useState<any[]>([]);
  const [monthYear, setMonthYear] = useState(format(new Date(), "MM-yyyy")); // YYYY-MM

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [bioRes, docRes, payRes, hoursRes, imageRes] = await Promise.all([
        studentApi.getStudentById(id),
        studentApi.getStudentDocuments(id),
        studentApi.getStudentPayments(id),
        masterApi.getDayHourList({}),
        studentApi.getStudentImage(id),
      ]);
      setDayHours(hoursRes.data.responseModelList || []);
      setStudent(bioRes.data);
      setDocuments(docRes.data || []);
      setPayments(payRes.data || []);

      if (imageRes.data.image !== null) {
        setStudent({
          ...bioRes.data,
          studentImage: imageRes.data.image.startsWith("ZGF0Y")
            ? atob(imageRes.data.image)
            : imageRes.data.image,
        });
      }

      // Fetch attendance for current month
      fetchAttendance();
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    if (!id) return;
    try {
      const [month, year] = monthYear.split("-");
      const res = await studentApi.getStudentAttendance(id, month, year);
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
      fetchAttendance();
    }
  }, [monthYear]);

  const handleDownload = async (docId: string) => {
    try {
      const response = await studentApi.downloadDocument(docId);

      console.log("API RESPONSE => ", response);

      // axios response
      const data = response?.data;

      if (!data) {
        toast.error("No response data");
        return;
      }

      let fileData = data.filedata;

      if (!fileData) {
        toast.error("No file data found");
        return;
      }

      try {
        if (fileData.startsWith("ZGF0Y")) {
          fileData = atob(fileData);
        }
      } catch (e) {
        console.log("Decode Error", e);
      }

      const downloadLink = document.createElement("a");

      downloadLink.href = fileData.startsWith("data:")
        ? fileData
        : `data:application/pdf;base64,${fileData}`;

      downloadLink.download = data.filename || "document";

      document.body.appendChild(downloadLink);

      downloadLink.click();

      document.body.removeChild(downloadLink);
    } catch (error) {
      console.log("DOWNLOAD ERROR => ", error);
      toast.error("Failed to download document");
    }
  };

  const getAttendanceValue = (dateStr: any, hourId: number) => {
    const formattedTarget = formatArrayDate(dateStr);
    const dayData = attendance.find(
      (d) => formatArrayDate(d.dateString) === formattedTarget,
    );
    if (!dayData) return null;
    const hourData = dayData.studentAttendanceViewDayOrderMapDTOs?.find(
      (h: any) => h.dayHourId === hourId,
    );
    return hourData ? hourData.attendanceValue : null;
  };

  const renderAttendanceIcon = (value: any) => {
    if (value === 1)
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />;
    if (value === -1) return <X className="w-4 h-4 text-rose-500 mx-auto" />;
    return <span className="text-slate-200 mx-auto">-</span>;
  };

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Profile Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group shrink-0">
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
          <div className="text-center sm:text-left space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {student?.studentName}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                <Building2 className="w-3 h-3" /> {student?.courseName}
              </span>
              <span className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <Calendar className="w-3 h-3" /> {student?.batch}
              </span>
              <span className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                Sem {student?.semesterId}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full md:w-auto">
          <button
            onClick={() => navigate(`/admin/student/bio/edit/${student.id}`)}
            className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/admin/student/bio")}
            className="w-full md:w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-800 hover:shadow-lg transition-all flex items-center justify-center group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="md:hidden ml-2 font-black text-xs uppercase tracking-widest text-slate-600">
              Back to List
            </span>
          </button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <TabsList className="bg-white/50 backdrop-blur-md p-0.5 sm:p-1.5 rounded-lg sm:rounded-[1.5rem] gap-1 sm:gap-2 inline-flex h-auto border border-slate-100 shadow-sm whitespace-nowrap min-w-full sm:min-w-0">
            <TabsTrigger
              value="details"
              className="rounded-md sm:rounded-xl px-3 sm:px-8 py-2 sm:py-3 text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all flex items-center gap-1.5 sm:gap-2"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" /> Basic Details
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="rounded-md sm:rounded-xl px-3 sm:px-8 py-2 sm:py-3 text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all flex items-center gap-1.5 sm:gap-2"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" /> Documents
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="rounded-md sm:rounded-xl px-3 sm:px-8 py-2 sm:py-3 text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all flex items-center gap-1.5 sm:gap-2"
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" /> Attendance
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="rounded-md sm:rounded-xl px-3 sm:px-8 py-2 sm:py-3 text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all flex items-center gap-1.5 sm:gap-2"
            >
              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" /> Payment
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Basic Details Content */}
        <TabsContent
          value="details"
          className="space-y-6 animate-in slide-in-from-bottom-4 duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 sm:px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Info className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800">
                      Personal Information
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
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
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 sm:px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                      <Users className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800">
                      Family Information
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 space-y-10">
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
              <Card className="hidden md:block rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-gradient-to-br from-primary to-indigo-700 p-8 text-white relative">
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
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800">
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
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 sm:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800">
                    Verification Vault
                  </CardTitle>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {documents.length} ARTIFACTS
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="hidden md:block overflow-x-auto">
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
                        File Upload
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
                              onClick={() => handleDownload(doc.id)}
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
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-slate-50 p-4">
                {documents.map((doc, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-800">
                          {doc.docname}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">
                          {doc.filename}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(doc.id)}
                        className="p-3 bg-slate-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all active:scale-90 shadow-sm border border-slate-100"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Content */}
        <TabsContent
          value="attendance"
          className="animate-in slide-in-from-bottom-4 duration-500 space-y-6"
        >
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 sm:px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800">
                    Attendance Information
                  </CardTitle>
                </div>
                <div className="flex items-center gap-4 bg-white/50 p-2 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 hidden sm:block">
                    SELECT MONTH
                  </span>
                  <MonthPicker value={monthYear} onChange={setMonthYear} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/30 border-b border-slate-100">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 z-10">
                        Date
                      </th>
                      {dayHours.map((hour) => (
                        <th
                          key={hour.id}
                          className="px-4 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[80px]"
                        >
                          {hour.hourName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {attendance.length > 0 ? (
                      attendance.map((att, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-50/50 transition-all group"
                        >
                          <td className="px-8 py-5 text-[11px] sm:text-sm font-black text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-50">
                            {formatArrayDate(att.dateString)}
                          </td>
                          {dayHours.map((hour) => (
                            <td key={hour.id} className="px-4 py-5 text-center">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:bg-white mx-auto">
                                {renderAttendanceIcon(
                                  getAttendanceValue(att.dateString, hour.id),
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={dayHours.length + 1}
                          className="px-8 py-20 text-center"
                        >
                          <span className="text-xs font-black text-slate-300 uppercase tracking-widest italic">
                            No attendance records for this month
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-slate-50 p-4">
                {attendance.length > 0 ? (
                  attendance.map((att, index) => (
                    <div key={index} className="py-5 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                          {formatArrayDate(att.dateString)}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {dayHours.map((hour) => (
                          <div
                            key={hour.id}
                            className="flex flex-col items-center gap-1.5 p-2 bg-slate-50/50 rounded-xl border border-slate-100"
                          >
                            <span className="text-[8px] font-black text-slate-400 uppercase">
                              {hour.hourName}
                            </span>
                            {renderAttendanceIcon(
                              getAttendanceValue(att.dateString, hour.id),
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest italic">
                      No attendance records
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Content */}
        <TabsContent
          value="payment"
          className="animate-in slide-in-from-bottom-4 duration-500"
        >
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 sm:px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <CreditCard className="w-4 h-4" />
                </div>
                <CardTitle className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800">
                  Financial Ledger
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="hidden md:block overflow-x-auto">
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
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-slate-50 p-4">
                {payments.map((pay, index) => (
                  <div key={index} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-800">
                          {pay.feeName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          #{pay.recieptNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">
                          ₹{pay.amount?.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                          {formatArrayDate(pay.paidDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                        {pay.paymentMode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentBioView;
