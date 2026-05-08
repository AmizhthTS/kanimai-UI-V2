import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  RotateCcw,
  Save,
  Loader2,
  BusFront,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";

const TransportMaster = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [transports, setTransports] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      routeId: "",
      vehNumber: "",
      driverName: "",
      driverNumber: "",
    },
  });

  const fetchRoutes = async () => {
    try {
      const response = await masterApi.getAllRoutes();
      setRoutes(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchTransports = async () => {
    setListLoading(true);
    try {
      const response = await masterApi.getTransportList({
        searchStr: searchQuery,
        pageNumber: currentPage - 1,
      });
      setTransports(response.data.responseModelList || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching transports:", error);
      toast.error("Failed to load transport list");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransports();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Ensure routeId is correctly formatted if it's an object from Autocomplete
      const payload = {
        ...data,
        routeId:
          typeof data.routeId === "object" ? data.routeId.id : data.routeId,
      };

      await masterApi.saveTransport(payload);
      toast.success(
        data.id
          ? "Transport updated successfully"
          : "Transport saved successfully",
      );
      reset({
        id: "",
        routeId: "",
        vehNumber: "",
        driverName: "",
        driverNumber: "",
      });
      fetchTransports();
    } catch (error) {
      console.error("Error saving transport:", error);
      toast.error("Failed to save transport");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transport: any) => {
    // Map ID to object for Autocomplete
    const routeObj = routes.find(
      (r) => r.id.toString() === transport.routeId.toString(),
    );

    reset({
      id: transport.id,
      routeId: routeObj || transport.routeId,
      vehNumber: transport.vehNumber,
      driverName: transport.driverName,
      driverNumber: transport.driverNumber,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm("Are you sure you want to delete this transport record?")
    )
      return;

    try {
      await masterApi.deleteTransport(id);
      toast.success("Transport record deleted successfully");
      fetchTransports();
    } catch (error) {
      console.error("Error deleting transport:", error);
      toast.error("Failed to delete transport record");
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
              Transport <span className="text-primary">Details</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Fleet Management
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">
                {watch("id") ? "Update Transport" : "Add Transport"}
              </h3>
            </div>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="p-6 space-y-5"
            >
              <AutocompleteInput
                control={control}
                errors={errors}
                name="routeId"
                textLable="Route Name"
                placeholderName="Select Route"
                requiredMsg="Route is required"
                labelMandatory
                options={routes}
                getOptionLabel={(opt: any) => opt.routeName}
                getOptionValue={(opt: any) => opt.id}
                // onChangeValue={(val: any) => setValue("routeId", val?.id || "")}
              />

              <TextInput
                control={control}
                errors={errors}
                name="vehNumber"
                textLable="Vehicle Number"
                placeholderName="Enter Vehicle Number"
                requiredMsg="Vehicle number is required"
                labelMandatory
              />

              <TextInput
                control={control}
                errors={errors}
                name="driverName"
                textLable="Driver Name"
                placeholderName="Enter Driver Name"
                requiredMsg="Driver name is required"
                labelMandatory
              />

              <TextInput
                control={control}
                errors={errors}
                name="driverNumber"
                textLable="Driver Phone Number"
                placeholderName="Enter Phone Number"
                requiredMsg="Driver phone number is required"
                labelMandatory
              />

              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  {watch("id") ? "UPDATE" : "SAVE"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    reset({
                      id: "",
                      routeId: "",
                      vehNumber: "",
                      driverName: "",
                      driverNumber: "",
                    })
                  }
                  className="px-4 py-3.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 font-bold text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  RESET
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
                  Transport List
                </h3>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Vehicle Number"
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
                      Route Name
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Vehicle Number
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Driver Name
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
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
                  ) : transports.length > 0 ? (
                    transports.map((transport, index) => (
                      <tr
                        key={transport.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">
                          {((currentPage - 1) * rowsPerPage + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700">
                            {transport.routeName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700">
                            {transport.vehNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-600">
                            {transport.driverName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-600">
                            {transport.driverNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(transport)}
                              className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {/* <button
                              onClick={() => handleDelete(transport.id)}
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
                        No transport records found matching your search.
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

export default TransportMaster;
