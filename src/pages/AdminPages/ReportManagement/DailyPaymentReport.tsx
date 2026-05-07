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
    <div className="space-y-6 pb-10 animate-in fade-in duration-700 overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/report")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Report -{" "}
              <span className="text-primary">Daily Payment Report</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Financial Transaction Records
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownload("excel")}
            disabled={downloading}
            className="px-6 py-3 bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all flex items-center gap-2 border border-emerald-100 disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            Download Excel
          </button>
          <button
            onClick={() => handleDownload("pdf")}
            disabled={downloading}
            className="px-6 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Download PDF
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              placeholder="NAME / ID"
              className="w-full pl-12 pr-4 h-12 bg-slate-50/50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-400"
              value={watchedValues.searchQuery}
              onChange={(e) => setValue("searchQuery", e.target.value)}
            />
          </div>

          <button
            onClick={resetFilters}
            className="h-12 bg-rose-50 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto scrollbar-none">
          <table className="border-collapse w-full table-fixed">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-3 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest w-[5%]">
                  S.No
                </th>
                <th className="px-3 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest w-[10%]">
                  Date
                </th>
                <th className="px-3 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest w-[15%]">
                  Student Name
                </th>
                <th className="px-3 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest w-[10%]">
                  ID
                </th>
                <th className="px-3 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest w-[10%]">
                  Course
                </th>
                <th className="px-3 py-5 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest w-[5%]">
                  Batch
                </th>
                <th className="px-3 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest w-[10%]">
                  Type
                </th>
                <th className="px-3 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest w-[15%]">
                  Fee Name
                </th>
                <th className="px-3 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest w-[10%]">
                  Amount
                </th>
                <th className="px-3 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest w-[10%]">
                  Mode
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-20 text-center">
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
                    <td className="px-3 py-4 text-[10px] font-bold text-slate-300">
                      {((currentPage - 1) * rowsPerPage + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="px-3 py-4 text-[10px] font-bold text-slate-600 truncate">
                      {row.dateStr}
                    </td>
                    <td
                      className="px-3 py-4 text-[11px] font-black text-slate-800 truncate"
                      title={row.studentName}
                    >
                      {row.studentName}
                    </td>
                    <td className="px-3 py-4 text-[10px] font-bold text-slate-500 uppercase truncate">
                      {row.studentId}
                    </td>
                    <td className="px-3 py-4 text-[10px] font-black text-slate-700 truncate">
                      {row.course}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600">
                        {row.batch}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-[9px] font-bold text-slate-500 uppercase truncate">
                      {row.feeType}
                    </td>
                    <td className="px-3 py-4 text-[9px] font-bold text-slate-400 leading-tight">
                      <div className="line-clamp-2" title={row.feeName}>
                        {row.feeName}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-[11px] font-black text-slate-800 text-right">
                      ₹{parseFloat(row.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-4">
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest">
                        {row.paymentMode}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-20 text-center text-slate-400 italic text-sm"
                  >
                    No transaction records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-4 border-t border-slate-100 bg-white flex items-center justify-between min-h-[60px]">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Showing {reportData.length} of {totalCount} Records
          </div>
          <div>
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
