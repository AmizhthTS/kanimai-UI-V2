import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  BookOpen,
  CalendarDays,
  Clock,
  LayoutGrid,
  User,
  Building2,
  ArrowLeft,
  Award,
} from "lucide-react";
import { facultyApi, masterApi } from "@/services/api";
import { toast } from "sonner";

const FacultySubjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState<any>(null);
  const [subjectDetails, setSubjectDetails] = useState<any[]>([]);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Fetch faculty basic info
      const facultyRes = await facultyApi.getFacultyById(id);
      const imageRes = await facultyApi.getFacultyImage(id);

      if (imageRes.data.image !== null) {
        setFaculty({
          ...facultyRes.data,
          facultyImage: imageRes.data.image.startsWith("ZGF0Y")
            ? atob(imageRes.data.image)
            : imageRes.data.image,
        });
      }

      // Fetch subject assignments
      const response = await facultyApi.getFacultySubjectsByEmployeeId(id);

      let details = Array.isArray(response.data.responseModelList)
        ? response.data.responseModelList
        : [];
      console.log(details);
      setSubjectDetails(details);

      // Flattening if it's the nested structure (Day Order -> Day Hour List)
      // if (details.length > 0 && details[0].dayHourList) {
      //    const flattened: any[] = [];
      //    details.forEach((day: any) => {
      //      day.dayHourList.forEach((hour: any) => {
      //        if (hour.subjectCode) {
      //          flattened.push({
      //            ...hour,
      //            dayOrderName: day.dayordername,
      //            courseName: facultyRes.data.course || "-",
      //          });
      //        }
      //      });
      //    });
      //    setSubjectDetails(flattened);
      // } else {
      //   setSubjectDetails(details);
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load subject details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Retrieving Academic Assignments...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group shrink-0">
            {faculty?.facultyImage ? (
              <img
                src={faculty.facultyImage}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <User className="w-12 h-12 text-slate-300" />
            )}
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {faculty?.facultyName}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                <Building2 className="w-3 h-3" />{" "}
                {faculty?.course || "Department"}
              </span>
              <span className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <Award className="w-3 h-3" />{" "}
                {faculty?.facultyId || faculty?.employeeId}
              </span>
              <span className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                Teaching Staff
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full md:w-auto">
          <button
            onClick={() => navigate("/admin/faculty/subjects")}
            className="w-full md:w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-800 hover:shadow-lg transition-all flex items-center justify-center group active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="md:hidden ml-2 font-black text-xs uppercase tracking-widest text-slate-600">
              Back to List
            </span>
          </button>
        </div>
      </div>

      {/* Subject Assignment List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[40vh]">
        <div className="bg-slate-50/50 px-6 sm:px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-800 uppercase tracking-tight">
                Subject Allocation Details
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Current Semester Assignment
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/20 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                  S.No
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Subject Identity
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Academic Mapping
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Temporal Slot
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subjectDetails.length > 0 ? (
                subjectDetails.map((detail, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-all group"
                  >
                    <td className="px-8 py-5 text-sm font-black text-slate-300">
                      {(idx + 1).toString().padStart(2, "0")}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">
                          {detail.subjectName || "-"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {detail.subjectCode || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-700 uppercase">
                          {detail.courseName || faculty?.course}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">
                            SEM: {detail.semesterName || "-"}
                          </span>
                          <span className="text-[9px] font-black text-primary uppercase">
                            SEC: {detail.sectionName || "-"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-black uppercase tracking-tight">
                            {detail.dayOrderName || detail.dayordername || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500">
                            {detail.hourName || detail.dayHourName || "-"}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <LayoutGrid className="w-12 h-12 text-slate-100" />
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        No subject assignments found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden p-4 space-y-4">
          {subjectDetails.length > 0 ? (
            subjectDetails.map((detail, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-50">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-slate-800 truncate uppercase">
                      {detail.subjectName || "-"}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      CODE: {detail.subjectCode || "-"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Temporal Slot
                    </p>
                    <p className="text-[10px] font-black text-slate-700 uppercase truncate">
                      {detail.dayOrderName || detail.dayordername || "-"}
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 mt-0.5">
                      {detail.hourName || detail.dayHourName || "-"}
                    </p>
                  </div>
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Academic Target
                    </p>
                    <p className="text-[10px] font-black text-slate-700 uppercase truncate">
                      {detail.courseName || faculty?.course}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-bold text-primary">
                        SEM: {detail.semesterName || "-"}
                      </span>
                      <span className="text-[9px] font-black text-primary">
                        SEC: {detail.sectionName || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <LayoutGrid className="w-12 h-12 text-slate-100 mx-auto mb-3" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                No assignments found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultySubjectView;
