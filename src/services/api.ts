import axios, { AxiosRequestConfig } from "axios";
import { loaderTrigger } from "@/utils/loaderTrigger";

const BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jwttoken") || "";
    const tenantID = sessionStorage.getItem("TenantID") || "common";
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (tenantID && config.headers) {
      config.headers["X-TenantID"] = tenantID;
    }
    // Show global loader for every request
    loaderTrigger.show();
    return config;
  },
  (error) => {
    // Hide loader if request fails to start
    loaderTrigger.hide();
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Hide global loader on successful response
    loaderTrigger.hide();
    return response;
  },
  (error) => {
    // Hide global loader on error response
    loaderTrigger.hide();
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("userId");
        // window.location.assign("/admin/login");
      } else if (error.response.status === 403) {
        // Forbidden
        console.error("Forbidden access");
      }
    } else if (error.message === "Network Error") {
      console.error("Network error - server may be down");
    }
    return Promise.reject(error);
  }
);

// =====================================================
// AUTH API
// =====================================================

export const authApi = {
  // Register new user
  lookupApi: (data: any) => api.post("/customer/lookup", data),

  // Login
  login: (data: { username: string; password: string }) =>
    api.post("/authenticate", data),

  // Logout (requires auth)
  logout: () => api.post("/users/auth/logout"),
};

export const dashboardApi = {
  // Main Dashboard Data
  getDashboardData: () => api.get("/dashboard"),

  // Event Lists
  getCollegeList: () => api.post("/master/event/college/list", {}),
  getHolidayList: () => api.post("/master/event/holiday/list", {}),
  getCourseList: () => api.post("/master/event/course/list", {}),

  // Event Filter
  getEventFilter: (startDate: string) =>
    api.post("/master/event/date/list", { startDate }),

  // Gallery
  getGalleryList: () => api.post("/master/gallery/list", {}),


};
export const masterApi = {
  // Degree Master
  saveDegree: (data: any) => api.post("/master/degree", data),
  getDegreeList: (data: any) => api.post("/master/degree/list", data),
  deleteDegree: (id: string) => api.delete(`/master/degree/${id}`),

  // Year Master
  saveYear: (data: any) => api.post("/master/year", data),
  getYearList: (data: any) => api.post("/master/year/list", data),
  deleteYear: (id: string) => api.delete(`/master/year/${id}`),

  // Semester Master
  saveSemester: (data: any) => api.post("/master/semester", data),
  getSemesterList: (data: any) => api.post("/master/semester/list", data),
  deleteSemester: (id: string) => api.delete(`/master/semester/${id}`),

  // Course Master
  saveCourse: (data: any) => api.post("/master/course", data),
  getCourseList: (data: any) => api.post("/master/course/list", data),
  deleteCourse: (id: string) => api.delete(`/master/course/${id}`),

  // Section Master
  saveClassSection: (data: any) => api.post("/master/classsection", data),
  getClassSectionList: (data: any) => api.post("/master/classsection/list", data),
  deleteClassSection: (id: string) => api.delete(`/master/classsection/${id}`),

  // Subject Master
  saveSubject: (data: any) => api.post("/master/subject", data),
  getSubjectList: (data: any) => api.post("/master/subject/list", data),
  deleteSubject: (id: string) => api.delete(`/master/subject/${id}`),

  // Subject Category Master
  saveSubjectCategory: (data: any) => api.post("/master/subjectcategory", data),
  getSubjectCategoryList: (data: any) => api.post("/master/subjectcategory/list", data),
  deleteSubjectCategory: (id: string) => api.delete(`/master/subjectcategory/${id}`),

  // Department Master
  saveDepartment: (data: any) => api.post("/master/staffdepartment", data),
  getDepartmentList: (data: any) => api.post("/master/staffdepartment/list", data),
  deleteDepartment: (id: string) => api.delete(`/master/staffdepartment/${id}`),

  // Designation Master
  saveDesignation: (data: any) => api.post("/master/staffdesignation", data),
  getDesignationList: (data: any) => api.post("/master/staffdesignation/list", data),
  deleteDesignation: (id: string) => api.delete(`/master/staffdesignation/${id}`),

  // OD Category Master
  saveOD: (data: any) => api.post("/master/od", data),
  getODList: (data: any) => api.post("/master/od/list", data),
  deleteOD: (id: string) => api.delete(`/master/od/${id}`),

  // Day Order Master
  saveDayOrder: (data: any) => api.post("/master/dayorder", data),
  getDayOrderList: (data: any) => api.post("/master/dayorder/list", data),
  deleteDayOrder: (id: string) => api.delete(`/master/dayorder/${id}`),

  // Day Hour Master
  saveDayHour: (data: any) => api.post("/master/dayhour", data),
  getDayHourList: (data: any) => api.post("/master/dayhour/list", data),
  deleteDayHour: (id: string) => api.delete(`/master/dayhour/${id}`),

  // Boarding Point Master
  saveBoardingPoint: (data: any) => api.post("/master/boardingpoint", data),
  getBoardingPointList: (data: any) => api.post("/master/boardingpoint/list", data),
  getAllBoardingPoints: (data: any = {}) => api.post("/master/boardingpoint/listall", data),
  deleteBoardingPoint: (id: string) => api.delete(`/master/boardingpoint/${id}`),

  // Route Master
  saveRoute: (data: any) => api.post("/master/transport/route", data),
  getRouteList: (data: any) => api.post("/master/transport/route/list", data),
  getAllRoutes: (data: any = {}) => api.post("/master/transport/route/listall", data),
  getRouteById: (id: string) => api.get(`/master/transport/route/${id}`),
  deleteRoute: (id: string) => api.delete(`/master/transport/route/${id}`),

  // Transport Master
  saveTransport: (data: any) => api.post("/master/transport", data),
  getTransportList: (data: any) => api.post("/master/transport/list", data),
  deleteTransport: (id: string) => api.delete(`/master/transport/${id}`),

  // Event Master
  saveEvent: (data: any) => api.post("/master/event", data),
  getEventList: (data: any) => api.post("/master/event/list", data),
  getEventById: (id: string) => api.get(`/master/event/${id}`),
  deleteEvent: (id: string) => api.delete(`/master/event/${id}`),
  deleteEventImage: (id: string) => api.delete(`/master/event/image/${id}`),
};

export const uploadApi = {
  uploadImage: (data: FormData) =>
    api.post("/master/event/image", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default api;
