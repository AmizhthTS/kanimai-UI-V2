import React, { useState, useEffect } from "react";
import { GraduationCap, BookOpen, Loader2, Info } from "lucide-react";
import { parentApi, masterApi } from "@/services/api";
import { useParentStudent } from "@/contexts/ParentStudentContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ParentMarks = () => {
  const [loading, setLoading] = useState(true);
  const [marksData, setMarksData] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const { activeStudent } = useParentStudent();
  const studentId = activeStudent?.id || "1";
  const studentName = activeStudent?.name || "Student";

  const fetchInitialData = async () => {
    try {
      const semRes = await masterApi.getSemesterList({});
      const semList = semRes.data?.responseModelList || [];
      setSemesters(semList);
      if (semList.length > 0) {
        setSelectedSemester(semList[0].id.toString());
      }
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const fetchMarks = async () => {
    // if (!selectedSemester) return;
    setLoading(true);
    try {
      // const response = await parentApi.getSemesterMarks(studentId);

      // Fallback structure check
      // if (response && response.data) {
      //   setMarksData(response.data);
      // } else {
      // Mock data structure fallback based on studentId
      if (studentId === "2") {
        setMarksData([
          {
            subjectName: "Biochemistry",
            subjectCode: "BT201",
            internal: 47,
            external: 48,
            total: 95,
            gradeName: "O",
          },
          {
            subjectName: "Cell Biology",
            subjectCode: "BT202",
            internal: 46,
            external: 45,
            total: 91,
            gradeName: "O",
          },
          {
            subjectName: "Genetics",
            subjectCode: "BT203",
            internal: 43,
            external: 44,
            total: 87,
            gradeName: "A+",
          },
        ]);
      } else if (studentId === "3") {
        setMarksData([
          {
            subjectName: "Digital Electronics",
            subjectCode: "EC201",
            internal: 32,
            external: 38,
            total: 70,
            gradeName: "B+",
          },
          {
            subjectName: "Signals & Systems",
            subjectCode: "EC202",
            internal: 35,
            external: 41,
            total: 76,
            gradeName: "A",
          },
          {
            subjectName: "Microprocessors",
            subjectCode: "EC203",
            internal: 34,
            external: 32,
            total: 66,
            gradeName: "B",
          },
        ]);
      } else {
        // Arjun (CSE) Default
        setMarksData([
          {
            subjectName: "Data Structures",
            subjectCode: "CS201",
            internal: 40,
            external: 45,
            total: 85,
            gradeName: "A+",
          },
          {
            subjectName: "Computer Networks",
            subjectCode: "CS202",
            internal: 35,
            external: 40,
            total: 75,
            gradeName: "A",
          },
          {
            subjectName: "Operating Systems",
            subjectCode: "CS203",
            internal: 45,
            external: 50,
            total: 95,
            gradeName: "O",
          },
        ]);
      }
      // }
    } catch (error) {
      console.error("Error fetching marks:", error);
      // Mock fallback
      setMarksData([
        {
          subjectName: "Data Structures",
          subjectCode: "CS201",
          internal: 40,
          external: 45,
          total: 85,
          gradeName: "A+",
        },
        {
          subjectName: "Computer Networks",
          subjectCode: "CS202",
          internal: 35,
          external: 40,
          total: 75,
          gradeName: "A",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchMarks();
  }, [selectedSemester, studentId]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Academic Performance
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Semester Marks Details for {studentName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
          <Select onValueChange={setSelectedSemester} value={selectedSemester}>
            <SelectTrigger className="w-full md:w-[200px] h-auto px-4 py-3 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 focus:ring-4 focus:ring-slate-100 transition-all">
              <SelectValue placeholder="SELECT SEMESTER" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl bg-white">
              {semesters.map((sem) => (
                <SelectItem
                  key={sem.id}
                  value={sem.id.toString()}
                  className="text-[10px] font-black uppercase py-3"
                >
                  {sem.semesterName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Marks List */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[50vh]">
        <div className="bg-slate-50/50 px-6 md:px-8 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">
            Subject Wise Marks
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Fetching Records...
            </span>
          </div>
        ) : marksData.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">
                      S.No
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Subject Name
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Internal
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      External
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Total
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {marksData.map((mark, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/50 transition-all group"
                    >
                      <td className="px-8 py-5 text-sm font-black text-slate-300">
                        {(index + 1).toString().padStart(2, "0")}
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-slate-700 block">
                          {mark.subjectName}
                        </span>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                          {mark.subjectCode}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-sm font-black text-slate-600">
                          {mark.internal}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-sm font-black text-slate-600">
                          {mark.external}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-base font-black text-slate-900">
                          {mark.total}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                          {mark.gradeName}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-slate-100">
              {marksData.map((mark, index) => (
                <div key={index} className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <span className="text-xs font-black text-slate-300 mt-1">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2">
                        {mark.subjectName}
                      </h3>
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                        {mark.subjectCode}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center items-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Internal
                      </p>
                      <p className="text-sm font-black text-slate-700">
                        {mark.internal}
                      </p>
                    </div>
                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center items-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        External
                      </p>
                      <p className="text-sm font-black text-slate-700">
                        {mark.external}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-2xl border border-emerald-100">
                    <div className="flex flex-col">
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                        Total Score
                      </p>
                      <p className="text-xl font-black text-emerald-800">
                        {mark.total}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                        Grade
                      </p>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white shadow-sm">
                        {mark.gradeName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center text-slate-400 italic">
            <div className="flex flex-col items-center gap-3">
              <Info className="w-8 h-8 opacity-20" />
              <p className="text-sm">No marks recorded for this semester</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentMarks;
