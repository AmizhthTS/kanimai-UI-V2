import React, { useState, useEffect } from "react";
import { User, Phone, Mail, MapPin, Loader2, Info, GraduationCap } from "lucide-react";
import { studentApi } from "@/services/api";
import { toast } from "sonner";

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const studentId = sessionStorage.getItem("userID") || "1";

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await studentApi.getStudentById(studentId);
      const imageResponse = await studentApi.getStudentImage(studentId);
      
      let studentImage = null;
      if (imageResponse.data.image) {
        studentImage = imageResponse.data.image.startsWith("ZGF0Y")
          ? atob(imageResponse.data.image)
          : imageResponse.data.image;
      }
      
      setStudent({ ...response.data, studentImage });
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to load profile details");
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full -mr-40 -mt-40 blur-3xl" />
        <div className="relative z-10 w-32 h-32 rounded-3xl bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
          {student?.studentImage ? (
            <img src={student.studentImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-slate-300" />
          )}
        </div>
        <div className="relative z-10 flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {student?.firstName} {student?.lastName}
            </h1>
            <span className="inline-flex items-center px-4 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100/50">
              {student?.admissionNo}
            </span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              {student?.course} - {student?.department}
            </span>
            <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
              <Mail className="w-4 h-4 text-indigo-500" />
              {student?.emailId}
            </span>
            <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
              <Phone className="w-4 h-4 text-indigo-500" />
              {student?.mobileNo}
            </span>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Personal Info</h2>
          </div>
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date of Birth</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{student?.dob || "-"}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gender</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{student?.gender || "-"}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Blood Group</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{student?.bloodGroup || "-"}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Religion</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{student?.religion || "-"}</p>
               </div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Address</h2>
          </div>
          <div className="space-y-6">
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Permanent Address</p>
                <p className="text-sm font-bold text-slate-700 mt-1 leading-relaxed">
                   {student?.address1} {student?.address2}<br/>
                   {student?.district}, {student?.state}<br/>
                   {student?.country} - {student?.pincode}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
