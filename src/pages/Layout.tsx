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
  BookOpen,
  FileUp,
  GraduationCap,
  Bus,
  Wallet,
  Building,
  Bell,
  Briefcase,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import logo from "@/assets/kanimai-logo.gif";
import collegeLogo from "@/assets/ramanas_logo.png";
import favicon from "@/assets/favicon.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authApi } from "@/services/api";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.removeItem("UserType");
      sessionStorage.removeItem("UserName");
      sessionStorage.removeItem("jwttoken");
      sessionStorage.removeItem("preList");
      sessionStorage.removeItem("pageNum");
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
      navigate("/login");
    }
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
        { label: "Semester Marks", path: "/admin/student/semester/marks" },
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
    {
      label: "Attendance Analytics",
      icon: ClipboardCheck,
      path: "/admin/attendance/advanced",
    },
    // { label: "Transport Management", icon: Bus, path: "/admin/transport-mgmt" },
    { label: "Leave Management", icon: Calendar, path: "/admin/leave-mgmt" },
    {
      label: "Notification Center",
      icon: Bell,
      path: "/admin/notifications-center",
    },
    {
      label: "Examination Module",
      icon: GraduationCap,
      path: "/admin/exams-mgmt",
    },
    { label: "Hostel Management", icon: Building, path: "/admin/hostel-mgmt" },
    {
      label: "Library Management",
      icon: BookOpen,
      path: "/admin/library-mgmt",
    },
    { label: "Report", icon: Flag, path: "/admin/report" },
    { label: "Import / Export", icon: FileUp, path: "/admin/bulk-upload" },
  ];

  const facultyMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/faculty/dashboard" },
    { label: "My Detail", icon: User, path: "/faculty/my-detail" },
    { label: "Subjects", icon: BookOpen, path: "/faculty/subjects" },
    { label: "Attendance", icon: Calendar, path: "/faculty/attendance" },
  ];

  const studentMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
    { label: "My Profile", icon: User, path: "/student/profile" },
    { label: "Attendance", icon: Calendar, path: "/student/attendance" },
    { label: "Semester Marks", icon: GraduationCap, path: "/student/marks" },
    { label: "Fee Details", icon: Wallet, path: "/student/fees" },
    { label: "Transport", icon: Bus, path: "/student/transport" },
  ];

  const parentMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/parent/dashboard" },
    { label: "Attendance", icon: Calendar, path: "/parent/attendance" },
    { label: "Semester Marks", icon: GraduationCap, path: "/parent/marks" },
    { label: "Fee & Payments", icon: Wallet, path: "/parent/fees" },
    { label: "Transport", icon: Bus, path: "/parent/transport" },
  ];

  const principalMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/principal/dashboard" },
    {
      label: "Faculty Attendance",
      icon: UserCheck,
      path: "/principal/faculty-attendance",
    },
    {
      label: "Student Monitoring",
      icon: Users,
      path: "/principal/student-monitoring",
    },
    { label: "Reports & Analytics", icon: Flag, path: "/principal/reports" },
    { label: "Notifications", icon: Bell, path: "/principal/notifications" },
  ];

  const hodMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/hod/dashboard" },
    {
      label: "Faculty Management",
      icon: Briefcase,
      path: "/hod/faculty-management",
    },
    {
      label: "Student Management",
      icon: Users,
      path: "/hod/student-management",
    },
    { label: "Approval System", icon: ClipboardCheck, path: "/hod/approvals" },
    { label: "Reports", icon: Flag, path: "/hod/reports" },
  ];

  const menuItems = location.pathname.startsWith("/admin")
    ? adminMenuItems
    : location.pathname.startsWith("/faculty")
      ? facultyMenuItems
      : location.pathname.startsWith("/student")
        ? studentMenuItems
        : location.pathname.startsWith("/principal")
          ? principalMenuItems
          : location.pathname.startsWith("/hod")
            ? hodMenuItems
            : parentMenuItems;

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
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link
              to="/support"
              className="hover:text-primary transition-colors"
            >
              Support
            </Link>
          </div>
        </footer>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <AlertDialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader className="flex flex-col items-center">
            <div className="w-24 h-24 mb-4 flex items-center justify-center bg-slate-50/50 rounded-full shadow-inner border border-slate-100">
              <img
                src={logo}
                alt="Animation"
                className="w-16 h-16 object-contain animate-pulse drop-shadow-md"
              />
            </div>
            <AlertDialogTitle className="text-xl text-center">
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-500">
              You will be redirected to the login page. Any unsaved changes
              might be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
            <AlertDialogCancel
              disabled={isLoggingOut}
              className="w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmLogout();
              }}
              disabled={isLoggingOut}
              className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Layout;
