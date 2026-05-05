import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, LogOut, ChevronRight, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  icon: any;
  path?: string;
  subItems?: { label: string; path: string }[];
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
  // setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  menuItems,
  // userName,
  // entityName,
  // clientLogo,
  // defaultLogo,
  handleLogout,
  favicon,
}: SidebarProps) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  React.useEffect(() => {
    menuItems.forEach((item) => {
      if (
        item.subItems?.some((sub) => location.pathname.includes(sub.path)) &&
        !openSubmenus.includes(item.label)
      ) {
        setOpenSubmenus((prev) => [...prev, item.label]);
      }
    });
  }, [location.pathname, menuItems]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-50 bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out flex flex-col shadow-2xl border-r border-sidebar-border",
        isSidebarOpen ? "w-64" : "w-16",
        isMobileMenuOpen
          ? "translate-x-0 w-64"
          : "-translate-x-full lg:translate-x-0",
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-4 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <img
              src={favicon}
              alt="Logo"
              // className="w-10 h-10 object-contain"
              onError={(e) => (e.currentTarget.src = favicon)}
            />
          </div>
          {(isSidebarOpen || isMobileMenuOpen) && (
            <div className="flex flex-col min-w-0">
              <h1 className="font-bold text-white text-sm tracking-tight leading-none">
                Kanimai
              </h1>
              <span className="text-[10px] text-sidebar-foreground/60 font-medium mt-1">
                College Management
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide">
        <div className="space-y-6">
          {/* Workspace Section */}
          <div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <p className="px-3 mb-4 text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-[0.2em]">
                Workspace
              </p>
            )}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isSubmenuOpen = openSubmenus.includes(item.label);
                const isActive = item.path
                  ? location.pathname.includes(item.path)
                  : item.subItems?.some((sub) =>
                      location.pathname.includes(sub.path),
                    );

                const Icon = item.icon;

                return (
                  <div key={item.label} className="space-y-1">
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                          isActive
                            ? "bg-sidebar-accent/30 text-white"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 transition-transform group-hover:scale-110",
                            isActive ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-white",
                          )}
                        />
                        {(isSidebarOpen || isMobileMenuOpen) && (
                          <>
                            <span className="font-semibold text-sm flex-1 text-left">
                              {item.label}
                            </span>
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 transition-transform duration-200",
                                isSubmenuOpen ? "rotate-180" : "",
                              )}
                            />
                          </>
                        )}
                        {!isSidebarOpen && !isMobileMenuOpen && (
                          <div className="fixed left-16 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all transform translate-x-2 group-hover:translate-x-0 ml-2 z-[60] shadow-xl whitespace-nowrap border border-white/5">
                            {item.label}
                          </div>
                        )}
                      </button>
                    ) : (
                      <Link
                        to={item.path || "#"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                          isActive
                            ? "bg-sidebar-accent text-white shadow-sm shadow-black/20"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 transition-transform group-hover:scale-110",
                            isActive
                              ? "text-primary"
                              : "text-sidebar-foreground/60 group-hover:text-white",
                          )}
                        />
                        {(isSidebarOpen || isMobileMenuOpen) && (
                          <span className="font-semibold text-sm">
                            {item.label}
                          </span>
                        )}
                        {!isSidebarOpen && !isMobileMenuOpen && (
                          <div className="fixed left-16 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all transform translate-x-2 group-hover:translate-x-0 ml-2 z-[60] shadow-xl whitespace-nowrap border border-white/5">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    )}

                    {hasSubItems &&
                      isSubmenuOpen &&
                      (isSidebarOpen || isMobileMenuOpen) && (
                        <div className="ml-9 space-y-1 animate-in slide-in-from-top-2 duration-200">
                          {item.subItems?.map((sub) => {
                            const isSubActive = location.pathname.includes(
                              sub.path,
                            );
                            return (
                              <Link
                                key={sub.path}
                                to={sub.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                  "block px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                                  isSubActive
                                    ? "text-primary bg-primary/10"
                                    : "text-sidebar-foreground/50 hover:text-white hover:bg-sidebar-accent/30",
                                )}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Section */}
          <div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <p className="px-3 mb-4 text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-[0.2em]">
                System
              </p>
            )}
            <div className="space-y-1">
              <Link
                to="/admin/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white group"
              >
                <Settings className="w-5 h-5 text-sidebar-foreground/60 group-hover:text-white" />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="font-semibold text-sm">Settings</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-sidebar-border bg-black/10">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full p-2.5 hover:bg-red-500/10 text-sidebar-foreground hover:text-red-400 rounded-xl transition-all duration-200 text-sm font-semibold group",
            !isSidebarOpen && !isMobileMenuOpen && "justify-center",
          )}
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {(isSidebarOpen || isMobileMenuOpen) && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};
