import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Loader2,
  User,
  Building,
  Eye,
  RotateCcw,
  Briefcase,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi, facultyApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FacultyBioList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 10;

  // const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<any>("");
  const departments = [
    { id: "0", deptName: "All" },
    { id: "1", deptName: "Teaching Staff" },
    { id: "2", deptName: "Non Teaching Staff" },
  ];
  // const fetchInitialData = async () => {
  //   try {
  //     const response = await masterApi.getDepartmentList({});
  //     setDepartments(response.data?.responseModelList || []);
  //   } catch (error) {
  //     console.error("Error fetching departments:", error);
  //   }
  // };

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await facultyApi.getFacultyList({
        searchStr: searchQuery,
        staffCategoryId: selectedDept === "0" ? "" : selectedDept,
        pageNumber: currentPage - 1,
      });
      setFaculties(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      toast.error("Failed to load faculty list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFaculties();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, selectedDept]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDept("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner shrink-0">
            <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Faculty <span className="text-primary">Bio Information</span>
            </h1>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Staff & Academic Records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate("/admin/faculty/bio/add")}
            className="flex-1 md:flex-none px-6 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add New Faculty
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-400 placeholder:font-bold placeholder:uppercase placeholder:text-[9px] placeholder:tracking-widest"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="w-full">
            <Select onValueChange={setSelectedDept} value={selectedDept || ""}>
              <SelectTrigger className="w-full h-auto px-4 py-3 bg-slate-50 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <SelectValue placeholder="DEPARTMENT" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white">
                {departments.map((dept) => (
                  <SelectItem
                    key={dept.id}
                    value={dept.id.toString()}
                    className="text-[10px] font-black uppercase py-3"
                  >
                    {dept.deptName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={resetFilters}
            className="w-full h-auto py-3.5 bg-rose-50 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Faculty List */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[50vh]">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                  S.No
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Faculty Details
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Department & Desig
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Qualification & Exp
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Syncing Records...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : faculties.length > 0 ? (
                faculties.map((faculty, index) => (
                  <tr
                    key={faculty.id}
                    className="hover:bg-slate-50/50 transition-all group"
                  >
                    <td className="px-8 py-5 text-sm font-black text-slate-300">
                      {((currentPage - 1) * rowsPerPage + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:bg-primary group-hover:text-white transition-all overflow-hidden shrink-0">
                          {faculty.facultyImage ? (
                            <img
                              src={faculty.facultyImage}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            faculty.facultyName?.charAt(0)
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">
                            {faculty.facultyName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {faculty.facultyId || faculty.employeeId || "NO ID"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-700 uppercase">
                          {faculty.course || "-"}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          {faculty.designationName}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail className="w-3 h-3 text-primary/60" />
                          <span className="text-[10px] font-bold">
                            {faculty.emailId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <GraduationCap className="w-3 h-3 text-primary/60" />
                          <span className="text-[10px] font-bold">
                            {faculty.yearsOfExp || 0} Years Exp
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            navigate(`/admin/faculty/bio/view/${faculty.id}`)
                          }
                          className="p-2 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-lg transition-all"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/faculty/bio/edit/${faculty.id}`)
                          }
                          className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg transition-all"
                        >
                          <Edit className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td> */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/faculty/bio/view/${faculty.id}`)
                          }
                          className="p-2.5 hover:bg-primary/5 text-slate-400 hover:text-primary rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/faculty/bio/edit/${faculty.id}`)
                          }
                          className="p-2.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-xl transition-all"
                          title="Edit Bio"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center text-slate-400 italic text-sm"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex-1 p-4 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Syncing...
              </span>
            </div>
          ) : faculties.length > 0 ? (
            faculties.map((faculty) => (
              <div
                key={faculty.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-50">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black overflow-hidden shrink-0">
                    {faculty.facultyImage ? (
                      <img
                        src={faculty.facultyImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      faculty.facultyName?.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-slate-800 truncate uppercase">
                      {faculty.facultyName}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {faculty.facultyId || faculty.employeeId || "No ID"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Department
                    </p>
                    <p className="text-[10px] font-black text-slate-700 truncate uppercase">
                      {faculty.course || "General"}
                    </p>
                  </div>
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Experience
                    </p>
                    <p className="text-[10px] font-black text-slate-700 truncate uppercase">
                      {faculty.yearsOfExp || 0} Years
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/faculty/bio/view/${faculty.id}`)
                    }
                    className="flex-1 py-2.5 bg-slate-50 text-slate-600 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-primary/5 hover:text-primary transition-all border border-slate-100 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/admin/faculty/bio/edit/${faculty.id}`)
                    }
                    className="flex-1 py-2.5 bg-primary/10 text-primary font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-400 italic text-sm">
              No faculty records found
            </div>
          )}
        </div>

        {/* Pagination Section */}
        <div className="px-4 sm:px-8 py-4 border-t border-slate-100 bg-white flex items-center justify-center sm:justify-end min-h-[70px]">
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
    </div>
  );
};

export default FacultyBioList;
