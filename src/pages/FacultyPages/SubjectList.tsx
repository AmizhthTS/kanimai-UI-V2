import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CalendarRange,
  Search,
  Loader2,
  Filter,
  GraduationCap,
  Layers,
  Building2,
  Clock,
  Layout,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { facultyApi, masterApi } from "@/services/api";
import { toast } from "sonner";

const SubjectList = () => {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [dayOrders, setDayOrders] = useState<any[]>([]);
  const [selectedDayOrder, setSelectedDayOrder] = useState<string>("All");

  const facultyId = sessionStorage.getItem("userID") || "1";
  const facultyName = sessionStorage.getItem("UserName") || "Faculty";

  const fetchDayOrders = async () => {
    try {
      const response = await masterApi.getDayOrderList({
        searchStr: "",
        pageNumber: 0,
      });
      setDayOrders(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching day orders:", error);
    }
  };

  const fetchSubjects = async (dayOrderId?: string) => {
    setLoading(true);
    try {
      let response;
      if (dayOrderId && dayOrderId !== "All") {
        response = await facultyApi.getFacultySubjectsByDayOrderFilter(
          facultyId,
          dayOrderId,
        );
      } else {
        // Fallback to all subjects if no day order selected
        // Note: The specific API for all subjects might differ, using the dayorder one as base
        response = await facultyApi.getFacultySubjectsByDayOrder(facultyId);
      }
      setSubjects(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subject list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayOrders();
    fetchSubjects();
  }, []);

  const handleDayOrderChange = (dayOrderId: string) => {
    setSelectedDayOrder(dayOrderId);
    fetchSubjects(dayOrderId);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 rotate-3 transition-transform hover:rotate-0 cursor-pointer">
            <BookOpen className="w-7 h-7 -rotate-3 transition-transform" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {facultyName} - <span className="text-primary">Subject List</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              Academic Engagement Schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={selectedDayOrder}
            onValueChange={handleDayOrderChange}
          >
            <SelectTrigger className="w-[200px] h-12 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none transition-all px-4">
              <div className="flex items-center gap-3">
                <CalendarRange className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="All Day Orders" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-1">
              <SelectItem 
                value="All" 
                className="text-[10px] font-black uppercase tracking-widest py-3 focus:bg-primary/5 focus:text-primary rounded-xl cursor-pointer"
              >
                All Day Orders
              </SelectItem>
              {dayOrders.map((day) => (
                <SelectItem 
                  key={day.id} 
                  value={day.id.toString()} 
                  className="text-[10px] font-black uppercase tracking-widest py-3 focus:bg-primary/5 focus:text-primary rounded-xl cursor-pointer"
                >
                  {day.orderName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Courses
            </p>
            <p className="text-lg font-black text-slate-800">
              {subjects.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  S.No
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Day Hour
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Subject
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Subject Code
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Semester
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Department
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Section
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Syncing Subject Schedule...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : subjects.length > 0 ? (
                subjects.map((item, idx) => (
                  <tr
                    key={idx}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-slate-300 group-hover:text-primary transition-colors">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {item.dayHourName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-black text-slate-800 group-hover:text-primary transition-colors">
                        {item.subjectName}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                        {item.subjectCode}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-600">
                        {item.semesterName}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">
                          {item.courseName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Layout className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">
                          {item.sectionName}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        No subjects mapped for this day order
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

export default SubjectList;
