import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Calendar,
  Backpack,
  Palmtree,
  School,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { masterApi, dashboardApi } from "@/services/api";
import { toast } from "sonner";
import CustomPagination from "@/components/ui/CustomPagination";
import { format, parse } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.type || "college");
  const [listLoading, setListLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;

  const renderDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      // Primary format from backend: dd/MM/yyyy
      let parsed = parse(dateStr, "dd/MM/yyyy", new Date());
      if (!isNaN(parsed.getTime())) {
        return format(parsed, "dd-MMM-yyyy");
      }

      // Secondary format: dd-MMM-yyyy
      parsed = parse(dateStr, "dd-MMM-yyyy", new Date());
      if (!isNaN(parsed.getTime())) {
        return format(parsed, "dd-MMM-yyyy");
      }

      const native = new Date(dateStr);
      if (!isNaN(native.getTime())) {
        return format(native, "dd-MMM-yyyy");
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  const fetchEvents = async () => {
    setListLoading(true);
    try {
      let response;
      const req = {
        searchStr: searchQuery,
        pageNumber: currentPage - 1,
      };

      if (activeTab === "college") {
        response = await dashboardApi.getCollegeList();
      } else if (activeTab === "holiday") {
        response = await dashboardApi.getHolidayList();
      } else {
        // Course events
        response = await dashboardApi.getCourseList();
      }

      const data = response.data.responseModelList || [];

      // Local search filtering if API doesn't support it for these specific endpoints
      const filtered = data.filter((item: any) =>
        item.eventName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setEvents(filtered);
      setTotalCount(filtered.length);
    } catch (error) {
      console.error("Error fetching event list:", error);
      toast.error("Failed to load events");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, activeTab]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await masterApi.deleteEvent(id);
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
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
              Event <span className="text-primary">Master</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              College Activities & Schedule
            </p>
          </div>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="bg-white border border-slate-100 p-1 rounded-xl h-auto">
            <TabsTrigger
              value="college"
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg flex items-center gap-2"
            >
              <School className="w-3 h-3" />
              College Events
            </TabsTrigger>
            <TabsTrigger
              value="holiday"
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg flex items-center gap-2"
            >
              <Palmtree className="w-3 h-3" />
              Holidays
            </TabsTrigger>
            <TabsTrigger
              value="course"
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg flex items-center gap-2"
            >
              <Backpack className="w-3 h-3" />
              Course Events
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-medium w-full sm:w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={() =>
              navigate("/admin/master/event/add", {
                state: { type: activeTab },
              })
            }
            className="bg-primary text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">
                  S.No
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Event Name
                </th>
                {activeTab === "course" && (
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Course
                  </th>
                )}
                {activeTab === "holiday" ? (
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Date
                  </th>
                ) : (
                  <>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      End Date
                    </th>
                  </>
                )}
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                  Days
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {listLoading ? (
                <tr>
                  <td
                    colSpan={
                      activeTab === "holiday"
                        ? 5
                        : activeTab === "course"
                          ? 7
                          : 6
                    }
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Fetching {activeTab} data...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : events.length > 0 ? (
                events.map((event, index) => (
                  <tr
                    key={event.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">
                      {((currentPage - 1) * rowsPerPage + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">
                          {event.eventName}
                        </span>
                        {event.eventDescription && (
                          <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[250px]">
                            {event.eventDescription}
                          </span>
                        )}
                      </div>
                    </td>
                    {activeTab === "course" && (
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-primary uppercase tracking-tight">
                          {event.courseName || "-"}
                        </span>
                      </td>
                    )}
                    {activeTab === "holiday" ? (
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-600">
                          {renderDate(event.startDate)}
                        </span>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-600">
                            {renderDate(event.startDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-600">
                            {renderDate(event.endDate)}
                          </span>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {event.noOfDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/master/event/edit/${event.id}`, {
                              state: { type: activeTab },
                            })
                          }
                          className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {/* <button
                          onClick={() => handleDelete(event.id)}
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
                    colSpan={
                      activeTab === "holiday"
                        ? 5
                        : activeTab === "course"
                          ? 7
                          : 6
                    }
                    className="px-6 py-20 text-center text-slate-400 italic text-sm"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Calendar className="w-8 h-8 opacity-20" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-500 not-italic">
                          No {activeTab} events found
                        </p>
                        <p className="text-[10px] uppercase tracking-widest font-bold">
                          Try adjusting your search or category
                        </p>
                      </div>
                    </div>
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

export default EventMaster;
