import {
  Users, BookOpen, FileText, UserCheck, MessageSquare, DollarSign, Plus,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const kpis = [
  { title: "Total Students", value: 12847, change: 12.5, icon: Users, spark: [40, 55, 48, 62, 58, 72, 80] },
  { title: "Total Courses", value: 186, change: 8.3, icon: BookOpen, spark: [10, 12, 14, 13, 16, 18, 20] },
  { title: "Total Blogs", value: 342, change: 15.2, icon: FileText, spark: [20, 28, 25, 35, 32, 40, 45] },
  { title: "Active Enrollments", value: 4523, change: 22.1, icon: UserCheck, spark: [100, 120, 140, 130, 160, 180, 200], variant: "primary" as const },
  { title: "New Leads", value: 891, change: -3.4, icon: MessageSquare, spark: [50, 48, 52, 45, 42, 40, 38] },
  { title: "Monthly Revenue", value: 284600, prefix: "₹", change: 18.7, icon: DollarSign, spark: [1000, 1400, 1200, 1800, 1600, 2200, 2600] },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Add Course
          </button>
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:shadow-card-hover transition-all"
          >
            <Plus className="h-4 w-4" /> Add Blog
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            prefix={kpi.prefix}
            change={kpi.change}
            icon={kpi.icon}
            sparkData={kpi.spark}
            index={i}
            variant={kpi.variant}
          />
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts />
    </div>
  );
};

export default Index;
