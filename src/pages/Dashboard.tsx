import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Banknote,
  Calendar as CalendarIcon,
  Bell,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Image as ImageIcon,
  CalendarDays,
  Maximize2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  addWeeks,
  subWeeks,
  parse
} from "date-fns";
import { dashboardApi } from "@/services/api";

const Dashboard = () => {
  const userName = sessionStorage.getItem("UserName") || "Admin";
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarMode, setCalendarMode] = useState<"month" | "week">("month");

  useEffect(() => {
    fetchDashboardData();
    fetchAllEvents();
    fetchGallery();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardApi.getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const [collegeRes, holidayRes, courseRes] = await Promise.all([
        dashboardApi.getCollegeList(),
        dashboardApi.getHolidayList(),
        dashboardApi.getCourseList(),
      ]);

      const allEvents = [
        ...(collegeRes.data.responseModelList || []).map((e: any) => ({ ...e, type: "College", color: "text-blue-500 bg-blue-50", iconColor: "bg-blue-500" })),
        ...(holidayRes.data.responseModelList || []).map((e: any) => ({ ...e, type: "Holiday", color: "text-emerald-500 bg-emerald-50", iconColor: "bg-emerald-500" })),
        ...(courseRes.data.responseModelList || []).map((e: any) => ({ ...e, type: "Course", color: "text-amber-500 bg-amber-50", iconColor: "bg-amber-500" })),
      ];

      allEvents.sort((a, b) => {
        const d1 = parse(a.startDate, "dd/MM/yyyy", new Date());
        const d2 = parse(b.startDate, "dd/MM/yyyy", new Date());
        return d1.getTime() - d2.getTime();
      });

      setEvents(allEvents);
      setNotices(allEvents.slice(0, 4));
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await dashboardApi.getGalleryList();
      setGallery(response.data.responseModelList || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, "dd/MM/yyyy");
    setSelectedDate(dateStr);
    
    // Filter events for this date
    const filtered = events.filter(e => e.startDate === dateStr);
    setSelectedEvents(filtered);
    setNotices(filtered.length > 0 ? filtered : events.slice(0, 4));
  };

  // Calendar logic
  const getCalendarDays = () => {
    const start = calendarMode === "month" 
      ? startOfWeek(startOfMonth(currentDate))
      : startOfWeek(currentDate);
    
    const end = calendarMode === "month"
      ? endOfWeek(endOfMonth(currentDate))
      : endOfWeek(currentDate);

    return eachDayOfInterval({ start, end });
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold uppercase tracking-widest text-xs">Loading Dashboard Data...</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Students", value: dashboardData?.totalStudents || "0", icon: Users, color: "bg-emerald-500", trend: "+12%" },
    { label: "Teaching Staff", value: dashboardData?.teachingStff || "0", icon: UserCheck, color: "bg-blue-500", trend: "+2%" },
    { label: "Non Teaching Staff", value: dashboardData?.nonTeachingStaff || "0", icon: UserMinus, color: "bg-amber-500", trend: "0%" },
    { label: "Yearly Total Earnings", value: `₹ ${(Number(dashboardData?.totalEarnings || 0) / 1000000).toFixed(1)}M`, icon: Banknote, color: "bg-teal-500", trend: "+8.4%" },
  ];

  const chartData = (dashboardData?.feeCollection || []).map((item: any) => ({
    month: item.month.substring(0, 3).toUpperCase(),
    amount: Number(item.feeValue) / 100000
  })).reverse();

  const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#84cc16", "#10b981", "#06b6d4", "#2dd4bf", "#3b82f6"];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Welcome back, <span className="text-primary">{userName}!</span> 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's a summary of the college activities today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <CalendarIcon className="w-4 h-4 text-primary" />
          {format(new Date(), "MMMM d, yyyy")}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden relative">
              <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-110", stat.color)} />
              <div className="flex flex-col gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Boards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fees Collection Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h3 className="font-bold text-slate-800">Fees Collection (Annual)</h3>
            </div>
            <button className="text-xs font-bold text-primary hover:underline">View Report</button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} dy={10}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} tickFormatter={(val) => `${val}L`}/>
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} formatter={(val: number) => [`₹ ${val} Lakhs`, 'Amount']}/>
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={24}>
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notice Board */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-amber-500 rounded-full" />
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" /> {selectedDate ? `Events: ${selectedDate}` : "Notice Board"}
              </h3>
            </div>
            {selectedDate && (
              <button 
                onClick={() => { setSelectedDate(null); setSelectedEvents([]); setNotices(events.slice(0, 4)); }}
                className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors underline uppercase"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex-1 space-y-4">
            {notices.length > 0 ? (
              notices.map((notice, i) => (
                <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-l-2 border-transparent hover:border-primary group">
                  <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-2 min-w-[50px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{notice.startDate.split('/')[1]}</span>
                    <span className="text-sm font-black text-slate-800">{notice.startDate.split('/')[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{notice.eventName || notice.eventDescription}</h4>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block", notice.color)}>
                      {notice.type}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">No active notices</div>
            )}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">View All Notices</button>
        </div>
      </div>

      {/* Calendar & Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-indigo-500" /> Event Calendar
                </h3>
              </div>
              <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                <button 
                  onClick={() => setCalendarMode("month")}
                  className={cn("px-2 py-0.5 text-[9px] font-bold rounded-md transition-all", calendarMode === "month" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600")}
                >
                  MONTH
                </button>
                <button 
                  onClick={() => setCalendarMode("week")}
                  className={cn("px-2 py-0.5 text-[9px] font-bold rounded-md transition-all", calendarMode === "week" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600")}
                >
                  WEEK
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                {format(currentDate, calendarMode === "month" ? "MMMM yyyy" : "'Week of' MMM d, yyyy")}
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentDate(calendarMode === "month" ? subMonths(currentDate, 1) : subWeeks(currentDate, 1))}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-400 transition-colors border border-slate-100"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-1.5 py-0.5 text-[9px] font-bold hover:bg-slate-100 rounded-md text-slate-500 transition-colors border border-slate-100"
                >
                  TODAY
                </button>
                <button 
                  onClick={() => setCurrentDate(calendarMode === "month" ? addMonths(currentDate, 1) : addWeeks(currentDate, 1))}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-400 transition-colors border border-slate-100"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider pb-1">{day}</div>
            ))}
            {getCalendarDays().map((date, i) => {
              const dayStr = format(date, "dd/MM/yyyy");
              const dayEvents = events.filter(e => e.startDate === dayStr);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isToday = isSameDay(date, new Date());
              const isSelected = selectedDate === dayStr;

              return (
                <div 
                  key={i} 
                  onClick={() => handleDateClick(date)}
                  className={cn(
                    "aspect-square max-h-12 relative flex flex-col items-center justify-center rounded-lg text-[11px] font-bold cursor-pointer transition-all border border-transparent",
                    !isCurrentMonth && calendarMode === "month" && "opacity-20",
                    isToday ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-slate-50 text-slate-600 hover:border-slate-100",
                    isSelected && !isToday && "border-primary bg-primary/5 text-primary"
                  )}
                >
                  {format(date, "d")}
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((e, idx) => (
                      <div key={idx} className={cn("w-0.5 h-0.5 rounded-full", 
                        e.type === "College" ? "bg-blue-400" : e.type === "Holiday" ? "bg-emerald-400" : "bg-amber-400"
                      )} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Details Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-blue-600 rounded-full" />
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" /> Event Details
            </h3>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-2">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", event.color)}>
                      {event.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {event.startDate} - {event.endDate}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{event.eventName}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {event.eventDescription}
                    </p>
                  </div>
                  
                  {event.courseName && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[10px] font-bold text-slate-600">Course: <span className="text-primary">{event.courseName}</span></span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="w-8 h-8 text-slate-200" />
                </div>
                <h4 className="text-sm font-bold text-slate-400">No date selected</h4>
                <p className="text-[10px] text-slate-400 mt-1">Select a date from the calendar to view detailed event information.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campus Gallery Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" /> Campus Gallery
            </h3>
          </div>
          <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            View All Media <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        
        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {gallery.slice(0, 6).map((item, i) => (
              <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm">
                <img 
                  src={item.galleryUrl || item.imageUrl || `https://source.unsplash.com/random/400x400?campus,college&sig=${i}`} 
                  alt="Gallery" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-slate-50 animate-pulse flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-slate-200" />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;

// --- End of Component ---

