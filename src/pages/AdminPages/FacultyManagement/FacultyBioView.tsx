import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Building2,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Loader2,
  Briefcase,
  GraduationCap,
  Heart,
  Globe,
  Info,
} from "lucide-react";
import { facultyApi } from "@/services/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FacultyBioView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState<any>(null);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await facultyApi.getFacultyById(id);
      setFaculty(response.data);
    } catch (error) {
      console.error("Error fetching faculty details:", error);
      toast.error("Failed to load faculty details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
            {faculty?.facultyImage ? (
              <img
                src={faculty.facultyImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-slate-300" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {faculty?.facultyName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
              <span className="flex items-center gap-2 text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full">
                {faculty?.employeeId || "Staff"}
              </span>
              <span className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full">
                <Building2 className="w-3.5 h-3.5" /> {faculty?.department}
              </span>
              <span className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full">
                <Building2 className="w-3.5 h-3.5" /> {faculty?.course}
              </span>
              <span className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                <Briefcase className="w-3.5 h-3.5" /> {faculty?.designation}
              </span>

              {/* <span className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">
                {faculty?.status || "Active"}
              </span> */}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => navigate("/admin/faculty/bio")}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-800 hover:shadow-lg transition-all flex items-center justify-center group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate(`/admin/faculty/bio/edit/${faculty.id}`)}
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
            <User className="w-4 h-4" /> Personal Details
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" /> Experience History
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="details"
          className="space-y-6 animate-in slide-in-from-bottom-4 duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Details */}
              <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Info className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                      Faculty Information
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: "Faculty Name", value: faculty?.facultyName },
                    { label: "Employee ID", value: faculty?.employeeId || "-" },
                    { label: "Department", value: faculty?.department || "-" },
                    {
                      label: "Designation",
                      value: faculty?.designation || "-",
                    },
                    // {
                    //   label: "Staff Category",
                    //   value: faculty?.staffCategoryName || "-",
                    // },
                    { label: "Date of Joining", value: faculty?.doj || "-" },
                    {
                      label: "Qualification",
                      value: faculty?.qualification || "-",
                    },
                    {
                      label: "Special Areas",
                      value: faculty?.specialAreas || "-",
                    },
                    { label: "Gender", value: faculty?.gender || "-" },
                    { label: "DOB", value: faculty?.dob || "-" },
                    {
                      label: "Marital Status",
                      value: faculty?.maritalStatus || "-",
                    },
                    { label: "Blood Group", value: faculty?.bloodGroup || "-" },
                    { label: "Religion", value: faculty?.religion || "-" },
                    { label: "Community", value: faculty?.community || "-" },
                    { label: "Caste", value: faculty?.caste || "-" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5 group">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500">
                      <Heart className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                      Contact & Emergency
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      {[
                        {
                          label: "Email ID",
                          value: faculty?.emailid,
                          icon: <Mail className="w-3.5 h-3.5" />,
                        },
                        {
                          label: "Employee Mail",
                          value: faculty?.employeeMail,
                          icon: <Mail className="w-3.5 h-3.5" />,
                        },
                        {
                          label: "Phone Number",
                          value: faculty?.phonenumber,
                          icon: <Phone className="w-3.5 h-3.5" />,
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {item.label}
                          </span>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            {item.icon} {item.value || "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-6">
                      {[
                        {
                          label: "Emergency Name",
                          value: faculty?.emergencyName,
                        },
                        {
                          label: "Emergency Phone",
                          value: faculty?.emergencyNumber,
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
                  <div className="pt-8 border-t border-slate-50">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Permanent Address
                      </span>
                      <span className="text-sm font-bold text-slate-700 leading-relaxed">
                        {faculty?.address1} {faculty?.address2},<br />
                        {faculty?.district}, {faculty?.state},{" "}
                        {faculty?.country} - {faculty?.pincode}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Profile Card Overlay */}
              <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-white/20 backdrop-blur-md border-4 border-white/30 p-1">
                    {faculty?.facultyImage ? (
                      <img
                        src={faculty.facultyImage}
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
                      {faculty?.facultyName}
                    </h3>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">
                      {faculty?.employeeId || "FACULTY"}
                    </p>
                  </div>
                  <div className="w-full pt-4">
                    <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase">
                        Service
                      </span>
                      <span className="text-[10px] font-black">
                        {faculty?.experience || 0} Y{" "}
                        {faculty?.experienceMon || 0} M
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="experience"
          className="animate-in slide-in-from-bottom-4 duration-500"
        >
          <div className="grid grid-cols-1 gap-6">
            {faculty?.facultyExp && faculty.facultyExp.length > 0 ? (
              faculty.facultyExp.map((exp: any, index: number) => (
                <Card
                  key={index}
                  className="rounded-[2rem] p-8 border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <Building2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-800">
                          {exp.instituteName}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                          {exp.designation}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="bg-slate-50 px-3 py-1 rounded-lg flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-600 uppercase">
                              {exp.startDate} - {exp.endDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary/5 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[120px]">
                      <span className="text-2xl font-black text-primary">
                        {exp.yearsOfExp}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Years of Service
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                <Briefcase className="w-12 h-12 text-slate-200" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  No professional history found
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyBioView;
