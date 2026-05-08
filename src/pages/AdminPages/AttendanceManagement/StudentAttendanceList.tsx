import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Loader2,
  GraduationCap,
  Calendar,
  Building,
  X,
  RotateCcw,
  CheckCircle2,
  Users,
  ClipboardCheck,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import TextInput from "@/components/Inputs/TextInput";
import DateRangePickerInput from "@/components/Inputs/DateRangePickerInput";
import { masterApi, studentApi, dashboardApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, eachDayOfInterval } from "date-fns";

const StudentAttendanceList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 10;

  // Masters
  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [odCategories, setODCategories] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<string[]>([]);

  // Filter values
  const [selectedDegree, setSelectedDegree] = useState<any>("");
  const [selectedCourse, setSelectedCourse] = useState<any>("");
  const [selectedSemester, setSelectedSemester] = useState<any>("");
  const [selectedStatus, setSelectedStatus] = useState<any>("");

  // OD Modal
  const [showODModal, setShowODModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const {
    control: odControl,
    handleSubmit: handleODSubmit,
    reset: resetODForm,
    formState: { errors: odErrors },
    setValue: setODValue,
    watch: watchODForm,
  } = useForm({
    defaultValues: {
      odCategoryId: null,
      odDates: { from: undefined, to: undefined } as any,
      odCount: "",
    },
  });

  const watchedDates = watchODForm("odDates");

  useEffect(() => {
    if (watchedDates?.from && watchedDates?.to) {
      const dates = eachDayOfInterval({
        start: watchedDates.from,
        end: watchedDates.to,
      });
      // Filter out holidays if you only want to count working days
      const workingDays = dates.filter(
        (date) => !holidays.includes(date.toDateString()),
      );
      setODValue("odCount", workingDays.length.toString());
    } else if (watchedDates?.from) {
      setODValue("odCount", "1");
    } else {
      setODValue("odCount", "");
    }
  }, [watchedDates, holidays, setODValue]);

  const fetchInitialData = async () => {
    try {
      const [degRes, semRes, odRes, holidayRes] = await Promise.all([
        masterApi.getDegreeList({}),
        masterApi.getSemesterList({}),
        masterApi.getODList({}),
        dashboardApi.getHolidayList(),
      ]);

      setDegrees(degRes.data?.responseModelList || []);
      setSemesters(semRes.data?.responseModelList || []);
      setODCategories(odRes.data?.responseModelList || []);

      // Holiday logic
      if (holidayRes.data?.count > 0) {
        const disabledDates =
          holidayRes.data.responseModelList
            ?.filter((h: any) => h.eventType === "holiday")
            ?.map((h: any) => {
              const [day, month, year] = h.startDate.split("/");

              return new Date(+year, +month - 1, +day).toDateString();
            }) || [];

        setHolidays(disabledDates);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const fetchCourses = async (degreeId: any) => {
    if (!degreeId) {
      setCourses([]);
      return;
    }
    try {
      const response = await masterApi.getCourseList({ degreeId });
      setCourses(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentApi.getStudentList({
        searchStr: searchQuery,
        degreeId: selectedDegree || "",
        courseId: selectedCourse || "",
        semesterId: selectedSemester || "",
        // batch: selectedBatch || "",
        status: selectedStatus || "",
        pageNumber: currentPage - 1,
        reqType: "attendance",
      });
      setStudents(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load attendance list");
    } finally {
      setLoading(false);
    }
  };

  // const generateBatchList = () => {
  //   const currentYear = new Date().getFullYear();
  //   const batchList = [];
  //   for (let i = currentYear; i > currentYear - 6; i--) {
  //     batchList.push(i.toString());
  //   }
  //   setBatches(batchList);
  // };

  useEffect(() => {
    fetchInitialData();
    // generateBatchList();
  }, []);

  useEffect(() => {
    if (selectedDegree) {
      fetchCourses(selectedDegree);
      setSelectedCourse("");
    }
  }, [selectedDegree]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 400);
    return () => clearTimeout(timer);
  }, [
    searchQuery,
    currentPage,
    selectedDegree,
    selectedCourse,
    // selectedBatch,
    selectedSemester,
    selectedStatus,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDegree("");
    setSelectedCourse("");
    // setSelectedBatch("");
    setSelectedSemester("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  const onODUpdate = async (data: any) => {
    try {
      let formattedDates: string[] = [];
      if (data.odDates?.from && data.odDates?.to) {
        const dates = eachDayOfInterval({
          start: data.odDates.from,
          end: data.odDates.to,
        });
        formattedDates = dates.map((d) => format(d, "dd/MM/yyyy"));
      } else if (data.odDates?.from) {
        formattedDates = [format(data.odDates.from, "dd/MM/yyyy")];
      }

      const payload = {
        odCategoryId: data.odCategoryId?.id || data.odCategoryId,
        odDates: formattedDates,
        odCount: data.odCount,
      };
      await studentApi.updateStudentOD(selectedStudent.id, payload);
      toast.success("OD updated successfully");
      setShowODModal(false);
      resetODForm();
      fetchStudents();
    } catch (error) {
      toast.error("Failed to update OD");
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner shrink-0">
            <ClipboardCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Student <span className="text-primary uppercase">Attendance</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              Management & OD Track
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="relative group lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search student..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-400 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Select
            onValueChange={setSelectedDegree}
            value={selectedDegree || ""}
          >
            <SelectTrigger className="w-full h-auto px-4 py-3 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="DEGREE" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {degrees.map((deg) => (
                <SelectItem
                  key={deg.id}
                  value={deg.id.toString()}
                  className="text-[10px] font-black uppercase py-3"
                >
                  {deg.degreeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={setSelectedCourse}
            value={selectedCourse || ""}
            disabled={!selectedDegree}
          >
            <SelectTrigger className="w-full h-auto px-4 py-3 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="COURSE" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              {courses.map((course) => (
                <SelectItem
                  key={course.id}
                  value={course.id.toString()}
                  className="text-[10px] font-black uppercase py-3"
                >
                  {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={setSelectedSemester}
            value={selectedSemester || ""}
          >
            <SelectTrigger className="w-full h-auto px-4 py-3 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="SEMESTER" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
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

          <button
            onClick={resetFilters}
            className="w-full h-auto py-3 bg-rose-50 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Attendance List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[60vh]">
        <div className="flex-1">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                    S.No
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Student Name
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Batch
                  </th>
                  <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Total Days
                  </th>
                  <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Presents
                  </th>
                  <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Absents
                  </th>
                  <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    (%)
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          Loading Records...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : students.length > 0 ? (
                  students.map((student, index) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/50 transition-all group"
                    >
                      <td className="px-8 py-5 text-sm font-black text-slate-300">
                        {((currentPage - 1) * rowsPerPage + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </td>
                      <td className="px-8 py-5">
                        <div
                          className="flex items-center gap-4 cursor-pointer group/name"
                          onClick={() =>
                            navigate(
                              `/admin/student/attendance/view/${student.id}`,
                            )
                          }
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:bg-primary group-hover:text-white transition-all">
                            {student.studentName?.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800 group-hover/name:text-primary transition-colors">
                              {student.studentName}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {student.rollNo || "NO ID"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-left text-xs font-black text-slate-500 uppercase">
                        {student.batch || "-"}
                      </td>
                      <td className="px-8 py-5 text-center text-xs font-black text-slate-500">
                        {student.attendanceTotal || "0"}
                      </td>
                      <td className="px-8 py-5 text-center text-xs font-black text-emerald-500">
                        {student.attendancePresent || "0"}
                      </td>
                      <td className="px-8 py-5 text-center text-xs font-black text-rose-500">
                        {student.attendanceAbsent || "0"}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black ${
                            Number(student.attendancePercent) >= 75
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {student.attendancePercent || "0"}%
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            resetODForm();
                            setShowODModal(true);
                          }}
                          className="p-2.5 hover:bg-primary/5 text-slate-400 hover:text-primary rounded-xl transition-all active:scale-90"
                          title="Update OD"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-20 text-center text-slate-400 italic"
                    >
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden p-4 space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Loading...
                </span>
              </div>
            ) : students.length > 0 ? (
              students.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() =>
                        navigate(`/admin/student/attendance/view/${student.id}`)
                      }
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary text-sm font-black">
                        {student.studentName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-800">
                          {student.studentName}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                          {student.rollNo || "NO ID"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black ${
                          Number(student.attendancePercent) >= 75
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {student.attendancePercent || "0"}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Total Days
                      </span>
                      <span className="text-xs font-black text-slate-700 uppercase">
                        {student.attendanceTotal || "0"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-right">
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                        Present
                      </span>
                      <span className="text-xs font-black text-emerald-600 uppercase">
                        {student.attendancePresent || "0"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      resetODForm();
                      setShowODModal(true);
                    }}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-900/10"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Update On-Duty
                  </button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-slate-400 italic text-sm">
                No matching records found
              </div>
            )}
          </div>
        </div>

        {/* Custom Pagination */}
        <div className="px-8 py-4 border-t border-slate-100 bg-white flex items-center justify-center sm:justify-end min-h-[70px]">
          {totalCount > 1 && (
            <CustomPagination
              totalPages={totalCount}
              page={currentPage - 1}
              onPageChange={(_: any, newPage: number) =>
                setCurrentPage(newPage + 1)
              }
            />
          )}
        </div>
      </div>

      {/* OD Modal */}
      <Dialog open={showODModal} onOpenChange={setShowODModal}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white">
          <DialogHeader className="px-10 py-6 bg-slate-900 text-white flex flex-row items-center justify-between space-y-0 border-b border-white/5">
            <DialogTitle className="text-lg font-black tracking-widest uppercase">
              Number of{" "}
              <span className="text-primary underline underline-offset-8 decoration-2">
                On Duty
              </span>
            </DialogTitle>
            <button
              onClick={() => setShowODModal(false)}
              className="p-2 hover:bg-white/10 rounded-xl text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          <div className="p-10 space-y-8 bg-[#F8F9FE]">
            <div className="space-y-6">
              <AutocompleteInput
                control={odControl}
                errors={odErrors}
                name="odCategoryId"
                textLable="OD Category"
                placeholderName="Select Category"
                requiredMsg="Required"
                labelMandatory
                options={odCategories}
                getOptionLabel={(opt: any) => opt.odName}
                getOptionValue={(opt: any) => opt.id}
              />

              <DateRangePickerInput
                control={odControl}
                errors={odErrors}
                name="odDates"
                textLable="OD Date"
                placeholderName="Select Date Range"
                requiredMsg="Required"
                labelMandatory
                disabledDates={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || holidays.includes(date.toDateString());
                }}
              />

              <TextInput
                control={odControl}
                errors={odErrors}
                name="odCount"
                textLable="OD Count"
                placeholderName="3"
                requiredMsg="Required"
                labelMandatory
                type="number"
                inputProps={{
                  disabled: true,
                }}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowODModal(false)}
                className="flex-1 h-14 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleODSubmit(onODUpdate)}
                className="flex-1 h-14 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all"
              >
                Update
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentAttendanceList;
