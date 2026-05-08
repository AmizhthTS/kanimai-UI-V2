import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  RotateCcw,
  Save,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";

const DepartmentMaster = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      department: "",
    },
  });

  const fetchDepartments = async () => {
    setListLoading(true);
    try {
      const response = await masterApi.getDepartmentList({
        searchStr: searchQuery,
        pageNumber: currentPage - 1,
      });
      setDepartments(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load department list");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDepartments();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      await masterApi.saveDepartment(data);
      toast.success(
        data.id
          ? "Department updated successfully"
          : "Department saved successfully",
      );
      reset({ id: "", department: "" });
      fetchDepartments();
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dept: any) => {
    reset({
      id: dept.id,
      department: dept.department,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    try {
      await masterApi.deleteDepartment(id);
      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department");
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
              Department <span className="text-primary">Details</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Faculty Configuration
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <div className="w-1.5 h-4 bg-primary rounded-full" />
                {control._formValues.id
                  ? "Update Department"
                  : "New Department"}
              </h3>
            </div>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="p-6 space-y-5"
            >
              <TextInput
                control={control}
                errors={errors}
                name="department"
                textLable="Department Name"
                placeholderName="Enter Department Name"
                requiredMsg="Department Name is required"
                labelMandatory
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {control._formValues.id ? "UPDATE" : "SAVE"}
                </button>
                <button
                  type="button"
                  onClick={() => reset({ id: "", department: "" })}
                  className="px-4 py-3.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Department List
                </h3>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Department Name"
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
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Department Name
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {listLoading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          <span className="text-xs font-bold uppercase tracking-widest">
                            Fetching data...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : departments.length > 0 ? (
                    departments.map((dept, index) => (
                      <tr
                        key={dept.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">
                          {((currentPage - 1) * rowsPerPage + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700">
                            {dept.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(dept)}
                              className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {/* <button
                              onClick={() => handleDelete(dept.id)}
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
                        colSpan={3}
                        className="px-6 py-12 text-center text-slate-400 italic text-sm"
                      >
                        No departments found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-2 border-t border-slate-100 flex items-center justify-end bg-white mt-auto min-h-[60px]">
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
      </div>
    </div>
  );
};

export default DepartmentMaster;
