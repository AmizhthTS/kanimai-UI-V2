import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Loader2,
  CalendarDays,
  Clock,
  User,
  BookOpen,
  Edit,
  Save,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";

const TimeTableMapping = () => {
  const navigate = useNavigate();
  const { courseid, semesterid, sectionid } = useParams();
  const location = useLocation();
  const mappingDetail = location.state?.mapping;

  // Shared details from state (with fallback to params for essential IDs)
  const sharedDetails = {
    id: mappingDetail?.id,
    degreeId: mappingDetail?.degreeId,
    courseId: mappingDetail?.courseId || courseid,
    yearId: mappingDetail?.yearId,
    semesterId: mappingDetail?.semesterId || semesterid,
    sectionId: mappingDetail?.sectionId || sectionid,
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dayOrders, setDayOrders] = useState<any[]>([]);
  const [dayHours, setDayHours] = useState<any[]>([]);
  const [timetableData, setTimetableData] = useState<any[]>([]);

  // Selection state for updating a slot
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [courseSections, setCourseSections] = useState({});
  const [sectionSubjects, setSectionSubjects] = useState<any[]>([]);
  const [isTimeTableOpen, setIsTimeTableOpen] = useState(true);
  const [isFacultyDetailsOpen, setIsFacultyDetailsOpen] = useState(true);
  const [editingFacultyRow, setEditingFacultyRow] = useState<number | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subjectId: {},
      facultyId: {},
    },
  });

  const {
    control: facultyControl,
    handleSubmit: handleFacultySubmit,
    reset: resetFaculty,
    formState: { errors: facultyErrors },
  } = useForm({
    defaultValues: {
      facultyId: {},
    },
  });

  const selectedSubject = watch("subjectId");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [doRes, dhRes, ttRes, subRes, subjectsRes, courseSectionRes] =
        await Promise.all([
          masterApi.getDayOrderList({}),
          masterApi.getDayHourList({}),
          masterApi.getDayOrderMappingList({
            courseSectionMapId: sharedDetails.id,
          }),
          masterApi.getSectionSubjectListByCourse(
            sharedDetails.courseId!,
            sharedDetails.semesterId!,
            sharedDetails.sectionId!,
          ),
          masterApi.getSubjectsByCourse(
            sharedDetails.courseId!,
            sharedDetails.semesterId!,
          ),
          masterApi.getCourseSectionList({
            courseId: sharedDetails.courseId,
          }),
        ]);

      setDayOrders(
        Array.isArray(doRes.data?.responseModelList)
          ? doRes.data.responseModelList
          : [],
      );
      setDayHours(
        Array.isArray(dhRes.data?.responseModelList)
          ? dhRes.data.responseModelList
          : [],
      );
      setTimetableData(Array.isArray(ttRes.data) ? ttRes.data : []);
      setSectionSubjects(
        Array.isArray(subRes.data?.responseModelList)
          ? subRes.data?.responseModelList
          : [],
      );
      setAllSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
      if (courseSectionRes.data?.responseModelList) {
        const section = courseSectionRes.data.responseModelList.filter(
          (cs: any) => cs.id === Number(sharedDetails.id),
        )[0];
        setCourseSections(section);
      }
    } catch (error) {
      console.error("Error fetching timetable data:", error);
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    sharedDetails.courseId,
    sharedDetails.semesterId,
    sharedDetails.sectionId,
  ]);

  useEffect(() => {
    if (selectedSubject) {
      const subId =
        selectedSubject && typeof selectedSubject === "object"
          ? (selectedSubject as any).id
          : selectedSubject;
      if (subId) {
        masterApi.getFacultyBySubject(subId).then((res) => {
          setFaculties(Array.isArray(res.data) ? res.data : []);
        });
      }
    }
  }, [selectedSubject]);

  const handleSlotClick = (day: any, hour: any) => {
    // Find the hour name from the dayHours list with string comparison for safety
    const targetHourId = (hour.dayHourId || hour.id)?.toString();
    const hourInfo = dayHours.find((dh) => dh.id?.toString() === targetHourId);
    const hourName = hourInfo?.hourName || "Period";

    setSelectedSlot({
      dayOrder: day,
      dayHour: { ...hour, hourName },
      existing: hour,
    });

    if (hour.subjectCode) {
      // Find the subject from allSubjects to set the full object for Autocomplete
      const sub = allSubjects.find(
        (s: any) => s.subjectCode === hour.subjectCode,
      );
      reset({
        subjectId: sub ? { id: sub.id, subjectName: sub.subjectName } : {},
      });
    } else {
      reset({ subjectId: "" });
    }
  };

  const onUpdateSlot = async (data: any) => {
    setSaving(true);
    try {
      const subId =
        data.subjectId && typeof data.subjectId === "object"
          ? data.subjectId.id
          : data.subjectId;

      // Find faculty mapped to this subject for this section
      const mappedSubject = sectionSubjects.find(
        (s: any) => s.subjectId?.toString() === subId?.toString(),
      );
      const facultyId = mappedSubject?.facultyId || "";

      const payload = {
        id: selectedSlot.existing?.id || "",
        courseSectionMapId: sharedDetails.id,
        dayOrderId:
          selectedSlot.dayOrder.id || selectedSlot.dayOrder.dayorderid,
        dayHourId: selectedSlot.dayHour.id || selectedSlot.dayHour.dayHourId,
        subjectId: subId,
        facultyId: facultyId,
      };

      await masterApi.saveDayOrderMapping(payload);
      toast.success("Timetable slot updated");
      setSelectedSlot(null);
      fetchData(); // Refresh grid
    } catch (error) {
      console.error("Error updating slot:", error);
      toast.error("Failed to update slot");
    } finally {
      setSaving(false);
    }
  };

  const onUpdateFaculty = async (data: any, subjectId: any, index: number) => {
    try {
      const facultyId =
        data.facultyId && typeof data.facultyId === "object"
          ? data.facultyId.id
          : data.facultyId;
      await masterApi.updateDayOrderFaculty(
        sharedDetails.courseId,
        sharedDetails.semesterId,
        sharedDetails.sectionId,
        subjectId,
        facultyId,
      );
      toast.success("Faculty assignment updated");
      setEditingFacultyRow(null);
      fetchData();
    } catch (error) {
      console.error("Error updating faculty:", error);
      toast.error("Failed to update faculty");
    }
  };

  const startEditFaculty = (
    index: number,
    currentFacultyId: any,
    currentFacultyName: any,
    subjectId: any,
  ) => {
    setEditingFacultyRow(index);
    resetFaculty({
      facultyId: currentFacultyId
        ? { id: currentFacultyId, facultyName: currentFacultyName }
        : "",
    });
    // Fetch faculties for this subject
    masterApi.getFacultyBySubject(subjectId).then((res) => {
      setFaculties(Array.isArray(res.data) ? res.data : []);
    });
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Building Timetable Grid...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/master/dayorder-faculty-mapping")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Timetable <span className="text-primary">Mapping</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              {(courseSections as any)?.courseName ||
                mappingDetail?.courseName ||
                "Course"}{" "}
              - {(courseSections as any)?.yearName || mappingDetail?.yearName} -{" "}
              {(courseSections as any)?.semesterName ||
                mappingDetail?.semesterName}{" "}
              -{" "}
              {(courseSections as any)?.sectionName ||
                mappingDetail?.sectionName ||
                "..."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div
          className="p-6 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setIsTimeTableOpen(!isTimeTableOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Timetable Grid
            </h2>
          </div>
          {isTimeTableOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>

        {isTimeTableOpen && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 text-left border-b border-r border-slate-100 w-48">
                    <div className="flex items-center gap-2 text-primary">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Day / Hour
                      </span>
                    </div>
                  </th>
                  {dayHours.map((hour) => (
                    <th
                      key={hour.id}
                      className="p-6 text-center border-b border-r border-slate-100 min-w-[160px]"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-black text-slate-800">
                          {hour.hourName}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                          Period
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timetableData.map((day) => (
                  <tr key={day.dayorderid || day.id} className="group">
                    <td className="p-6 border-r border-slate-100 bg-slate-50/30 group-hover:bg-primary/5 transition-colors">
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                        {day.dayordername}
                      </span>
                    </td>
                    {day.dayHourList.map((hour: any) => {
                      return (
                        <td
                          key={hour.dayHourId}
                          className="p-3 border-r border-slate-100 group-hover:bg-slate-50/20 transition-all cursor-pointer relative"
                        >
                          {hour.subjectCode ? (
                            <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group/card">
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <BookOpen className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                                  <span className="text-[10px] font-black text-slate-700 leading-tight">
                                    {hour.subjectCode}
                                  </span>
                                </div>
                                {/* {hour.facultyName && (
                                  <div className="flex items-center gap-2">
                                    <User className="w-3 h-3 text-emerald-500 shrink-0" />
                                    <span className="text-[9px] font-bold text-slate-400 truncate">
                                      {hour.facultyName}
                                    </span>
                                  </div>
                                )} */}
                                <div
                                  onClick={() => handleSlotClick(day, hour)}
                                  className="absolute top-5 right-5 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                >
                                  <Edit className="w-3 h-3 text-primary" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => handleSlotClick(day, hour)}
                              className="h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-50 rounded-xl hover:border-primary/20 hover:bg-primary/5 transition-all group/empty"
                            >
                              <Plus className="w-4 h-4 text-slate-200 group-hover/empty:text-primary transition-colors" />
                              <span className="text-[8px] font-black text-slate-200 group-hover/empty:text-primary uppercase tracking-widest mt-1">
                                Assign
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Faculty Details Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div
          className="p-6 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setIsFacultyDetailsOpen(!isFacultyDetailsOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-500" />
            </div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Faculty Mapping
            </h2>
          </div>
          {isFacultyDetailsOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>

        {isFacultyDetailsOpen && (
          <div className="overflow-x-auto p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    S.No
                  </th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Subject Name
                  </th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Code
                  </th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Faculty
                  </th>
                  <th className="pb-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sectionSubjects.length > 0 ? (
                  sectionSubjects.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-4 text-xs font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-4 text-xs font-black text-slate-700">
                        {item.subjectName}
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500">
                          {item.subjectCode}
                        </span>
                      </td>
                      <td className="py-4">
                        {editingFacultyRow === idx ? (
                          <div className="max-w-[200px]">
                            <AutocompleteInput
                              control={facultyControl}
                              errors={facultyErrors}
                              name="facultyId"
                              placeholderName="Select Faculty"
                              options={faculties}
                              getOptionLabel={(opt: any) => opt.facultyName}
                              getOptionValue={(opt: any) => opt.id}
                              noLabel
                            />
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-500">
                            {item.facultyName || "-"}
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        {editingFacultyRow === idx ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={handleFacultySubmit((data) =>
                                onUpdateFaculty(data, item.subjectId, idx),
                              )}
                              className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                            >
                              <Save className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingFacultyRow(null)}
                              className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              startEditFaculty(
                                idx,
                                item.facultyId,
                                item.facultyName,
                                item.subjectId,
                              )
                            }
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        No Subjects mapped yet
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Slot Modal/Overlay */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedSlot(null)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-primary p-8 text-white relative">
              <button
                onClick={() => setSelectedSlot(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-black tracking-tight">
                Assign Subject
              </h2>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">
                {selectedSlot.dayOrder.dayordername} •{" "}
                {selectedSlot.dayHour.hourName}
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onUpdateSlot)}
              className="p-8 space-y-6"
            >
              <AutocompleteInput
                control={control}
                errors={errors}
                name="subjectId"
                textLable="Subject"
                placeholderName="Select Subject"
                requiredMsg="Subject is required"
                labelMandatory
                options={allSubjects}
                getOptionLabel={(opt: any) =>
                  opt
                    ? `${opt.subjectName || ""} - ${opt.subjectCode || ""}`
                    : ""
                }
                getOptionValue={(opt: any) => opt?.id}
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white font-black text-xs py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  {selectedSlot.existing ? "UPDATE SLOT" : "ASSIGN SLOT"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all font-bold text-xs"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTableMapping;
