import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { CartProvider } from "./contexts/CartContext";
import { LoaderProvider } from "./contexts/LoaderContext";
import PageLoader from "./components/PageLoader";
// import Layout from "./components/Layout";
import Login from "./pages/Login";
import ScrollToTop from "./components/ScrollToTop";
import { authApi } from "./services/api";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import MasterDashboard from "./pages/AdminPages/MasterDashboard/MasterDashboard";
import DegreeMaster from "./pages/AdminPages/MasterDashboard/DegreeMaster";
import YearMaster from "./pages/AdminPages/MasterDashboard/YearMaster";
import SemesterMaster from "./pages/AdminPages/MasterDashboard/SemesterMaster";
import CourseMaster from "./pages/AdminPages/MasterDashboard/CourseMaster";
import CourseForm from "./pages/AdminPages/MasterDashboard/CourseForm";
import SectionMaster from "./pages/AdminPages/MasterDashboard/SectionMaster";
import SubjectMaster from "./pages/AdminPages/MasterDashboard/SubjectMaster";
import SubjectCategoryMaster from "./pages/AdminPages/MasterDashboard/SubjectCategoryMaster";
import DepartmentMaster from "./pages/AdminPages/MasterDashboard/DepartmentMaster";
import DesignationMaster from "./pages/AdminPages/MasterDashboard/DesignationMaster";
import ODMaster from "./pages/AdminPages/MasterDashboard/ODMaster";
import DayOrderMaster from "./pages/AdminPages/MasterDashboard/DayOrderMaster";
import DayHourMaster from "./pages/AdminPages/MasterDashboard/DayHourMaster";
import BoardingPointMaster from "./pages/AdminPages/MasterDashboard/BoardingPointMaster";
import RouteMaster from "./pages/AdminPages/MasterDashboard/RouteMaster";
import RouteForm from "./pages/AdminPages/MasterDashboard/RouteForm";
import TransportMaster from "./pages/AdminPages/MasterDashboard/TransportMaster";
import EventMaster from "./pages/AdminPages/MasterDashboard/EventMaster";
import EventForm from "./pages/AdminPages/MasterDashboard/EventForm";
const queryClient = new QueryClient();

const App = () => {
  const lookupApi = async () => {
    const data = {
      applicationType: "web",
      customerCode: "",
      requestDomain: "ramanas.amizhth.in",
    };
    try {
      const response = await authApi.lookupApi(data);
      if (response.data.tenantID) {
        sessionStorage.setItem("clientName", response.data.customerName);
        sessionStorage.setItem("clientLogo", response.data.customerImage);
        sessionStorage.setItem("dominName", response.data.requestDomain);
        sessionStorage.setItem("TenantID", response.data.tenantID);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    let TenantID = sessionStorage.getItem("TenantID");
    if (!TenantID) {
      lookupApi();
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* <CartProvider> */}
        <LoaderProvider>
          <PageLoader />
          <Toaster position="bottom-right" richColors />
          {/* <Sonner /> */}
          <BrowserRouter>
            {/* <Layout> */}
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<Layout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="master" element={<MasterDashboard />} />
                <Route path="master/degree" element={<DegreeMaster />} />
                <Route path="master/year" element={<YearMaster />} />
                <Route path="master/semester" element={<SemesterMaster />} />
                <Route path="master/course" element={<CourseMaster />} />
                <Route path="master/course/add" element={<CourseForm />} />
                <Route path="master/course/edit/:id" element={<CourseForm />} />
                <Route path="master/section" element={<SectionMaster />} />
                <Route path="master/subject" element={<SubjectMaster />} />
                <Route path="master/subject-category" element={<SubjectCategoryMaster />} />
                <Route path="master/department" element={<DepartmentMaster />} />
                <Route path="master/designation" element={<DesignationMaster />} />
                <Route path="master/od" element={<ODMaster />} />
                <Route path="master/dayorder" element={<DayOrderMaster />} />
                <Route path="master/dayhour" element={<DayHourMaster />} />
                <Route path="master/boarding-point" element={<BoardingPointMaster />} />
                <Route path="master/bus-route" element={<RouteMaster />} />
                <Route path="master/bus-route/add" element={<RouteForm />} />
                <Route path="master/bus-route/edit/:id" element={<RouteForm />} />
                <Route path="master/transport" element={<TransportMaster />} />
                <Route path="master/event" element={<EventMaster />} />
                <Route path="master/event/add" element={<EventForm />} />
                <Route path="master/event/edit/:id" element={<EventForm />} />
                <Route
                  path="student"
                  element={<div>Admin Student (Coming Soon)</div>}
                />
                <Route
                  path="faculty"
                  element={<div>Admin Faculty (Coming Soon)</div>}
                />
                <Route
                  path="report"
                  element={<div>Admin Report (Coming Soon)</div>}
                />
              </Route>

              {/* Faculty Routes */}
              <Route path="/faculty" element={<Layout />}>
                <Route index element={<Navigate to="my-detail" replace />} />
                <Route
                  path="my-detail"
                  element={<div>Faculty Detail (Coming Soon)</div>}
                />
                <Route
                  path="attendance"
                  element={<div>Faculty Attendance (Coming Soon)</div>}
                />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            {/* </Layout> */}
          </BrowserRouter>
        </LoaderProvider>
        {/* </CartProvider> */}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
