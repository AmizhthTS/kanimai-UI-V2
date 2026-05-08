import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Download,
  Loader2,
  RotateCcw,
  Calendar,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { reportApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import DateRangePickerInput from "@/components/Inputs/DateRangePickerInput";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DailyPaymentReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [batches, setBatches] = useState<any[]>([]);

  // Form setup
  const { control, watch, reset, setValue } = useForm({
    defaultValues: {
      dateRange: { from: new Date(), to: new Date() },
      batch: "All Batch",
      searchQuery: "",
    },
  });

  const watchedValues = watch();

  const generateBatchList = () => {
    const currentYear = new Date().getFullYear();
    const minYears = 4;
    const batchList = [];
    for (let i = currentYear; i > currentYear - minYears; i--) {
      batchList.push(i.toString());
    }
    setBatches(batchList);
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { dateRange, batch, searchQuery } = watchedValues;
      const startDate = dateRange?.from
        ? format(dateRange.from, "dd/MM/yyyy")
        : "";
      const endDate = dateRange?.to
        ? format(dateRange.to, "dd/MM/yyyy")
        : startDate;

      const response = await reportApi.getDailyPaymentReport({
        startDate,
        endDate,
        pageNumber: currentPage - 1,
        searchStr: searchQuery,
        batch: batch === "All Batch" ? "" : batch,
      });
      setReportData(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching daily payment report:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateBatchList();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReport();
    }, 400);
    return () => clearTimeout(timer);
  }, [
    watchedValues.dateRange,
    watchedValues.batch,
    watchedValues.searchQuery,
    currentPage,
  ]);

  const handleDownload = async (fileFormat: string) => {
    setDownloading(true);
    try {
      const { dateRange, batch } = watchedValues;
      const startDate = dateRange?.from
        ? format(dateRange.from, "dd/MM/yyyy")
        : "";
      const endDate = dateRange?.to
        ? format(dateRange.to, "dd/MM/yyyy")
        : startDate;

      const payload = {
        fileType: fileFormat,
        startDate,
        endDate,
        batch: batch === "All Batch" ? "" : batch,
      };
      const response = await reportApi.downloadDailyPaymentReport(payload);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Daily_Payment_Report_${startDate.replace(/\//g, "-")}_to_${endDate.replace(/\//g, "-")}.${fileFormat === "excel" ? "xlsx" : "pdf"}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  const resetFilters = () => {
    reset({
      dateRange: { from: new Date(), to: new Date() },
      batch: "All Batch",
      searchQuery: "",
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-700 overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/report")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
              Report -{" "}
              <span className="text-primary">Daily Payment Report</span>
            </h1>
            <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Financial Transaction Records
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <button
            onClick={() => handleDownload("excel")}
            disabled={downloading}
            className="flex-1 lg:flex-none px-4 sm:px-6 py-3 bg-emerald-50 text-emerald-600 font-black text-[9px] sm:text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 border border-emerald-100 disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Download</span> Excel
          </button>
          <button
            onClick={() => handleDownload("pdf")}
            disabled={downloading}
            className="flex-1 lg:flex-none px-4 sm:px-6 py-3 bg-slate-900 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Download</span> PDF
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="w-full">
            <DateRangePickerInput
              control={control}
              errors={{}}
              name="dateRange"
              textLable=""
              placeholderName="Select Date Range"
              disabledDates={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
            />
          </div>

          <Select
            onValueChange={(value) => setValue("batch", value)}
            value={watchedValues.batch || ""}
          >
            <SelectTrigger className="w-full h-12 px-4 py-3 bg-slate-50/50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="BATCH" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
              <SelectItem
                value="All Batch"
                className="text-[10px] font-black uppercase py-3"
              >
                ALL BATCH
              </SelectItem>
              {batches.map((batch) => (
                <SelectItem
                  key={batch}
                  value={batch}
                  className="text-[10px] font-black uppercase py-3"
                >
                  {batch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="SEARCH NAME / ID..."
              className="w-full pl-12 pr-4 h-12 bg-slate-50/50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-400"
              value={watchedValues.searchQuery}
              onChange={(e) => setValue("searchQuery", e.target.value)}
            />
          </div>

          <button
            onClick={resetFilters}
            className="h-12 bg-rose-50 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Data Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[50vh]">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="border-collapse w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest w-16">
                  S.No
                </th>
                <th className="px-6 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest w-32">
                  Date
                </th>
                <th className="px-6 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Student Details
                </th>
                <th className="px-6 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Academic Info
                </th>
                <th className="px-6 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Transaction Details
                </th>
                <th className="px-6 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest w-40">
                  Amount & Mode
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Fetching Report Data...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : reportData.length > 0 ? (
                reportData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5 text-[10px] font-bold text-slate-300">
                      {((currentPage - 1) * rowsPerPage + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">
                        {row.dateStr}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 uppercase truncate max-w-[180px]">
                          {row.studentName}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          ID: {row.studentId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-700 uppercase truncate max-w-[150px]">
                          {row.course}
                        </span>
                        <span className="w-fit px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                          BATCH: {row.batch}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">
                          {row.feeType}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 line-clamp-1 max-w-[200px]">
                          {row.feeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[11px] font-black text-slate-800">
                          ₹{parseFloat(row.amount).toLocaleString("en-IN")}
                        </span>
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest">
                          {row.paymentMode}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-24 text-center text-slate-400 italic text-sm"
                  >
                    No transaction records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card View */}
        <div className="lg:hidden p-4 space-y-4">
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Loading Records...
              </span>
            </div>
          ) : reportData.length > 0 ? (
            reportData.map((row, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[11px] font-black text-slate-800 truncate uppercase">
                        {row.studentName}
                      </h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        ID: {row.studentId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-black text-slate-800">
                      ₹{parseFloat(row.amount).toLocaleString("en-IN")}
                    </span>
                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter mt-0.5">
                      {row.paymentMode}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Transaction Date
                    </p>
                    <p className="text-[10px] font-black text-slate-700 uppercase">
                      {row.dateStr}
                    </p>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Academic Batch
                    </p>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                      {row.batch}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      Fee Component
                    </span>
                    <span className="text-[8px] font-black text-primary uppercase tracking-widest">
                      {row.feeType}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 leading-tight">
                    {row.feeName}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-400 italic text-sm">
              No transactions found
            </div>
          )}
        </div>

        {/* Footer & Pagination */}
        <div className="px-4 sm:px-8 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 min-h-[70px]">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] order-2 sm:order-1">
            Showing {reportData.length} of {totalCount} Records
          </div>
          <div className="order-1 sm:order-2">
            {totalCount > rowsPerPage && (
              <CustomPagination
                totalPages={Math.ceil(totalCount / rowsPerPage)}
                page={currentPage - 1}
                onPageChange={(_: any, newPage: number) =>
                  setCurrentPage(newPage + 1)
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPaymentReport;
