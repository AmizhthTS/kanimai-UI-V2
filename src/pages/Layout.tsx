import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Users,
  UserCheck,
  Flag,
  Calendar,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import logo from "@/assets/kanimai-logo.gif";
import collegeLogo from "@/assets/ramanas_logo.png";
import favicon from "@/assets/favicon.png";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userName = sessionStorage.getItem("UserName") || "Admin User";
  // const entityName = "Administrator";
  const clientLogo = sessionStorage.getItem("clientLogo");

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("UserType");
    sessionStorage.removeItem("UserName");
    sessionStorage.removeItem("jwttoken");
    sessionStorage.removeItem("preList");
    sessionStorage.removeItem("pageNum");
    navigate("/login");
  };

  const adminMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Master", icon: Database, path: "/admin/master" },
    {
      label: "Students",
      icon: Users,
      subItems: [
        { label: "Bio Information", path: "/admin/student/bio" },
        { label: "Payment Details", path: "/admin/student/payment" },
        { label: "Attendance", path: "/admin/student/attendance" },
      ],
    },
    {
      label: "Faculty",
      icon: UserCheck,
      subItems: [
        { label: "Bio Info", path: "/admin/faculty/bio" },
        { label: "Subjects", path: "/admin/faculty/subjects" },
      ],
    },
    { label: "Report", icon: Flag, path: "/admin/report" },
  ];

  const facultyMenuItems = [
    { label: "My Detail", icon: User, path: "/faculty/my-detail" },
    { label: "Attendance", icon: Calendar, path: "/faculty/attendance" },
  ];

  const menuItems = location.pathname.startsWith("/admin")
    ? adminMenuItems
    : facultyMenuItems;

  return (
    <div
      className={cn(
        "min-h-screen flex transition-colors duration-300",
        isDarkMode ? "dark bg-slate-950" : "bg-background",
      )}
    >
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        menuItems={menuItems}
        userName={userName}
        // entityName={entityName}
        // clientLogo={clientLogo}
        defaultLogo={logo}
        favicon={favicon}
        handleLogout={handleLogout}
      />

      <main
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen flex flex-col",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-16",
        )}
      >
        <Navbar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          userName={userName}
          // entityName={entityName}
          collegeLogo={collegeLogo}
          handleLogout={handleLogout}
        />

        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            <Outlet />
          </div>
        </div>

        <footer className="py-6 px-8 bg-white border-t border-slate-100 text-center md:flex md:justify-between md:items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p>
              © {new Date().getFullYear()} Kanimai College ERP. Secure Access.
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/support" className="hover:text-primary transition-colors">
              Support
            </Link>
          </div>
        </footer>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Layout;
