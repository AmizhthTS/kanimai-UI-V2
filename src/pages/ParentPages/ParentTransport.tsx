import React, { useState, useEffect } from "react";
import {
  Bus,
  MapPin,
  Clock,
  User,
  Phone,
  Loader2,
  Info,
  Navigation,
  ShieldAlert,
  BellRing,
  AlertTriangle,
  Settings,
  PhoneCall,
  Activity,
  Heart,
} from "lucide-react";
import { parentApi } from "@/services/api";
import { useParentStudent } from "@/contexts/ParentStudentContext";
import { toast } from "sonner";

const ParentTransport = () => {
  const [loading, setLoading] = useState(true);
  const [transportData, setTransportData] = useState<any>(null);

  const { activeStudent } = useParentStudent();
  const studentId = activeStudent?.id || "1";
  const studentName = activeStudent?.name || "Student";

  // Real-time GPS simulation state
  const [busProgress, setBusProgress] = useState(30);
  const [eta, setEta] = useState(8);
  const [speed, setSpeed] = useState(48);
  const [geoFenceAlert, setGeoFenceAlert] = useState(true);
  const [gpsStatus, setGpsStatus] = useState("ACTIVE");
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [logs, setLogs] = useState<any[]>([
    {
      time: "08:12 AM",
      text: "Bus approaching Junction (0.5 km away)",
      type: "info",
    },
    {
      time: "08:05 AM",
      text: "Geofence Entered: 2km campus radius alert",
      type: "warning",
    },
    {
      time: "07:55 AM",
      text: "Safe Drive Mode: Checked-in by driver Suresh",
      type: "success",
    },
  ]);

  // Interpolated SVG roadmap path
  const pathPoints = [
    { x: 40, y: 150, label: "Campus Gate" },
    { x: 120, y: 150, label: "Main Highway" },
    { x: 160, y: 80, label: "Highway Junction" },
    { x: 260, y: 80, label: "Central Bypass" },
    { x: 340, y: 140, label: "Boarding Stop" },
  ];

  const getBusCoords = (progress: number) => {
    const totalSegments = pathPoints.length - 1;
    const segmentWidth = 100 / totalSegments;
    const currentSegmentIndex = Math.min(
      totalSegments - 1,
      Math.floor(progress / segmentWidth),
    );
    const segmentProgress = (progress % segmentWidth) / segmentWidth;

    const p1 = pathPoints[currentSegmentIndex];
    const p2 = pathPoints[currentSegmentIndex + 1];

    return {
      x: p1.x + (p2.x - p1.x) * segmentProgress,
      y: p1.y + (p2.y - p1.y) * segmentProgress,
    };
  };

  const busCoords = getBusCoords(busProgress);

  const triggerEmergencySOS = () => {
    toast.error("Emergency Alert Broadcasted to Administration!", {
      duration: 5000,
    });
    setLogs((prev) => [
      {
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: "SOS Broadcast triggered by Parent",
        type: "danger",
      },
      ...prev,
    ]);
  };

  const triggerDelaySimulation = () => {
    const randomDelay = Math.floor(Math.random() * 10) + 5;
    setDelayMinutes(randomDelay);
    toast.warning(`Simulated a traffic delay of ${randomDelay} minutes.`);
    setLogs((prev) => [
      {
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: `Traffic Delay Notification: +${randomDelay} mins`,
        type: "danger",
      },
      ...prev,
    ]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBusProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        const nextProgress = prev + 2.5;
        // Recalculate ETA
        const newEta = Math.max(1, Math.round(15 - nextProgress * 0.15));
        setEta(newEta + delayMinutes);
        // Slightly random speed
        setSpeed(Math.floor(42 + Math.random() * 16));
        return nextProgress;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [delayMinutes]);

  const fetchTransport = async () => {
    setLoading(true);
    try {
      const response = await parentApi.getTransport(studentId);
      if (response && response.data) {
        setTransportData(response.data);
      } else {
        setTransportData({
          isTransportOpted: activeStudent?.isTransportOpted ?? true,
          routeName: activeStudent?.routeName || "Route 5 - Downtown",
          vehicleNumber: activeStudent?.vehicleNumber || "TN-37-BX-1234",
          boardingPoint: activeStudent?.boardingPoint || "Central Station",
          pickupTime: activeStudent?.pickupTime || "07:30 AM",
          dropTime: activeStudent?.dropTime || "04:45 PM",
          driverName: activeStudent?.driverName || "Suresh Kumar",
          driverContact: activeStudent?.driverContact || "9876543211",
        });
      }
    } catch (error) {
      console.error("Error fetching transport:", error);
      setTransportData({
        isTransportOpted: true,
        routeName: "Route 5 - Downtown",
        vehicleNumber: "TN-37-BX-1234",
        boardingPoint: "Central Station",
        pickupTime: "07:30 AM",
        dropTime: "04:45 PM",
        driverName: "Suresh Kumar",
        driverContact: "9876543211",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransport();
  }, [studentId]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <Bus className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Vehicle Tracking & GPS
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Live updates & safety panel for {studentName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={triggerEmergencySOS}
            className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            SOS Trigger
          </button>
          <button
            onClick={triggerDelaySimulation}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 hidden sm:block"
          >
            Simulate Delay
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Loading Transport Data...
          </span>
        </div>
      ) : transportData?.isTransportOpted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Route, Driver, Delay & Alerts */}
          <div className="lg:col-span-5 space-y-6">
            {/* Route Information Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">
                  Route Information
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Boarding Point
                  </p>
                  <p className="text-lg font-black text-slate-800 mt-1">
                    {transportData.boardingPoint}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest">
                    {transportData.routeName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                    <Clock className="w-5 h-5 text-emerald-500 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Pick-up Time
                    </p>
                    <p className="text-base font-black text-slate-800 mt-1">
                      {transportData.pickupTime}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                    <Clock className="w-5 h-5 text-rose-500 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Drop Time
                    </p>
                    <p className="text-base font-black text-slate-800 mt-1">
                      {transportData.dropTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle & Driver Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <User className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">
                  Vehicle & Driver
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                      Vehicle Number
                    </p>
                    <p className="text-xl font-black text-indigo-900 mt-1 tracking-wider">
                      {transportData.vehicleNumber}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500">
                    <Bus className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Driver Name
                    </p>
                    <p className="text-sm font-black text-slate-800 truncate">
                      {transportData.driverName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Driver Contact
                    </p>
                    <p className="text-sm font-black text-slate-800">
                      {transportData.driverContact}
                    </p>
                  </div>
                  <a
                    href={`tel:${transportData.driverContact}`}
                    className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-600 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Tracking Simulation & Safety */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live GPS Tracker Map Component */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Navigation className="w-5 h-5 text-indigo-500 animate-pulse" />
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">
                    Live GPS Tracker
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    STATUS: {gpsStatus}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {/* Simulated Road Canvas Map (SVG) */}
                <div className="relative w-full h-[280px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* SVG Route Rendering */}
                  <svg
                    className="w-full h-full absolute inset-0 z-0 p-4"
                    viewBox="0 0 400 200"
                  >
                    {/* Outer Road Stroke */}
                    <path
                      d="M 40 150 L 120 150 L 160 80 L 260 80 L 340 140"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Middle Dash Road Line */}
                    <path
                      d="M 40 150 L 120 150 L 160 80 L 260 80 L 340 140"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="4"
                      strokeDasharray="8 8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-75"
                    />

                    {/* Stops Nodes */}
                    {pathPoints.map((pt, idx) => (
                      <g key={idx}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="8"
                          fill="#1e293b"
                          stroke="#4f46e5"
                          strokeWidth="2"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 14}
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {pt.label}
                        </text>
                      </g>
                    ))}

                    {/* Moving School Bus Node */}
                    <g
                      transform={`translate(${busCoords.x - 12}, ${busCoords.y - 12})`}
                    >
                      <rect
                        width="24"
                        height="24"
                        rx="6"
                        fill="#facc15"
                        className="shadow-lg animate-bounce"
                      />
                      <text
                        x="12"
                        y="15"
                        fill="#0f172a"
                        fontSize="10"
                        fontWeight="black"
                        textAnchor="middle"
                      >
                        🚌
                      </text>
                    </g>
                  </svg>

                  {/* On-Map Statistics Overlays */}
                  <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-3">
                    <div>
                      <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        SPEED
                      </span>
                      <span className="text-sm font-black text-emerald-400">
                        {speed} km/h
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-3">
                    <div>
                      <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        ESTIMATED ETA
                      </span>
                      <span className="text-sm font-black text-indigo-400">
                        {eta} mins
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">
                      Live Telemetry Stream
                    </span>
                  </div>
                </div>

                {/* Safety Geo-fencing Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          Geo-fencing Alerts
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold">
                          Notify when bus is 2km away
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={geoFenceAlert}
                        onChange={() => setGeoFenceAlert(!geoFenceAlert)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                        <BellRing className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          Delay Pushes
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold">
                          Notify delay & ETA shifts
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>

                {/* Tracking Activity Logs */}
                <div className="mt-6 border border-slate-100 rounded-2xl p-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Tracking Activity & Alerts Log
                  </h4>
                  <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1">
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between text-[11px] py-1 border-b border-slate-50 last:border-0 gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              log.type === "danger"
                                ? "bg-rose-500 animate-ping"
                                : log.type === "warning"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                          />
                          <span className="text-slate-600 font-medium">
                            {log.text}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
                          {log.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 py-20 flex flex-col items-center justify-center text-center px-4">
          <Info className="w-16 h-16 text-slate-200 mb-4" />
          <h2 className="text-xl font-black text-slate-800 mb-2">
            Transport Not Opted
          </h2>
          <p className="text-sm text-slate-500 max-w-md">
            The student is not currently enrolled in the college transport
            facility. If you wish to avail this service, please contact the
            transport department.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParentTransport;
