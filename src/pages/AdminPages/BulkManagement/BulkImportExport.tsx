import React, { useState } from "react";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  X,
  Loader2,
  ArrowRight,
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { bulkApi } from "@/services/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { saveAs } from "file-saver";

const BulkImportExport = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("master");

  const handleDownload = async (type: string) => {
    setLoading(`download-${type}`);
    try {
      // const apiType =
      //   type === "student"
      //     ? "studentV2"
      //     : type === "faculty"
      //       ? "facultyV2"
      //       : "master";
      const response = await bulkApi.exportDocument(type);
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // saveAs(blob, `${type}_template.xlsx`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}_template.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${type.toUpperCase()} template downloaded successfully`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download template");
    } finally {
      setLoading(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension !== "xlsx" && extension !== "xls") {
        toast.error("Please upload only Excel files (.xlsx or .xls)");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (type: string) => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(`upload-${type}`);
    try {
      const apiType =
        type === "student"
          ? "studentV2"
          : type === "faculty"
            ? "facultyV2"
            : "master";
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await bulkApi.bulkUpload(apiType, formData);
      if (response.data.status === "SUCCESS" || response.status === 200) {
        toast.success("Document uploaded and processed successfully");
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById(
          `file-upload-${type}`,
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
    } finally {
      setLoading(null);
    }
  };

  const renderTabContent = (type: string, title: string) => (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Export Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 group-hover:bg-amber-100 transition-colors" />

        <div className="relative z-10">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-8 group-hover:scale-110 transition-transform duration-500">
            <Download className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase mb-4">
            Export {title}
          </h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 max-w-sm">
            Download the standard template for {title.toLowerCase()}. Use this
            to ensure your data follows the required format before re-uploading.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100/50">
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Standard Format
                </p>
                <p className="text-xs font-bold text-slate-600">
                  All columns must be preserved in their original order for
                  successful processing.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleDownload(type)}
            disabled={loading !== null}
            className="w-full h-16 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {loading === `download-${type}` ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Template
              </>
            )}
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-10 shadow-2xl group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 group-hover:bg-primary/20 transition-colors" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/5">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-4">
            Import {title}
          </h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 max-w-sm">
            Bulk upload your {title.toLowerCase()} records. Select your
            formatted Excel file to begin the validation and sync process.
          </p>

          <div className="flex-1 space-y-6">
            <div
              className={`relative border-2 border-dashed rounded-[1.5rem] p-8 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer
                ${selectedFile ? "border-primary bg-primary/5" : "border-slate-800 bg-white/5 hover:bg-white/[0.07] hover:border-slate-700"}`}
              onClick={() =>
                document.getElementById(`file-upload-${type}`)?.click()
              }
            >
              <input
                id={`file-upload-${type}`}
                type="file"
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleFileSelect}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-4 shadow-inner">
                    <FileSpreadsheet className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-black text-white uppercase tracking-tight max-w-[200px] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 mb-4">
                    <FileSpreadsheet className="w-6 h-6 opacity-50" />
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em]">
                    Click to browse files
                  </p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase mt-2">
                    Support: .xlsx, .xls
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedFile(null)}
                disabled={!selectedFile || loading !== null}
                className="h-14 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/5 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpload(type)}
                disabled={!selectedFile || loading !== null}
                className="h-14 bg-primary hover:bg-primary/90 disabled:bg-primary/30 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {loading === `upload-${type}` ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Process Sync
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
      {/* Hero Header */}
      <div className="relative bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-primary/5 rounded-full -mr-[50px] -mt-[50px] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[100px] h-[100px] bg-indigo-50 rounded-full -ml-[50px] -mb-[50px] blur-[80px] pointer-events-none opacity-50" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  Secure Data Sync
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-4 uppercase">
              Bulk Data <span className="text-primary">Operations</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium max-w-lg leading-relaxed">
              Automate your administrative workflows with high-speed bulk data
              operations. Export standard templates or import thousands of
              records in seconds.
            </p>
          </div>

          {/* <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-200 overflow-hidden shadow-sm"
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                System Status
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">
                  Ready for Sync
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs
        defaultValue="master"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <TabsList className="bg-slate-100/50 p-1 rounded-2xl border border-slate-100 w-full sm:w-auto h-auto flex-nowrap overflow-x-auto no-scrollbar justify-start">
            <TabsTrigger
              value="master"
              className="px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all duration-300 flex-shrink-0"
            >
              Master Details
            </TabsTrigger>
            <TabsTrigger
              value="student"
              className="px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all duration-300 flex-shrink-0"
            >
              Student Details
            </TabsTrigger>
            <TabsTrigger
              value="faculty"
              className="px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all duration-300 flex-shrink-0"
            >
              Faculty Details
            </TabsTrigger>
          </TabsList>

          <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <Zap className="w-4 h-4 text-indigo-500" />
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
              Speed optimized
            </p>
          </div>
        </div>

        <TabsContent value="master">
          {renderTabContent("master", "Master Details")}
        </TabsContent>
        <TabsContent value="student">
          {renderTabContent("student", "Student Details")}
        </TabsContent>
        <TabsContent value="faculty">
          {renderTabContent("faculty", "Faculty Details")}
        </TabsContent>
      </Tabs>

      {/* Guidelines Section */}
      <div className="bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100/50 p-10">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Pre-Upload Check-list
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "File Format",
              desc: "Only .xlsx or .xls files are supported.",
            },
            {
              title: "Data Headers",
              desc: "Do not modify or delete column headers.",
            },
            {
              title: "Data Types",
              desc: "Ensure date and numeric fields match the format.",
            },
            {
              title: "Size Limit",
              desc: "Keep files under 10MB for optimal performance.",
            },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                {item.title}
              </p>
              <p className="text-xs font-bold text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BulkImportExport;
