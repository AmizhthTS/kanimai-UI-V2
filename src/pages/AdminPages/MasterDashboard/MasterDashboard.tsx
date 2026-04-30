import React from "react";
import {
  GraduationCap,
  Calendar,
  ClipboardList,
  BookOpen,
  LayoutGrid,
  BookMarked,
  Layers,
  Building2,
  UserCog,
  Clock,
  CalendarRange,
  Timer,
  BusFront,
  MapPinned,
  CarFront,
  Presentation,
  Image,
  ReceiptIndianRupee,
  Puzzle,
  Users,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MasterDashboard = () => {
  const navigate = useNavigate();
  const categories = [
    {
      title: "Academic",
      items: [
        { name: "DEGREE", icon: GraduationCap, path: "/admin/master/degree" },
        { name: "YEAR", icon: Calendar, path: "/admin/master/year" },
        {
          name: "SEMESTER",
          icon: ClipboardList,
          path: "/admin/master/semester",
        },
        { name: "COURSE", icon: BookOpen, path: "/admin/master/course" },
        { name: "SECTION", icon: LayoutGrid, path: "/admin/master/section" },
      ],
    },
    {
      title: "Subject",
      items: [
        { name: "SUBJECT", icon: BookMarked, path: "/admin/master/subject" },
        { name: "SUBJECT CATEGORY", icon: Layers, path: "/admin/master/subject-category" },
      ],
    },
    {
      title: "Faculty",
      items: [
        { name: "DEPARTMENT", icon: Building2, path: "/admin/master/department" },
        { name: "DESIGNATION", icon: UserCog, path: "/admin/master/designation" },
      ],
    },
    {
      title: "Attendance",
      items: [
        { name: "ON DUTY", icon: Clock, path: "/admin/master/od" },
        { name: "DAY ORDER", icon: CalendarRange, path: "/admin/master/dayorder" },
        { name: "DAY HOUR", icon: Timer, path: "/admin/master/dayhour" },
      ],
    },
    {
      title: "Transport",
      items: [
        { name: "BOARDING", icon: BusFront, path: "/admin/master/boarding-point" },
        { name: "BUS ROUTE", icon: MapPinned, path: "/admin/master/bus-route" },
        { name: "TRANSPORT", icon: CarFront, path: "/admin/master/transport" },
      ],
    },
    {
      title: "Other",
      items: [
        { name: "EVENTS", icon: Presentation, path: "/admin/master/event" },
        { name: "GALLERY", icon: Image },
        { name: "FEE DETAILS", icon: ReceiptIndianRupee },
      ],
    },
    {
      title: "Mapping",
      items: [
        { name: "COURSE SUBJECT", icon: Puzzle },
        { name: "FACULTY SUBJECT", icon: Users },
        { name: "DAY ORDER FACULTY", icon: CalendarCheck },
        { name: "FEE DETAIL COURSE", icon: GraduationCap },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Master <span className="text-primary">Setup</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Configure core academic and administrative entities.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          Home <ChevronRight className="w-3 h-3" />{" "}
          <span className="text-primary">Master Dashboard</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="flex flex-wrap gap-8">
        {categories.map((category, idx) => (
          <div
            key={idx}
            className="relative border-2 border-slate-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow min-w-fit"
          >
            {/* Category Title (Legend Style) */}
            <div className="absolute -top-3 left-6 bg-white px-3">
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                {category.title}
              </span>
            </div>

            {/* Items Grid */}
            <div className="flex flex-wrap gap-4 pt-2">
              {category.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="group w-28 h-28 border-[1.5px] border-indigo-100 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-indigo-50 hover:border-primary transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => item.path && navigate(item.path)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="w-10 h-10 rounded-lg flex items-center justify-center relative z-10">
                      <Icon className="w-8 h-8 text-indigo-600 group-hover:scale-110 group-hover:text-amber-500 transition-all duration-300" />
                    </div>

                    <span className="text-[10px] font-black text-slate-700 text-center px-1 leading-tight uppercase tracking-tight relative z-10 group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterDashboard;
