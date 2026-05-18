import React, { useState, useEffect } from "react";
import { Bus, MapPin, Clock, User, Phone, Loader2, Info } from "lucide-react";
import { parentApi } from "@/services/api";

const ParentTransport = () => {
  const [loading, setLoading] = useState(true);
  const [transportData, setTransportData] = useState<any>(null);

  const studentId = sessionStorage.getItem("linkedStudentId") || "1";

  const fetchTransport = async () => {
    setLoading(true);
    try {
      const response = await parentApi.getTransport(studentId);
      if (response && response.data) {
        setTransportData(response.data);
      } else {
        // Mock fallback
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
      }
    } catch (error) {
      console.error("Error fetching transport:", error);
      // Mock fallback
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 relative z-10 shrink-0">
          <Bus className="w-8 h-8" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Transport Details
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Bus Route & Tracking
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Loading Transport Data...
          </span>
        </div>
      ) : transportData?.isTransportOpted ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Route Info Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">
                Route Information
              </h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Boarding Point
                  </p>
                  <p className="text-lg font-black text-slate-800 mt-1">
                    {transportData.boardingPoint}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-amber-600 rounded-md text-[10px] font-black uppercase tracking-widest">
                    {transportData.routeName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <Clock className="w-6 h-6 text-emerald-500 mb-2" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Pick-up Time
                  </p>
                  <p className="text-xl font-black text-slate-800 mt-1">
                    {transportData.pickupTime}
                  </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <Clock className="w-6 h-6 text-rose-500 mb-2" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Drop Time
                  </p>
                  <p className="text-xl font-black text-slate-800 mt-1">
                    {transportData.dropTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle & Driver Info Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <Bus className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">
                Vehicle & Driver
              </h3>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    Vehicle Number
                  </p>
                  <p className="text-2xl font-black text-indigo-900 mt-1 tracking-wider">
                    {transportData.vehicleNumber}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500">
                  <Bus className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-white hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Driver Name
                    </p>
                    <p className="text-sm font-black text-slate-800 mt-0.5">
                      {transportData.driverName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-white hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Driver Contact
                    </p>
                    <p className="text-sm font-black text-slate-800 mt-0.5">
                      {transportData.driverContact}
                    </p>
                  </div>
                  <a
                    href={`tel:${transportData.driverContact}`}
                    className="ml-auto px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-600 active:scale-95 transition-all shadow-sm"
                  >
                    Call Now
                  </a>
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
