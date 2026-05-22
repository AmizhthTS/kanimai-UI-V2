import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Moon,
  Sun,
  ExternalLink,
  MessageSquare,
  Monitor,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useParentStudent } from "@/contexts/ParentStudentContext";

interface NavbarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  userName: string;
  // entityName: string;
  collegeLogo: string;
  handleLogout: () => void;
}

export const Navbar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isSidebarOpen,
  setIsSidebarOpen,
  isProfileOpen,
  setIsProfileOpen,
  isDarkMode,
  setIsDarkMode,
  userName,
  // entityName,
  collegeLogo,
  handleLogout,
}: NavbarProps) => {
  const location = useLocation();
  const isParentPortal = location.pathname.startsWith("/parent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { students, activeStudent, setActiveStudent } = useParentStudent();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-4 md:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() =>
            isMobileMenuOpen
              ? setIsMobileMenuOpen(false)
              : window.innerWidth < 1024
                ? setIsMobileMenuOpen(true)
                : setIsSidebarOpen(!isSidebarOpen)
          }
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex gap-3 items-center min-w-0">
          <img
            src={collegeLogo}
            alt="College Logo"
            className="h-10 w-10 object-contain border border-slate-200 rounded-full bg-white shadow-sm shrink-0"
          />
          <div className="hidden sm:flex flex-col min-w-0">
            <h1 className="font-black text-sm text-slate-800 tracking-tight leading-none truncate uppercase">
              {sessionStorage.getItem("clientName")}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 mt-1 truncate">
              {sessionStorage.getItem("UserName")}
            </p>
          </div>
        </div>

        {isParentPortal && activeStudent && (
          <div className="relative z-50 ml-2" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl transition-all duration-300 group shadow-sm"
            >
              <div className={cn(
                "w-6 h-6 rounded-lg bg-gradient-to-br flex items-center justify-center font-black text-white text-[10px] shadow-sm shrink-0 transition-transform duration-500 group-hover:rotate-6",
                activeStudent.avatarBg
              )}>
                {activeStudent.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex flex-col items-start min-w-0 text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Active Student</span>
                <span className="text-[10px] font-bold text-slate-700 mt-1 truncate leading-none">{activeStudent.name}</span>
              </div>
              <ChevronDown className={cn(
                "w-3 h-3 text-slate-400 transition-transform duration-300 ml-0.5 shrink-0",
                isDropdownOpen && "rotate-180 text-primary"
              )} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 p-1.5 space-y-1">
                <div className="px-2 py-1.5">
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Student</h3>
                  <p className="text-[8px] text-slate-500 mt-0.5">Switch student profile to update details</p>
                </div>
                
                <div className="space-y-1">
                  {students.map((student) => {
                    const isActive = student.id === activeStudent.id;
                    return (
                      <button
                        key={student.id}
                        onClick={() => {
                          setActiveStudent(student);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-2.5 w-full p-2 rounded-xl transition-all text-left relative overflow-hidden group/item border",
                          isActive 
                            ? "bg-slate-50/80 border-slate-200/50 shadow-sm" 
                            : "bg-transparent border-transparent hover:bg-slate-50/50"
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#003366] to-[#002a54] rounded-r-full" />
                        )}
                        <div className={cn(
                          "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center font-black text-white text-[10px] shadow-sm shrink-0 transition-all duration-300 group-hover/item:scale-105",
                          student.avatarBg
                        )}>
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "text-[10px] font-bold truncate transition-colors",
                            isActive ? "text-slate-800" : "text-slate-600 group-hover/item:text-slate-800"
                          )}>
                            {student.name}
                          </h4>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            {student.rollNo} • {student.section}
                          </p>
                          <p className="text-[8px] text-slate-500 truncate">
                            {student.course}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end shrink-0 gap-0.5">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                            student.attendance >= 85 
                              ? "bg-emerald-50 text-emerald-600" 
                              : student.attendance >= 75 
                                ? "bg-amber-50 text-amber-600" 
                                : "bg-rose-50 text-rose-600"
                          )}>
                            {student.attendance}%
                          </span>
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
                            GPA {student.cgpa}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* <div className="relative hidden md:flex items-center max-w-md w-full">
          <Search className="absolute left-4 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students, courses..."
            className="w-full bg-slate-100/50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
        </button> */}

        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-2xl transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-sidebar flex items-center justify-center font-bold text-white shadow-lg text-xs tracking-tighter">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform duration-300",
                isProfileOpen && "rotate-180",
              )}
            />
          </button>

          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 p-1">
                <div className="p-3 bg-gradient-to-br from-[#003366] to-[#002a54] text-white rounded-xl mb-1 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/5 rounded-full blur-2xl" />
                  <div className="flex items-center gap-2.5 relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-md border border-white/20 shadow-inner">
                      {userName.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs truncate leading-tight">
                        {userName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="py-1 px-0.5">
                  {sessionStorage.getItem("entityName") !== "Faculty" && (
                    <>
                      <Link
                        to="/admin/profile"
                        className="flex items-center gap-2 w-full p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all text-[10px] font-bold group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <User className="w-3 h-3" />
                        </div>
                        My Profile
                      </Link>
                      <Link
                        to="/admin/profile/pdf-settings"
                        className="flex items-center gap-2 w-full p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all text-[10px] font-bold group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <Settings className="w-3 h-3" />
                        </div>
                        PDF Settings
                      </Link>
                    </>
                  )}
                  <Link
                    to={
                      sessionStorage.getItem("entityName") === "Faculty"
                        ? "/faculty/profile/change-password"
                        : "/admin/profile/change-password"
                    }
                    className="flex items-center gap-2 w-full p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all text-[10px] font-bold group"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="w-6 h-6 rounded-md bg-rose-50 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                    Change Password
                  </Link>
                  {/* <button
                    className="flex items-center gap-2 w-full p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all text-[10px] font-bold group"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <MessageSquare className="w-3 h-3" />
                    </div>
                    Support
                  </button> */}
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all text-[10px] font-bold group"
                  >
                    <div className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <LogOut className="w-3 h-3" />
                    </div>
                    Sign Out
                  </button>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 mt-0.5">
                  <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <span>V 2.4.0</span>
                    <a href="#" className="text-[#003366] hover:underline">
                      Notes
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
