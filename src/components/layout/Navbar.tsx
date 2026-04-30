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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() =>
            isMobileMenuOpen
              ? setIsMobileMenuOpen(false)
              : window.innerWidth < 1024
                ? setIsMobileMenuOpen(true)
                : setIsSidebarOpen(!isSidebarOpen)
          }
          className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden lg:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center p-1 border border-slate-100 shadow-sm">
            <img
              src={collegeLogo}
              alt="College"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xs font-black text-slate-800 leading-tight">
              College Dashboard
            </h2>
            {/* <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">
              {entityName}
            </span> */}
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden lg:block" />

        {/* <div className="relative hidden xl:flex items-center max-w-[200px] w-full">
          <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-50 border-none rounded-xl py-1.5 pl-9 pr-3 text-xs font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-2">
        {/* <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button className="p-1.5 text-primary bg-white rounded-lg shadow-sm">
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600">
            <Phone className="w-3.5 h-3.5" />
          </button>
        </div> */}

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all group">
          <Bell className="w-4 h-4 group-hover:animate-bounce" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 border border-white rounded-full" />
        </button> */}

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#003366] to-indigo-500 flex items-center justify-center font-bold text-white shadow-md text-xs">
              {userName.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none pr-1">
              <span className="text-xs font-bold text-slate-800">
                {userName.split(" ")[0]}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">
                Verified
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-slate-400 transition-transform duration-300",
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
                  <button className="flex items-center gap-2 w-full p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all text-[10px] font-bold group">
                    <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <User className="w-3 h-3" />
                    </div>
                    My Profile
                  </button>
                  <button className="flex items-center gap-2 w-full p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all text-[10px] font-bold group">
                    <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Settings className="w-3 h-3" />
                    </div>
                    Settings
                  </button>
                  <button className="flex items-center gap-2 w-full p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all text-[10px] font-bold group">
                    <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <MessageSquare className="w-3 h-3" />
                    </div>
                    Support
                  </button>
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
                    <a
                      href="#"
                      className="text-[#003366] hover:underline"
                    >
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
