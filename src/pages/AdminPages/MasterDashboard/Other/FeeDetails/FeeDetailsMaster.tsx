import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  Loader2,
  ReceiptIndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";

const FeeDetailsMaster = () => {
  const navigate = useNavigate();
  const [listLoading, setListLoading] = useState(true);
  const [feeDetails, setFeeDetails] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;

  const fetchFeeDetails = async () => {
    setListLoading(true);
    try {
      const response = await masterApi.getFeeDetailsList({
        searchStr: searchQuery,
        pageNumber: currentPage - 1,
      });
      setFeeDetails(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching fee details:", error);
      toast.error("Failed to load fee details");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeeDetails();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this fee detail?"))
      return;

    try {
      await masterApi.deleteFeeDetails(id);
      toast.success("Fee detail deleted successfully");
      fetchFeeDetails();
    } catch (error) {
      console.error("Error deleting fee detail:", error);
      toast.error("Failed to delete fee detail");
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/admin/master")}
            className="p-2.5 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-primary border border-transparent hover:border-slate-100 shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Fee <span className="text-primary">Details</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Financial Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/master/fee-details/add")}
          className="w-full sm:w-auto bg-primary text-white font-black text-[10px] py-4 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
        >
          <ReceiptIndianRupee className="w-4 h-4" />
          Create New Fee Detail
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
        <div className="px-6 sm:px-10 py-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-black text-slate-800 text-base uppercase tracking-tight">
              Fee Details List
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Institutional Financial Records
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Fee Type / Name"
              className="pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-[11px] font-bold w-full focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {listLoading ? (
            <div className="px-6 py-24 text-center">
              <div className="flex flex-col items-center gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Synchronizing Data...
                </span>
              </div>
            </div>
          ) : feeDetails.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                        S.No
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Payment Mode
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Classification
                      </th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Fee Identity
                      </th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Partial
                      </th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Discount
                      </th>
                      <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                        Control
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {feeDetails.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/30 transition-colors group"
                      >
                        <td className="px-10 py-5 text-xs font-black text-slate-300">
                          {((currentPage - 1) * rowsPerPage + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
                            {item.paymentType}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[11px] font-black text-primary uppercase tracking-tight px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                            {item.feeType}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-black text-slate-800">
                            {item.feeName}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.partiallyPayable ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-transparent"}`}
                          >
                            {item.partiallyPayable ? "Active" : "None"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.discountFlag ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-transparent"}`}
                          >
                            {item.discountFlag ? "Active" : "None"}
                          </span>
                        </td>
                        <td className="px-10 py-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/master/fee-details/edit/${item.id}`,
                                )
                              }
                              className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-500 hover:border-emerald-100 hover:shadow-sm rounded-xl transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-sm rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Minimal Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {feeDetails.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 hover:bg-slate-50 transition-colors active:bg-slate-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2.5 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-widest border border-primary/20">
                            {item.paymentType}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {item.feeType}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-black text-slate-800 leading-tight tracking-tight">
                            {item.feeName}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-2 h-2 rounded-full ${item.partiallyPayable ? "bg-emerald-500" : "bg-slate-200"}`}
                            />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Partial
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-2 h-2 rounded-full ${item.discountFlag ? "bg-emerald-500" : "bg-slate-200"}`}
                            />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Discount
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/master/fee-details/edit/${item.id}`,
                            )
                          }
                          className="p-3.5 bg-white border border-slate-100 text-primary rounded-2xl shadow-sm active:scale-95"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-3.5 bg-white border border-slate-100 text-rose-400 rounded-2xl shadow-sm active:scale-95"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-10 py-24 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-slate-300">
                <ReceiptIndianRupee className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-bold text-sm">
                No financial records found.
              </p>
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mt-2">
                Adjust your search parameters or create a new detail.
              </p>
            </div>
          )}
        </div>

        <div className="px-10 py-6 border-t border-slate-100 flex items-center justify-end bg-white min-h-[80px]">
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

export default FeeDetailsMaster;
