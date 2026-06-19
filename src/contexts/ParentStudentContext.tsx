import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { parentApi } from "@/services/api";

export interface Student {
  id: string;
  studentname: string;
  rollNo: string;
  course: string;
  section: string;
  semester: string;
  avatarBg: string;
  cgpa: number;
  attendance: number;
  feeDue: number;
  routeName: string;
  vehicleNumber: string;
  boardingPoint: string;
  pickupTime: string;
  dropTime: string;
  driverName: string;
  driverContact: string;
  isTransportOpted: boolean;
}

interface ParentStudentContextType {
  students: Student[];
  activeStudent: Student | null;
  setActiveStudent: (student: Student) => void;
  loading: boolean;
}

const ParentStudentContext = createContext<ParentStudentContextType | undefined>(undefined);

// Rich mock data representing multiple children of a single parent
const mockStudents: Student[] = [
  {
    id: "1",
    studentname: "Arjun Sharma",
    rollNo: "2026CSE001",
    course: "B.E. Computer Science & Engineering",
    section: "A",
    semester: "Semester 4",
    avatarBg: "from-blue-600 to-indigo-600 shadow-blue-500/20",
    cgpa: 8.4,
    attendance: 85.5,
    feeDue: 15000,
    routeName: "Route 5 - Downtown",
    vehicleNumber: "TN-37-BX-1234",
    boardingPoint: "Central Station",
    pickupTime: "07:30 AM",
    dropTime: "04:45 PM",
    driverName: "Suresh Kumar",
    driverContact: "9876543211",
    isTransportOpted: true,
  },
  {
    id: "2",
    studentname: "Priya Sharma",
    rollNo: "2026BIO042",
    course: "B.Tech Biotechnology",
    section: "B",
    semester: "Semester 2",
    avatarBg: "from-emerald-500 to-teal-500 shadow-emerald-500/20",
    cgpa: 9.1,
    attendance: 94.2,
    feeDue: 0,
    routeName: "Route 2 - Westside",
    vehicleNumber: "TN-37-BY-5678",
    boardingPoint: "West Gate Mall",
    pickupTime: "08:00 AM",
    dropTime: "04:15 PM",
    driverName: "Manoj Singh",
    driverContact: "9876543222",
    isTransportOpted: true,
  },
  {
    id: "3",
    studentname: "Rohan Sharma",
    rollNo: "2026ECE103",
    course: "B.E. Electronics & Communication",
    section: "C",
    semester: "Semester 6",
    avatarBg: "from-rose-500 to-pink-500 shadow-rose-500/20",
    cgpa: 7.8,
    attendance: 78.0,
    feeDue: 8500,
    routeName: "N/A",
    vehicleNumber: "N/A",
    boardingPoint: "N/A",
    pickupTime: "N/A",
    dropTime: "N/A",
    driverName: "N/A",
    driverContact: "N/A",
    isTransportOpted: false,
  },
];

export const ParentStudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeStudent, setActiveStudentState] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        // Assuming the API takes an empty object or parent identifier
        const response = await parentApi.getStudentList();
        const apiStudents = response.data || [];

        let mappedStudents: Student[] = [];

        if (Array.isArray(apiStudents) && apiStudents.length > 0) {
          mappedStudents = apiStudents.map((s: any, index: number) => ({
            id: s.id?.toString() || index.toString(),
            studentname: s.studentname || "Unknown",
            rollNo: s.rollno || "N/A",
            course: s.courseName || "N/A",
            section: s.sectionName || "N/A",
            semester: s.semesterId ? `Semester ${s.semesterId}` : s.semester || "N/A",
            avatarBg: ["from-blue-600 to-indigo-600 shadow-blue-500/20", "from-emerald-500 to-teal-500 shadow-emerald-500/20", "from-rose-500 to-pink-500 shadow-rose-500/20"][index % 3],
            cgpa: s.cgpa || 0,
            attendance: s.attendance || 0,
            feeDue: s.feeDue || 0,
            routeName: s.routeName || "N/A",
            vehicleNumber: s.vehicleNumber || "N/A",
            boardingPoint: s.boardingPoint || "N/A",
            pickupTime: s.pickupTime || "N/A",
            dropTime: s.dropTime || "N/A",
            driverName: s.driverName || "N/A",
            driverContact: s.driverContact || "N/A",
            isTransportOpted: !!s.transport,
          }));
        } else {
          // Fallback if the API returns empty
          mappedStudents = mockStudents;
        }

        setStudents(mappedStudents);

        const savedStudentId = sessionStorage.getItem("linkedStudentId");
        const currentStudent = savedStudentId
          ? mappedStudents.find(s => s.id === savedStudentId) || mappedStudents[0]
          : mappedStudents[0];

        if (currentStudent) {
          sessionStorage.setItem("linkedStudentId", currentStudent.id);
          sessionStorage.setItem("linkedStudentName", currentStudent.studentname);
          setActiveStudentState(currentStudent);
        }
      } catch (error) {
        console.error("Error loading students:", error);
        setStudents(mockStudents);
        const savedStudentId = sessionStorage.getItem("linkedStudentId");
        const currentStudent = savedStudentId
          ? mockStudents.find(s => s.id === savedStudentId) || mockStudents[0]
          : mockStudents[0];
        sessionStorage.setItem("linkedStudentId", currentStudent.id);
        sessionStorage.setItem("linkedStudentName", currentStudent.studentname);
        setActiveStudentState(currentStudent);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const setActiveStudent = (student: Student) => {
    sessionStorage.setItem("linkedStudentId", student.id);
    sessionStorage.setItem("linkedStudentName", student.studentname);
    setActiveStudentState(student);
  };

  return (
    <ParentStudentContext.Provider
      value={{
        students,
        activeStudent,
        setActiveStudent,
        loading,
      }}
    >
      {children}
    </ParentStudentContext.Provider>
  );
};

export const useParentStudent = () => {
  const context = useContext(ParentStudentContext);
  if (context === undefined) {
    throw new Error("useParentStudent must be used within a ParentStudentProvider");
  }
  return context;
};
