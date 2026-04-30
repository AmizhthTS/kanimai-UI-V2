import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  icon: any;
  path: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  menuItems: MenuItem[];
  userName: string;
  // entityName: string;
  // clientLogo: string | null;
  defaultLogo: string;
  handleLogout: () => void;
  favicon: string;
}

export const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  menuItems,
  userName,
  // entityName,
  // clientLogo,
  defaultLogo,
  handleLogout,
  favicon,
}: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-50 bg-[#003366] text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl",
        isSidebarOpen ? "w-56" : "w-16",
        isMobileMenuOpen
          ? "translate-x-0 w-64"
          : "-translate-x-full lg:translate-x-0",
      )}
    >
      {/* Sidebar Header */}
      <div className="h-14 flex items-center px-4 border-b border-white/10 shrink-0 bg-[#002a54]">
        <div className="flex items-center gap-2 overflow-hidden">
          {isSidebarOpen || isMobileMenuOpen ? (
            <img
              src={defaultLogo}
              alt="Logo"
              className="w-32 h-10 object-contain"
              onError={(e) => (e.currentTarget.src = defaultLogo)}
            />
          ) : (
            <img
              src={favicon}
              alt="Logo"
              className="w-8 h-8 object-contain"
              onError={(e) => (e.currentTarget.src = favicon)}
            />
          )}
        </div>

        {(isSidebarOpen || isMobileMenuOpen) && (
          <button
            onClick={() =>
              isMobileMenuOpen
                ? setIsMobileMenuOpen(false)
                : setIsSidebarOpen(false)
            }
            className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-blue-200" />
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = item.path && location.pathname.includes(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-[#ffcc00] text-[#003366] shadow-md shadow-amber-400/10"
                    : "text-blue-100 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive
                      ? "text-[#003366]"
                      : "text-blue-300 group-hover:text-amber-400",
                  )}
                />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="font-bold text-xs tracking-tight">
                    {item.label}
                  </span>
                )}
                {isActive && (isSidebarOpen || isMobileMenuOpen) && (
                  <div className="absolute right-2.5 w-1 h-1 rounded-full bg-[#003366]" />
                )}
                {!isSidebarOpen && !isMobileMenuOpen && (
                  <div className="fixed left-16 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all transform translate-x-2 group-hover:translate-x-0 ml-2 z-[60] shadow-xl whitespace-nowrap border border-white/10">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/10 bg-[#002a54]/50">
        <div
          className={cn(
            "bg-white/5 rounded-xl p-3 transition-all duration-300",
            !isSidebarOpen && !isMobileMenuOpen
              ? "p-1.5 items-center flex justify-center"
              : "flex flex-col",
          )}
        >
          {isSidebarOpen || isMobileMenuOpen ? (
            <>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-bold text-[#003366] text-md ring-1 ring-white/10 shadow-md">
                  {userName.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate text-white">
                    {userName}
                  </span>
                  {/* <span className="text-[9px] text-blue-300 font-medium truncate uppercase tracking-wider">
                    {entityName}
                  </span> */}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all duration-200 text-[10px] font-bold group"
              >
                <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
