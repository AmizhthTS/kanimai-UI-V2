import React, { useState, useEffect } from "react";
import {
  FileText,
  PieChart,
  Monitor,
  CalendarClock,
  UserCheck,
  ArrowRight,
  Download,
  Calendar,
  X,
  Loader2,
  GraduationCap,
  Building,
  LayoutGrid,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi, reportApi, studentApi } from "@/services/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import MonthPicker from "@/components/Inputs/MonthPicker";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";

const ReportDashboard = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modal Progress States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);

  const [degrees, setDegrees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const reportCards = [
    {
      id: "daily",
      title: "Daily Payment Report",
      icon: <FileText className="w-10 h-10 text-indigo-600" />,
      description: "Track day-to-day transaction records",
      path: "/admin/report/daily-payment",
    },
    {
      id: "monthly",
      title: "Monthly Payment Report",
      icon: <PieChart className="w-10 h-10 text-rose-600" />,
      description: "Consolidated monthly financial statements",
      action: () => setActiveModal("monthly"),
    },
    {
      id: "course",
      title: "Course Pending Report",
      icon: <Monitor className="w-10 h-10 text-emerald-600" />,
      description: "Overdue payments filtered by courses",
      action: () => setActiveModal("course"),
    },
    {
      id: "degree",
      title: "Degree Pending Report",
      icon: <CalendarClock className="w-10 h-10 text-amber-600" />,
      description: "Outstanding fees based on degree levels",
      action: () => setActiveModal("degree"),
    },
    {
      id: "bio",
      title: "Student Bio Details",
      icon: <UserCheck className="w-10 h-10 text-cyan-600" />,
      description: "Export complete student information",
      action: () => setActiveModal("bio"),
    },
  ];

  // Forms
  const {
    control: monthlyControl,
    handleSubmit: handleMonthlySubmit,
    reset: resetMonthly,
    formState: { errors: monthlyErrors },
  } = useForm({
    defaultValues: {
      month: format(new Date(), "MM-yyyy"),
    },
  });
  const {
    control: degreeControl,
    handleSubmit: handleDegreeSubmit,
    watch: degreeWatch,
    reset: resetDegree,
    formState: { errors: degreeErrors },
  } = useForm();
  const {
    control: courseControl,
    handleSubmit: handleCourseSubmit,
    watch: courseWatch,
    reset: resetCourse,
    formState: { errors: courseErrors },
    setValue: setCourseValue,
  } = useForm();
  const {
    control: bioControl,
    handleSubmit: handleBioSubmit,
    reset: resetBio,
    formState: { errors: bioErrors },
  } = useForm();

  const selectedDegreeForDegree = degreeWatch("degreeId");
  const selectedDegreeForCourse = courseWatch("degreeId");
  const selectedCourseForCourse = courseWatch("courseId");

  useEffect(() => {
    if (activeModal) {
      fetchCommonData();
      setIsGenerating(false);
      setGenerationProgress(0);
      setDownloadReady(false);
      generateBatchList();
    }
  }, [activeModal]);

  useEffect(() => {
    if (selectedDegreeForDegree) fetchCourses(selectedDegreeForDegree);
  }, [selectedDegreeForDegree]);

  useEffect(() => {
    if (selectedDegreeForCourse) fetchCourses(selectedDegreeForCourse);
  }, [selectedDegreeForCourse]);

  const fetchCommonData = async () => {
    try {
      const [degRes, semRes] = await Promise.all([
        masterApi.getDegreeList({}),
        masterApi.getSemesterList({}),
      ]);
      setDegrees(degRes.data.responseModelList || []);
      setSemesters(semRes.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching report filters:", error);
    }
  };

  const generateBatchList = () => {
    const currentYear = new Date().getFullYear();
    const minYears = 4;
    const batchList = [];
    for (let i = currentYear; i > currentYear - minYears; i--) {
      batchList.push(i.toString());
    }
    setBatches(batchList);
  };

  const fetchCourses = async (degree: any) => {
    const degreeId = typeof degree === "object" ? degree.id : degree;
    if (!degreeId) return;
    try {
      const res = await masterApi.getCourseList({ degreeId });
      setCourses(res.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchSections = async (course: any) => {
    const courseId = typeof course === "object" ? course.id : course;
    if (!courseId) return;
    try {
      const res = await masterApi.getClassSectionList({
        searchStr: "",
        pageNumber: 0,
      });
      setSections(res.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  useEffect(() => {
    if (selectedCourseForCourse) fetchSections(selectedCourseForCourse);
  }, [selectedCourseForCourse]);

  const startGeneration = (callback: () => void) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setDownloadReady(false);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setDownloadReady(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDownload = async (
    apiCall: () => Promise<any>,
    filename: string,
  ) => {
    setLoading(true);
    try {
      const response = await apiCall();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded successfully");
      setActiveModal(null);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report");
    } finally {
      setLoading(false);
    }
  };

  // Generation Handlers
  const onMonthlyGenerate = () => startGeneration(() => {});
  const onDegreeGenerate = () => startGeneration(() => {});
  const onCourseGenerate = () => startGeneration(() => {});
  const onBioGenerate = () => startGeneration(() => {});

  // Final Download Handlers
  const executeMonthlyDownload = (data: any) => {
    // MonthPicker value is MM-YYYY
    const [month, year] = data.month.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[parseInt(month) - 1];

    handleDownload(
      () =>
        reportApi.downloadMonthlyPaymentReport({
          filterYear: year.toString(),
          filterMonth: monthName,
        }),
      `Monthly_Payment_Report_${monthName}_${year}.pdf`,
    );
  };

  const executeDegreeDownload = (data: any) => {
    handleDownload(
      () =>
        reportApi.downloadDegreePendingReport({
          degreeId: data.degreeId?.id || data.degreeId,
          batch: data.batch,
        }),
      "Degree_Pending_Report.pdf",
    );
  };

  const executeCourseDownload = (data: any) => {
    handleDownload(
      () =>
        reportApi.downloadCoursePendingReport({
          degreeId: data.degreeId?.id || data.degreeId,
          courseId: data.courseId?.id || data.courseId,
          batch: data.batch,
          sectionId: data.sectionId?.id || data.sectionId,
          semesterId: data.semesterId?.id || data.semesterId,
        }),
      "Course_Pending_Report.pdf",
    );
  };

  const executeBioDownload = (data: any) => {
    handleDownload(
      () =>
        studentApi.exportStudentList({
          batch: data.batch,
        }),
      "Student_Bio_Details.xlsx",
    );
  };

  const ModalHeader = ({ title, subtitle, subtitleLabel, icon }: any) => (
    <DialogHeader className="px-10 py-8 bg-slate-900 text-white flex flex-row items-center justify-between space-y-0 border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
          {icon}
        </div>
        <div className="text-left">
          <DialogTitle className="text-xl font-black tracking-tight uppercase">
            {title} <span className="text-primary">{subtitle}</span>
          </DialogTitle>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
            {subtitleLabel}
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          setActiveModal(null);
          resetMonthly({});
          resetDegree({});
          resetCourse({});
          resetBio({});
        }}
        className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/50 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
    </DialogHeader>
  );

  const GenerationProgress = ({ progress, label }: any) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
          {progress}%
        </span>
      </div>
      <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  const DownloadReadyState = ({ onDownload, label }: any) => (
    <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
      <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-inner border border-emerald-100">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <div className="text-center">
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
          Report Prepared
        </h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
          Ready for download
        </p>
      </div>
      <button
        onClick={onDownload}
        className="w-full h-16 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-slate-800 mt-2 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
      >
        <Download className="w-5 h-5" />
        {label}
      </button>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <LayoutGrid className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Reports <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Analytics & Data Export
            </p>
          </div>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((card) => (
          <div
            key={card.id}
            onClick={() => (card.path ? navigate(card.path) : card.action?.())}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group flex flex-col items-center text-center gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:bg-primary/5" />
            <div className="p-4 bg-slate-50 rounded-3xl group-hover:bg-white group-hover:shadow-lg transition-all relative">
              {card.icon}
            </div>
            <div className="space-y-2 relative">
              <h3 className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                {card.description}
              </p>
            </div>
            <div className="mt-2 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Report Modal */}
      <Dialog
        open={activeModal === "monthly"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
          <ModalHeader
            title="Monthly"
            subtitle="Report"
            subtitleLabel="Consolidated monthly financial records"
            icon={<PieChart className="w-6 h-6 text-primary" />}
          />
          <div className="p-10 space-y-8">
            {!isGenerating && !downloadReady ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Select Month <span className="text-rose-500">*</span>
                  </label>
                  <Controller
                    control={monthlyControl}
                    name="month"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <MonthPicker
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full h-12 px-6 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    )}
                  />
                </div>
                <button
                  onClick={handleMonthlySubmit(onMonthlyGenerate)}
                  className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  Generate Report
                </button>
              </>
            ) : isGenerating ? (
              <GenerationProgress
                progress={generationProgress}
                label="Analyzing Transactions..."
              />
            ) : (
              <DownloadReadyState
                label="Download PDF"
                onDownload={handleMonthlySubmit(executeMonthlyDownload)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Degree Pending Modal */}
      <Dialog
        open={activeModal === "degree"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
          <ModalHeader
            title="Degree Pending"
            subtitle="Report"
            subtitleLabel="Outstanding fees by degree levels"
            icon={<CalendarClock className="w-6 h-6 text-primary" />}
          />
          <div className="p-10 space-y-8">
            {!isGenerating && !downloadReady ? (
              <div className="space-y-6">
                <AutocompleteInput
                  control={degreeControl}
                  errors={degreeErrors}
                  name="degreeId"
                  textLable="Academic Degree"
                  placeholderName="Select Degree"
                  requiredMsg="Required"
                  labelMandatory
                  options={degrees}
                  getOptionLabel={(opt: any) => opt.degreeName}
                  getOptionValue={(opt: any) => opt.id}
                  icon={<Building className="w-4 h-4 text-slate-400" />}
                />
                <AutocompleteInput
                  control={degreeControl}
                  errors={degreeErrors}
                  name="batch"
                  textLable="Admission Batch"
                  placeholderName="Select Batch"
                  requiredMsg="Required"
                  labelMandatory
                  options={batches}
                  getOptionLabel={(opt: any) => opt}
                  getOptionValue={(opt: any) => opt}
                  icon={<Calendar className="w-4 h-4 text-slate-400" />}
                />
                <button
                  onClick={handleDegreeSubmit(onDegreeGenerate)}
                  className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                >
                  <Download className="w-5 h-5" />
                  Generate Report
                </button>
              </div>
            ) : isGenerating ? (
              <GenerationProgress
                progress={generationProgress}
                label="Calculating Arrears..."
              />
            ) : (
              <DownloadReadyState
                label="Download PDF"
                onDownload={handleDegreeSubmit(executeDegreeDownload)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Course Pending Modal */}
      <Dialog
        open={activeModal === "course"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
          <ModalHeader
            title="Course Pending"
            subtitle="Report"
            subtitleLabel="Detailed overdue records by course"
            icon={<Monitor className="w-6 h-6 text-primary" />}
          />
          <div className="p-10 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
            {!isGenerating && !downloadReady ? (
              <div className="space-y-6">
                <AutocompleteInput
                  control={courseControl}
                  errors={courseErrors}
                  name="degreeId"
                  textLable="Academic Degree"
                  placeholderName="Select Degree"
                  requiredMsg="Required"
                  labelMandatory
                  options={degrees}
                  getOptionLabel={(opt: any) => opt.degreeName}
                  getOptionValue={(opt: any) => opt.id}
                  icon={<Building className="w-4 h-4 text-slate-400" />}
                />
                <AutocompleteInput
                  control={courseControl}
                  errors={courseErrors}
                  name="courseId"
                  textLable="Select Course"
                  placeholderName="Select Course"
                  requiredMsg="Required"
                  labelMandatory
                  disabled={!selectedDegreeForCourse}
                  options={courses}
                  getOptionLabel={(opt: any) => opt.courseName}
                  getOptionValue={(opt: any) => opt.id}
                  icon={<GraduationCap className="w-4 h-4 text-slate-400" />}
                />
                <AutocompleteInput
                  control={courseControl}
                  errors={courseErrors}
                  name="batch"
                  textLable="Admission Batch"
                  placeholderName="Select Batch"
                  requiredMsg="Required"
                  labelMandatory
                  options={batches}
                  getOptionLabel={(opt: any) => opt}
                  getOptionValue={(opt: any) => opt}
                  icon={<Calendar className="w-4 h-4 text-slate-400" />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <AutocompleteInput
                    control={courseControl}
                    errors={courseErrors}
                    name="sectionId"
                    textLable="Section"
                    placeholderName="Section"
                    requiredMsg="Required"
                    labelMandatory
                    disabled={!selectedCourseForCourse}
                    options={sections}
                    getOptionLabel={(opt: any) => opt.sectionName}
                    getOptionValue={(opt: any) => opt.id}
                    icon={<Filter className="w-4 h-4 text-slate-400" />}
                  />
                  <AutocompleteInput
                    control={courseControl}
                    errors={courseErrors}
                    name="semesterId"
                    textLable="Semester"
                    placeholderName="Semester"
                    options={semesters}
                    getOptionLabel={(opt: any) => opt.semesterName}
                    getOptionValue={(opt: any) => opt.id}
                    icon={<LayoutGrid className="w-4 h-4 text-slate-400" />}
                  />
                </div>
                <button
                  onClick={handleCourseSubmit(onCourseGenerate)}
                  className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                >
                  <Download className="w-5 h-5" />
                  Generate Report
                </button>
              </div>
            ) : isGenerating ? (
              <GenerationProgress
                progress={generationProgress}
                label="Compiling Course Data..."
              />
            ) : (
              <DownloadReadyState
                label="Download PDF"
                onDownload={handleCourseSubmit(executeCourseDownload)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Bio Details Modal */}
      <Dialog
        open={activeModal === "bio"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
          <ModalHeader
            title="Student Bio"
            subtitle="Report"
            subtitleLabel="Export comprehensive student information"
            icon={<UserCheck className="w-6 h-6 text-primary" />}
          />
          <div className="p-10 space-y-8">
            {!isGenerating && !downloadReady ? (
              <div className="space-y-6">
                <AutocompleteInput
                  control={bioControl}
                  errors={bioErrors}
                  name="batch"
                  textLable="Admission Batch"
                  placeholderName="Select Batch"
                  requiredMsg="Required"
                  labelMandatory
                  options={batches}
                  getOptionLabel={(opt: any) => opt}
                  getOptionValue={(opt: any) => opt}
                  icon={<Calendar className="w-4 h-4 text-slate-400" />}
                />
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
                  Generate a complete Excel workbook containing student
                  profiles, contact details, and academic history for the
                  selected batch.
                </p>
                <button
                  onClick={handleBioSubmit(onBioGenerate)}
                  className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                >
                  <Download className="w-5 h-5" />
                  Export Excel
                </button>
              </div>
            ) : isGenerating ? (
              <GenerationProgress
                progress={generationProgress}
                label="Packaging Bio Data..."
              />
            ) : (
              <DownloadReadyState
                label="Download Excel"
                onDownload={handleBioSubmit(executeBioDownload)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportDashboard;
