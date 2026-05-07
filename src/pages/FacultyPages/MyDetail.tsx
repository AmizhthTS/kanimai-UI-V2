import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Building2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Info,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { facultyApi } from "@/services/api";
import { toast } from "sonner";

const MyDetail = () => {
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState<any>(null);

  // In a real app, the faculty ID would come from the auth context/token
  // For now, we'll try to get it from sessionStorage or a default
  const facultyId = sessionStorage.getItem("userID") || "1";

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await facultyApi.getFacultyById(facultyId);
      setFaculty(response.data);
    } catch (error) {
      console.error("Error fetching faculty details:", error);
      toast.error("Failed to load your profile details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Profile Section - Premium Design */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-40 -mt-40 blur-3xl" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 w-full">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden">
              {faculty?.facultyImage ? (
                <img
                  src={faculty.facultyImage}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <User className="w-16 h-16 text-slate-300" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
              <BadgeCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {faculty?.facultyName}
              </h1>
              <span className="inline-flex items-center px-4 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100/50">
                {faculty?.employeeId}
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3">
              <span className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                <Building2 className="w-4 h-4 text-primary" />{" "}
                {faculty?.department}
              </span>
              <span className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                <Briefcase className="w-4 h-4 text-primary" />{" "}
                {faculty?.designation}
              </span>
              <span className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                <Calendar className="w-4 h-4 text-primary" /> Joined{" "}
                {faculty?.doj}
              </span>
            </div>

            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
              {faculty?.specialAreas
                ?.split(",")
                .map((area: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                  >
                    {area.trim()}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Details Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="bg-slate-50/50 border-b border-slate-100 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
                  Personal Information
                </h2>
              </div>
            </div>

            <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
              {[
                {
                  label: "Faculty Name",
                  value: faculty?.facultyName,
                  icon: User,
                },
                {
                  label: "Qualification",
                  value: faculty?.qualification,
                  icon: GraduationCap,
                },
                { label: "Date of Birth", value: faculty?.dob, icon: Calendar },
                { label: "Gender", value: faculty?.gender, icon: User },
                {
                  label: "Emergency Contact",
                  value: faculty?.emergencyName,
                  icon: Heart,
                },
                {
                  label: "Emergency Phone",
                  value: faculty?.emergencyNumber,
                  icon: Phone,
                },
                { label: "Religion", value: faculty?.religion, icon: Info },
                {
                  label: "Community / Caste",
                  value: `${faculty?.community} / ${faculty?.caste}`,
                  icon: Info,
                },
                {
                  label: "Marital Status",
                  value: faculty?.maritalStatus,
                  icon: Heart,
                },
                {
                  label: "Blood Group",
                  value: faculty?.bloodGroup,
                  icon: Heart,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {item.value || "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300 p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
                Residential Address
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Permanent Residence
                  </span>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    {faculty?.address1}
                    <br />
                    {faculty?.address2 && (
                      <>
                        {faculty.address2}
                        <br />
                      </>
                    )}
                    {faculty?.district}, {faculty?.state}
                    <br />
                    {faculty?.country} - {faculty?.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info - Contact & Stats */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-50 pb-4">
              Digital Reach
            </h3>
            <div className="space-y-8">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Email Identity
                  </span>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                    {faculty?.emailid}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Mobile Number
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {faculty?.phonenumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Experience Stat */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center mb-2">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">
                  Professional Standing
                </p>
                <div className="text-4xl font-black flex items-baseline gap-2">
                  {faculty?.experience || 0}
                  <span className="text-sm font-bold text-white/40 uppercase">
                    Years
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-medium text-white/40 italic">
                Dedicated service at Kanimai Institutions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDetail;
