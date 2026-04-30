import { Package, ShoppingCart, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { dashboardApi } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardChart from "./DashboardChart";

const RetailAnalytics = () => {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  useEffect(() => {
    getYearlyRevenueOrders();
  }, []);

  useEffect(() => {
    getMonthlyRevenueOrders(selectedYear);
  }, [selectedYear]);

  const [chartData, setChartData] = useState([]);
  const getMonthlyRevenueOrders = async (year?: string) => {
    try {
      const result = await dashboardApi.getMonthlyRevenueOrders(year);
      if (result.data.response.responseStatus === 200) {
        setChartData(result.data.chartData);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );
  const [yearlyChartData, setYearlyChartData] = useState([]);
  const getYearlyRevenueOrders = async () => {
    try {
      const result = await dashboardApi.getYearlyRevenueOrders();
      if (result.data.response.responseStatus === 200) {
        setYearlyChartData(result.data.chartData);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <Tabs defaultValue="monthly" className="w-full">
      <Card className="border-none shadow-medium bg-background/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-muted/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-pink-500 rounded-full" />
              <CardTitle className="text-xl font-bold">
                Retail Overview
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Performance trends for standard customer orders.
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
            <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-muted/50 shadow-sm">
              <span className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Monthly Performance for {selectedYear}
              </span>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px] bg-white h-9">
                  <SelectValue placeholder="Year" />
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

            <div className="grid gap-6 md:grid-cols-2">
              <DashboardChart
                title="Retail Monthly Revenue"
                data={chartData}
                type="area"
                color="#ec4899"
                icon={ShoppingCart}
                iconBg="bg-pink-100"
                iconColor="text-pink-600"
                gradientId="colorRetailMonthly"
                yAxisPrefix="₹"
              />
              <DashboardChart
                title="Retail Monthly Orders"
                data={chartData}
                type="bar"
                color="#db2777"
                icon={Package}
                iconBg="bg-pink-100"
                iconColor="text-pink-600"
              />
            </div>
          </TabsContent>

          <TabsContent
            value="yearly"
            className="space-y-6 animate-in fade-in-50 duration-500"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardChart
                title="Retail Yearly Revenue"
                data={yearlyChartData}
                type="area"
                color="#ec4899"
                icon={ShoppingCart}
                iconBg="bg-pink-100"
                iconColor="text-pink-600"
                gradientId="colorRetailYearly"
                yAxisPrefix="₹"
              />
              <DashboardChart
                title="Retail Yearly Orders"
                data={yearlyChartData}
                type="bar"
                color="#db2777"
                icon={Package}
                iconBg="bg-pink-100"
                iconColor="text-pink-600"
              />
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default RetailAnalytics;
