import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  RotateCcw,
  Save,
  Loader2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import { useForm } from "react-hook-form";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";

const FacultySubjectMapping = () => {
  const navigate = useNavigate();
  const [listLoading, setListLoading] = useState(true);
  const [mappings, setMappings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;

  const fetchMappings = async () => {
    setListLoading(true);
    try {
      const response = await masterApi.getFacultySubjectMappingList({
        searchStr: searchQuery,
        pageNumber: currentPage - 1,
      });
      setMappings(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching mappings:", error);
      toast.error("Failed to load mapping list");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMappings();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const handleEdit = (mapping: any) => {
    navigate(`/admin/master/faculty-subject-mapping/edit/${mapping.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this mapping?"))
      return;
    try {
      await masterApi.deleteFacultySubjectMapping(id);
      toast.success("Mapping deleted successfully");
      fetchMappings();
    } catch (error) {
      console.error("Error deleting mapping:", error);
      toast.error("Failed to delete mapping");
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/master")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Faculty Subject <span className="text-primary">Mapping</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Academic Assignment
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/master/faculty-subject-mapping/add")}
          className="bg-primary text-white font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 group"
        >
          <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
          ADD MAPPING
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[60vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-800 text-sm">Mapping List</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty / subject..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-medium w-full sm:w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">
                  S.No
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Degree
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Faculty Name
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  No of Subjects
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {listLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Fetching data...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : mappings.length > 0 ? (
                mappings.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">
                      {((currentPage - 1) * rowsPerPage + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                      {item.degreeName}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                      {item.courseName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">
                        {item.facultyName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-black">
                        {item.subjectCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {/* <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400 italic text-sm"
                  >
                    No mappings found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-2 border-t border-slate-100 flex items-center justify-end bg-white mt-auto min-h-[60px]">
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
  );
};

export default FacultySubjectMapping;
