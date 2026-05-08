import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  BookOpen,
  CalendarDays,
  Clock,
  LayoutGrid,
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
      setFaculty(facultyRes.data);

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
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate("/admin/faculty/subjects")}
            className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-all border border-slate-100 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner rotate-3">
              <BookOpen className="w-7 h-7 -rotate-3" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 flex-wrap">
                <span className="text-primary">{faculty?.facultyName}</span>
                <span className="text-slate-200">|</span>
                <span className="text-slate-500 uppercase">
                  {faculty?.facultyId || faculty?.employeeId}
                </span>
              </h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                {faculty?.course} • Subject Assignments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject List Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">
                Subject Details
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Comprehensive Allocation List
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/20 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                  S.No
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Course
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Semester
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Section
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Day Order
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Day Hour
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Subject Name
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Subject Code
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
                    <td className="px-8 py-5 text-sm font-black text-slate-300 group-hover:text-primary transition-colors">
                      {(idx + 1).toString().padStart(2, "0")}
                    </td>
                    <td className="px-8 py-5 text-xs font-black text-slate-700">
                      {detail.courseName || faculty?.course}
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500">
                      {detail.semesterName || "-"}
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-black uppercase">
                        {detail.sectionName || "-"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                        {detail.dayOrderName || detail.dayordername || "-"}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {detail.hourName || detail.dayHourName || "-"}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-slate-800">
                        {detail.subjectName || "-"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black tracking-widest">
                        {detail.subjectCode || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-8 py-24 text-center">
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
      </div>
    </div>
  );
};

export default FacultySubjectView;
