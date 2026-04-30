import { Package, ShoppingCart, Filter, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { dashboardApi, userApi, retailShopApi } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardChart from "./DashboardChart";

const WholesaleAnalytics = () => {
  let roleName = localStorage.getItem("role");
  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );
  // Wholesale States
  const [wholesalers, setWholesalers] = useState<any[]>([]);
  const [retailShops, setRetailShops] = useState<any[]>([]);
  const [selectedWholesaler, setSelectedWholesaler] = useState<string>(
    roleName === "admin" ? "all" : localStorage.getItem("userId") || "all"
  );
  const [selectedRetailShop, setSelectedRetailShop] = useState<string>("all");
  const [wholesaleMonthlyChartData, setWholesaleMonthlyChartData] = useState(
    []
  );
  const [wholesaleYearlyChartData, setWholesaleYearlyChartData] = useState([]);
  const [wholesaleYear, setWholesaleYear] = useState(
    new Date().getFullYear().toString()
  );

  useEffect(() => {
    if (roleName === "admin") {
      fetchWholesalers();
    }
  }, []);

  useEffect(() => {
    getWholesaleMonthlyRevenueOrders();
  }, [wholesaleYear, selectedWholesaler, selectedRetailShop]);

  useEffect(() => {
    getWholesaleYearlyRevenueOrders();
  }, [selectedWholesaler, selectedRetailShop]);

  useEffect(() => {
    if (selectedWholesaler !== "all") {
      fetchRetailShops(selectedWholesaler);
    } else {
      setRetailShops([]);
      setSelectedRetailShop("all");
    }
  }, [selectedWholesaler]);

  const fetchWholesalers = async () => {
    try {
      const result = await userApi.getAllUsers({ role: "wholesalerUser" });
      if (result.data.response.responseStatus === 200) {
        setWholesalers(result.data.users || []);
      }
    } catch (error) {
      console.error("Error fetching wholesalers:", error);
    }
  };

  const fetchRetailShops = async (wholesalerId: string) => {
    try {
      const result = await retailShopApi.getRetailShopList({
        wholesalerUserId:
          roleName === "admin" ? wholesalerId : localStorage.getItem("userId"),
        isActive: true,
      });
      if (result.data.response.responseStatus === 200) {
        setRetailShops(result.data.retailShop || []);
      }
    } catch (error) {
      console.error("Error fetching retail shops:", error);
    }
  };

  const getWholesaleMonthlyRevenueOrders = async () => {
    try {
      const params: any = { year: wholesaleYear };
      if (selectedWholesaler !== "all")
        params.userId =
          roleName === "admin"
            ? selectedWholesaler
            : localStorage.getItem("userId");
      if (selectedRetailShop !== "all")
        params.retailShopId = selectedRetailShop;

      const result = await dashboardApi.getWholesaleMonthlyRevenueOrders(
        params
      );
      if (result.data.response.responseStatus === 200) {
        setWholesaleMonthlyChartData(result.data.chartData);
      }
    } catch (error) {
      console.error("Error fetching wholesale monthly stats:", error);
    }
  };

  const getWholesaleYearlyRevenueOrders = async () => {
    try {
      const params: any = {};
      if (selectedWholesaler !== "all")
        params.userId =
          roleName === "admin"
            ? selectedWholesaler
            : localStorage.getItem("userId");
      if (selectedRetailShop !== "all")
        params.retailShopId = selectedRetailShop;

      const result = await dashboardApi.getWholesaleYearlyRevenueOrders(params);
      if (result.data.response.responseStatus === 200) {
        setWholesaleYearlyChartData(result.data.chartData);
      }
    } catch (error) {
      console.error("Error fetching wholesale yearly stats:", error);
    }
  };

  const clearFilters = () => {
    setSelectedWholesaler("all");
    setSelectedRetailShop("all");
    setWholesaleYear(new Date().getFullYear().toString());
  };
  return (
    <div>
      {/* Wholesale Filters */}
      <Card className="border-none shadow-medium bg-white/90 backdrop-blur-md">
        <CardHeader className="pb-4 border-b border-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <Filter className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle className="text-lg font-bold">
                Wholesale Analytics Filters
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-orange-600 gap-1.5 h-8"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleName === "admin" && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Select Wholesaler
                </label>
                <Select
                  value={selectedWholesaler}
                  onValueChange={setSelectedWholesaler}
                >
                  <SelectTrigger className="w-full bg-muted/30 border-none h-11 focus:ring-orange-500">
                    <SelectValue placeholder="All Wholesalers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wholesalers</SelectItem>
                    {wholesalers.map((w) => (
                      <SelectItem key={w._id} value={w._id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Retail Shop
              </label>
              <Select
                value={selectedRetailShop}
                onValueChange={setSelectedRetailShop}
                disabled={selectedWholesaler === "all"}
              >
                <SelectTrigger className="w-full bg-muted/30 border-none h-11 focus:ring-orange-500">
                  <SelectValue
                    placeholder={
                      selectedWholesaler === "all"
                        ? "Select Wholesaler first"
                        : "All Shops"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shops</SelectItem>
                  {retailShops.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.shopName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Time Period (Monthly Only)
              </label>
              <Select value={wholesaleYear} onValueChange={setWholesaleYear}>
                <SelectTrigger className="w-full bg-muted/30 border-none h-11 focus:ring-orange-500">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="monthly" className="w-full">
        <Card className="border-none shadow-medium bg-background/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-muted/20">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 bg-orange-500 rounded-full" />
                <CardTitle className="text-xl font-bold">
                  Wholesale Overview
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Bulky order analysis and wholesale distribution trends.
              </p>
            </div>

            <TabsList className="bg-muted/30">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-6">
            <TabsContent
              value="monthly"
              className="space-y-6 animate-in fade-in-50 duration-500"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <DashboardChart
                  title="Wholesale Monthly Revenue"
                  data={wholesaleMonthlyChartData}
                  type="area"
                  color="#f59e0b"
                  icon={ShoppingCart}
                  iconBg="bg-orange-100"
                  iconColor="text-orange-600"
                  gradientId="colorWholesaleMonthly"
                  yAxisPrefix="₹"
                />
                <DashboardChart
                  title="Wholesale Monthly Orders"
                  data={wholesaleMonthlyChartData}
                  type="bar"
                  color="#ea580c"
                  icon={Package}
                  iconBg="bg-orange-100"
                  iconColor="text-orange-600"
                />
              </div>
            </TabsContent>

            <TabsContent
              value="yearly"
              className="space-y-6 animate-in fade-in-50 duration-500"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <DashboardChart
                  title="Wholesale Yearly Revenue"
                  data={wholesaleYearlyChartData}
                  type="area"
                  color="#f59e0b"
                  icon={ShoppingCart}
                  iconBg="bg-orange-100"
                  iconColor="text-orange-600"
                  gradientId="colorWholesaleYearly"
                  yAxisPrefix="₹"
                />
                <DashboardChart
                  title="Wholesale Yearly Orders"
                  data={wholesaleYearlyChartData}
                  type="bar"
                  color="#ea580c"
                  icon={Package}
                  iconBg="bg-orange-100"
                  iconColor="text-orange-600"
                />
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default WholesaleAnalytics;
