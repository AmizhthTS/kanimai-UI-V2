import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Save,
  Loader2,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { masterApi } from "@/services/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import TextInput from "@/components/Inputs/TextInput";

interface BoardingPoint {
  id: string;
  pointName: string;
}

const RouteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(isEditing);

  const [allBoardingPoints, setAllBoardingPoints] = useState<BoardingPoint[]>(
    [],
  );
  const [selectedPoints, setSelectedPoints] = useState<BoardingPoint[]>([]);
  const [boardingSearch, setBoardingSearch] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      routeName: "",
    },
  });

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      // Fetch all available boarding points
      const pointsRes = await masterApi.getAllBoardingPoints();
      const pointsData = pointsRes.data.responseModelList || [];
      setAllBoardingPoints(pointsData);

      // If editing, fetch route details
      if (isEditing) {
        const routeRes = await masterApi.getRouteById(id as string);
        const routeData = routeRes.data;

        setValue("id", routeData.id);
        setValue("routeName", routeData.routeName);

        if (routeData.boardingPoints) {
          try {
            const parsedIds: string[] = JSON.parse(routeData.boardingPoints);
            // Reconstruct selected points in order based on IDs
            const reconstructedSelected = parsedIds
              .map((pid) => pointsData.find((p: BoardingPoint) => p.id === pid))
              .filter(Boolean) as BoardingPoint[];
            setSelectedPoints(reconstructedSelected);
          } catch (e) {
            console.error("Failed to parse boarding points JSON", e);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
      toast.error("Failed to load necessary data");
    } finally {
      setDataLoading(false);
    }
  };

  const onFormSubmit = async (data: any) => {
    if (selectedPoints.length === 0) {
      toast.error("Please add at least one boarding point to the route.");
      return;
    }

    setLoading(true);
    try {
      // Create JSON array of IDs per user requirement
      const orderIdList = selectedPoints.map((p) => p.id);
      const boardingPointsStr = JSON.stringify(orderIdList);

      const payload = {
        id: data.id,
        routeName: data.routeName,
        boardingPoints: boardingPointsStr,
      };

      await masterApi.saveRoute(payload);
      toast.success(
        isEditing ? "Route updated successfully" : "Route created successfully",
      );
      navigate("/admin/master/bus-route");
    } catch (error) {
      console.error("Error saving route:", error);
      toast.error("Failed to save route");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPoint = (point: BoardingPoint) => {
    setSelectedPoints([...selectedPoints, point]);
  };

  const handleRemovePoint = (pointId: string) => {
    setSelectedPoints(selectedPoints.filter((p) => p.id !== pointId));
  };

  const movePointUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...selectedPoints];
    [newOrder[index - 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index - 1],
    ];
    setSelectedPoints(newOrder);
  };

  const movePointDown = (index: number) => {
    if (index === selectedPoints.length - 1) return;
    const newOrder = [...selectedPoints];
    [newOrder[index + 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index + 1],
    ];
    setSelectedPoints(newOrder);
  };

  // Filter available points based on search AND removing already selected points
  const selectedIds = new Set(selectedPoints.map((p) => p.id));
  const availablePoints = allBoardingPoints.filter(
    (p) =>
      !selectedIds.has(p.id) &&
      p.pointName.toLowerCase().includes(boardingSearch.toLowerCase()),
  );

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* Header Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/master/bus-route")}
              className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-800 text-lg">
              {isEditing ? "Edit Route Details" : "Add Route Details"}
            </h3>
          </div>
        </div>

        <div className="p-6">
          <form
            id="route-form"
            onSubmit={handleSubmit(onFormSubmit)}
            className="w-full sm:w-1/2"
          >
            <TextInput
              control={control}
              errors={errors}
              name="routeName"
              textLable="Route Name"
              placeholderName="Enter Route Name"
              requiredMsg="Route Name is required"
              labelMandatory
            />
          </form>
        </div>
      </div>

      {/* Dual List Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Pane: Available Boarding Points */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px]">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm whitespace-nowrap">
              Boarding Name
            </h3>
            <div className="relative w-full max-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Boarding Point"
                className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium w-full focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={boardingSearch}
                onChange={(e) => setBoardingSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {availablePoints.length > 0 ? (
              availablePoints.map((point) => (
                <div
                  key={point.id}
                  onClick={() => handleSelectPoint(point)}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors shadow-sm"
                >
                  {point.pointName}
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm italic">
                {boardingSearch
                  ? "No matching points found."
                  : "All points selected."}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Selected Route Order */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px]">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-center bg-slate-50/50 min-h-[65px]">
            <h3 className="font-bold text-slate-800 text-sm">Route order</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
            {selectedPoints.length > 0 ? (
              selectedPoints.map((point, index) => (
                <div
                  key={point.id}
                  className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl shadow-sm group"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => movePointUp(index)}
                      disabled={index === 0}
                      className="text-slate-300 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePointDown(index)}
                      disabled={index === selectedPoints.length - 1}
                      className="text-slate-300 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 text-center text-sm font-bold text-slate-700">
                    {point.pointName}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePoint(point.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm italic">
                Click a boarding point on the left to add it to the route.
              </div>
            )}

            {/* Static Destination Box at the bottom */}
            {selectedPoints.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm font-black text-primary text-center">
                  College - Destination
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/master/bus-route")}
              className="px-6 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md hover:bg-slate-700 transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              form="route-form"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteForm;
