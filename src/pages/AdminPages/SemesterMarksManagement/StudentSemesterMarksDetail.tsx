import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  User,
  GraduationCap,
  Calendar,
  Building,
  CheckCircle2,
  X,
  Edit2,
  Save,
  Info,
} from "lucide-react";
import { masterApi, studentApi } from "@/services/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StudentSemesterMarksDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [marks, setMarks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({
    internal: "",
    external: "",
    total: 0,
    gradeName: "-",
    gradeId: null,
  });

  const fetchInitialData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [studentRes, semRes] = await Promise.all([
        studentApi.getStudentById(id),
        masterApi.getSemesterList({}),
      ]);
      setStudent(studentRes.data);
      const semList = semRes.data.responseModelList || [];
      setSemesters(semList);

      // Default to Semester 1 if available, otherwise first in list
      if (semList.length > 0) {
        const sem1 = semList.find(
          (s: any) => s.id === 1 || s.semesterName?.includes("1"),
        );
        setSelectedSemester(
          sem1 ? sem1.id.toString() : semList[0].id.toString(),
        );
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  const fetchMarks = async () => {
    if (!id || !selectedSemester) return;
    try {
      const [subjectsRes, marksRes] = await Promise.all([
        masterApi.getSubjectsByCourse(student.courseId, selectedSemester),
        studentApi.getStudentMarks(id, selectedSemester),
      ]);

      const subjects = subjectsRes.data || [];
      const existingMarks = Array.isArray(marksRes.data) ? marksRes.data : [];

      const combinedMarks: any[] = existingMarks.map((m: any) => ({
        id: m.id,
        subjectId: m.subjectId,
        subjectName: m.subjectName,
        subjectCode: m.subjectCode,
        internal: m.internal !== null ? m.internal : "-",
        external: m.external !== null ? m.external : "-",
        total: m.total !== null ? m.total : "-",
        gradeName: m.gradeName || "-",
        gradeId: m.gradeId || null,
      }));

      subjects.forEach((sub: any) => {
        const exists = combinedMarks.find((m) => m.subjectId === sub.id);
        if (!exists) {
          combinedMarks.push({
            id: null,
            subjectId: sub.id,
            subjectName: sub.subjectName,
            subjectCode: sub.subjectCode,
            internal: "-",
            external: "-",
            total: "-",
            gradeName: "-",
            gradeId: null,
          });
        }
      });

      setMarks(combinedMarks);
      debugger;
    } catch (error) {
      console.error("Error fetching marks:", error);
      toast.error("Failed to load marks");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (student && selectedSemester) {
      fetchMarks();
    }
  }, [student, selectedSemester]);

  const fetchGrade = async (total: number) => {
    if (total === 0) return { id: null, name: "-" };
    try {
      const res = await masterApi.getGradeByMark(total);
      return { id: res.data.id, name: res.data.gradeName };
    } catch (e) {
      return { id: null, name: "-" };
    }
  };

  const handleMarkChange = async (
    type: "internal" | "external",
    value: string,
  ) => {
    const numVal = Number(value) || 0;

    if (numVal > 100) {
      toast.warning(
        `${type.charAt(0).toUpperCase() + type.slice(1)} Mark is invalid !!`,
      );
      setEditValues((prev: any) => ({
        ...prev,
        [type]: "",
        total: "-",
        gradeName: "-",
        gradeId: null,
      }));
      return;
    }

    const otherType = type === "internal" ? "external" : "internal";
    const otherVal = Number(editValues[otherType]) || 0;
    const total = numVal + otherVal;

    if (total > 100) {
      toast.warning("Total Mark exceeds 100 !!");
      setEditValues((prev: any) => ({
        ...prev,
        [type]: "",
        total: "-",
        gradeName: "-",
        gradeId: null,
      }));
      return;
    }

    const grade = await fetchGrade(total);

    setEditValues((prev: any) => ({
      ...prev,
      [type]: value,
      total: total,
      gradeName: grade.name,
      gradeId: grade.id,
    }));
  };

  const handleEdit = (mark: any) => {
    setEditingId(mark.subjectId);
    setEditValues({
      internal: mark.internal === "-" ? "" : mark.internal,
      external: mark.external === "-" ? "" : mark.external,
      total: mark.total === "-" ? 0 : mark.total,
      gradeName: mark.gradeName,
      gradeId: mark.gradeId,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({
      internal: "",
      external: "",
      total: 0,
      gradeName: "-",
      gradeId: null,
    });
  };

  const handleSave = async (mark: any) => {
    if (!editValues.internal || !editValues.external) {
      toast.error("Some Field Required Here !!");
      return;
    }

    try {
      const payload = {
        id: mark.id,
        studentId: id,
        semesterId: selectedSemester,
        subjectId: mark.subjectId,
        subjectName: mark.subjectName,
        subjectCode: mark.subjectCode,
        internal: editValues.internal,
        external: editValues.external,
        total: editValues.total,
        gradeId: editValues.gradeId,
      };

      const response = await studentApi.saveStudentMark(payload);
      if (response.data.status === "SUCCESS") {
        toast.success("Semester Detail Updated successfully !!");
        setEditingId(null);
        fetchMarks();
      } else {
        toast.error(response.data.message || "Failed to update marks");
      }
    } catch (error) {
      console.error("Error saving marks:", error);
      toast.error("Failed to save marks");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Syncing Academic Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />

        <div className="flex items-center gap-5 relative z-10">
          <button
            onClick={() => navigate("/admin/student/semester/marks")}
            className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-all border border-slate-100 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                {student?.studentName}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                  {student?.rollNo || "NO ID"}
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  {student?.deptName}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <Select onValueChange={setSelectedSemester} value={selectedSemester}>
            <SelectTrigger className="w-[200px] h-auto px-4 py-3 bg-slate-900 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-white ring-offset-0 focus:ring-4 focus:ring-slate-900/10 transition-all">
              <SelectValue placeholder="SELECT SEMESTER" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-2xl bg-white">
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

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Degree
            </p>
            <p className="text-sm font-black text-slate-800 mt-0.5">
              {student?.degreeName || "-"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Course
            </p>
            <p className="text-sm font-black text-slate-800 mt-0.5 overflow-hidden text-ellipsis">
              {student?.courseName || "-"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Batch Year
            </p>
            <p className="text-sm font-black text-slate-800 mt-0.5">
              {student?.batch || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Marks List - Responsive Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">
              Semester Mark Details
            </h2>
          </div>
        </div>

        {/* Desktop View - Table */}
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
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Subject Code
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Internal Mark
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  External Mark
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Total
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Grade
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {marks.map((mark, index) => (
                <tr
                  key={mark.subjectId}
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="px-8 py-5 text-sm font-black text-slate-300">
                    {(index + 1).toString().padStart(2, "0")}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-700">
                      {mark.subjectName}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-md">
                      {mark.subjectCode}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    {editingId === mark.subjectId ? (
                      <input
                        type="text"
                        className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-lg text-center text-xs font-black focus:ring-2 focus:ring-primary/20 outline-none"
                        value={editValues.internal}
                        onChange={(e) =>
                          handleMarkChange("internal", e.target.value)
                        }
                        placeholder="00"
                      />
                    ) : (
                      <span className="text-xs font-black text-slate-600">
                        {mark.internal}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center">
                    {editingId === mark.subjectId ? (
                      <input
                        type="text"
                        className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-lg text-center text-xs font-black focus:ring-2 focus:ring-primary/20 outline-none"
                        value={editValues.external}
                        onChange={(e) =>
                          handleMarkChange("external", e.target.value)
                        }
                        placeholder="00"
                      />
                    ) : (
                      <span className="text-xs font-black text-slate-600">
                        {mark.external}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-xs font-black text-slate-800">
                      {editingId === mark.subjectId
                        ? editValues.total
                        : mark.total}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                      {editingId === mark.subjectId
                        ? editValues.gradeName
                        : mark.gradeName}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {editingId === mark.subjectId ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={handleCancel}
                          className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSave(mark)}
                          className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-lg transition-all"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(mark)}
                        className="p-2.5 hover:bg-primary/5 text-slate-400 hover:text-primary rounded-xl transition-all active:scale-90"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {marks.map((mark, index) => (
            <div key={mark.subjectId} className="p-6 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <span className="text-xs font-black text-slate-300 mt-1">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2">
                      {mark.subjectName}
                    </h3>
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-md">
                      {mark.subjectCode}
                    </span>
                  </div>
                </div>
                {editingId !== mark.subjectId && (
                  <button
                    onClick={() => handleEdit(mark)}
                    className="p-3 bg-slate-50 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-xl transition-all active:scale-90"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Internal Mark
                  </p>
                  {editingId === mark.subjectId ? (
                    <input
                      type="text"
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-black focus:ring-2 focus:ring-primary/20 outline-none"
                      value={editValues.internal}
                      onChange={(e) =>
                        handleMarkChange("internal", e.target.value)
                      }
                      placeholder="00"
                    />
                  ) : (
                    <p className="text-sm font-black text-slate-700">
                      {mark.internal}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    External Mark
                  </p>
                  {editingId === mark.subjectId ? (
                    <input
                      type="text"
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-black focus:ring-2 focus:ring-primary/20 outline-none"
                      value={editValues.external}
                      onChange={(e) =>
                        handleMarkChange("external", e.target.value)
                      }
                      placeholder="00"
                    />
                  ) : (
                    <p className="text-sm font-black text-slate-700">
                      {mark.external}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Total
                  </p>
                  <p className="text-lg font-black text-slate-900 mt-2">
                    {editingId === mark.subjectId
                      ? editValues.total
                      : mark.total}
                  </p>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Grade
                  </p>
                  <div className="mt-2">
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                      {editingId === mark.subjectId
                        ? editValues.gradeName
                        : mark.gradeName}
                    </span>
                  </div>
                </div>
              </div>

              {editingId === mark.subjectId && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCancel}
                    className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave(mark)}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4 text-slate-900" />
                    Save Marks
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {marks.length === 0 && (
          <div className="py-20 text-center text-slate-400 italic">
            <div className="flex flex-col items-center gap-3">
              <Info className="w-8 h-8 opacity-20" />
              <p className="text-sm">No subjects found for this semester</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSemesterMarksDetail;
