import React from "react";
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
import { Link } from "react-router-dom";

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
                  <Link
                    to="/admin/profile/change-password"
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
