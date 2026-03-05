import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const lineDataByPeriod: Record<string, { label: string; enrollments: number; revenue: number; leads: number }[]> = {
  "7d": [
    { label: "Day 1", enrollments: 15, revenue: 500, leads: 5 },
    { label: "Day 2", enrollments: 25, revenue: 800, leads: 8 },
    { label: "Day 3", enrollments: 30, revenue: 1000, leads: 10 },
    { label: "Day 4", enrollments: 20, revenue: 700, leads: 7 },
    { label: "Day 5", enrollments: 35, revenue: 1200, leads: 12 },
    { label: "Day 6", enrollments: 40, revenue: 1500, leads: 15 },
    { label: "Day 7", enrollments: 45, revenue: 1800, leads: 18 },
  ],
  "30d": [
    { label: "Week 1", enrollments: 120, revenue: 4200, leads: 45 },
    { label: "Week 2", enrollments: 180, revenue: 5800, leads: 62 },
    { label: "Week 3", enrollments: 240, revenue: 7200, leads: 78 },
    { label: "Week 4", enrollments: 310, revenue: 9400, leads: 95 },
  ],
  "90d": [
    { label: "Jan", enrollments: 120, revenue: 4200, leads: 45 },
    { label: "Feb", enrollments: 180, revenue: 5800, leads: 62 },
    { label: "Mar", enrollments: 240, revenue: 7200, leads: 78 },
    { label: "Apr", enrollments: 310, revenue: 9400, leads: 95 },
    { label: "May", enrollments: 280, revenue: 8600, leads: 88 },
    { label: "Jun", enrollments: 390, revenue: 11200, leads: 120 },
    { label: "Jul", enrollments: 450, revenue: 13800, leads: 145 },
  ],
};

const barData = [
  { name: "React Mastery", students: 486 },
  { name: "Python AI/ML", students: 412 },
  { name: "Cloud DevOps", students: 378 },
  { name: "UI/UX Design", students: 324 },
  { name: "Data Science", students: 298 },
];

const pieDataByPeriod: Record<string, { name: string; students: number; courseId: number }[]> = {
  "7d": [
    { name: "React Mastery", students: 68, courseId: 1 },
    { name: "Python AI/ML", students: 54, courseId: 2 },
    { name: "Cloud DevOps", students: 47, courseId: 3 },
    { name: "UI/UX Design", students: 39, courseId: 4 },
    { name: "Data Science", students: 32, courseId: 5 },
  ],
  "30d": [
    { name: "React Mastery", students: 486, courseId: 1 },
    { name: "Python AI/ML", students: 412, courseId: 2 },
    { name: "Cloud DevOps", students: 378, courseId: 3 },
    { name: "UI/UX Design", students: 324, courseId: 4 },
    { name: "Data Science", students: 298, courseId: 5 },
  ],
  "90d": [
    { name: "React Mastery", students: 1420, courseId: 1 },
    { name: "Python AI/ML", students: 1180, courseId: 2 },
    { name: "Cloud DevOps", students: 1050, courseId: 3 },
    { name: "UI/UX Design", students: 890, courseId: 4 },
    { name: "Data Science", students: 780, courseId: 5 },
  ],
};

const PIE_COLORS = ["#0F9D8A", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444"];

const timeFilters = ["7d", "30d", "90d"] as const;

interface LineConfig {
  key: string;
  label: string;
  color: string;
  yAxisId: string;
  unit: string;
}

const lineConfigs: LineConfig[] = [
  { key: "enrollments", label: "Enrollments", color: "#0F9D8A", yAxisId: "left", unit: "" },
  { key: "revenue", label: "Revenue (₹)", color: "#3B82F6", yAxisId: "right", unit: "₹" },
  { key: "leads", label: "Leads", color: "#F59E0B", yAxisId: "left", unit: "" },
];

export function DashboardCharts() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>("30d");
  const [pieFilter, setPieFilter] = useState<string>("30d");
  const [activeLines, setActiveLines] = useState<Set<string>>(new Set(["enrollments", "revenue", "leads"]));

  const currentLineData = lineDataByPeriod[activeFilter] || lineDataByPeriod["30d"];
  const currentPieData = pieDataByPeriod[pieFilter] || pieDataByPeriod["30d"];
  const totalStudents = currentPieData.reduce((sum, d) => sum + d.students, 0);
  const pieDataWithPercent = currentPieData.map((d) => ({
    ...d,
    value: d.students,
    percent: ((d.students / totalStudents) * 100).toFixed(1),
  }));

  const toggleLine = (key: string) => {
    setActiveLines((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const showRightAxis = activeLines.has("revenue");
  const showLeftAxis = activeLines.has("enrollments") || activeLines.has("leads");

  // Calculate dynamic Y domains
  const getLeftDomain = () => {
    const keys = ["enrollments", "leads"].filter((k) => activeLines.has(k));
    if (keys.length === 0) return [0, 100];
    const max = Math.max(...currentLineData.flatMap((d) => keys.map((k) => d[k as keyof typeof d] as number)));
    return [0, Math.ceil(max * 1.15)];
  };

  const getRightDomain = () => {
    if (!activeLines.has("revenue")) return [0, 100];
    const max = Math.max(...currentLineData.map((d) => d.revenue));
    return [0, Math.ceil(max * 1.15)];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Line Chart - spans 2 cols */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold font-heading text-foreground">Growth Overview</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Click metrics to compare</p>
          </div>
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {timeFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${activeFilter === f
                  ? "gradient-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Line toggles */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lineConfigs.map((lc) => {
            const isActive = activeLines.has(lc.key);
            return (
              <button
                key={lc.key}
                onClick={() => toggleLine(lc.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${isActive
                  ? "border-transparent shadow-sm"
                  : "border-border text-muted-foreground opacity-50 hover:opacity-80"
                  }`}
                style={isActive ? { backgroundColor: lc.color + "18", color: lc.color, borderColor: lc.color + "40" } : {}}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: lc.color, opacity: isActive ? 1 : 0.3 }} />
                {lc.label}
              </button>
            );
          })}
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={currentLineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            {showLeftAxis && (
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                domain={getLeftDomain()}
                label={{ value: activeLines.has("enrollments") ? "Enrollments / Leads" : "Leads", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }}
              />
            )}
            {showRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                domain={getRightDomain()}
                tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)} k`}
                label={{ value: "Revenue (₹)", angle: 90, position: "insideRight", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }}
              />
            )}
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                fontSize: 12,
              }}
              formatter={(value: number, name: string) => {
                const cfg = lineConfigs.find((c) => c.key === name);
                return [cfg?.unit === "₹" ? `₹${value.toLocaleString()} ` : value, cfg?.label || name];
              }}
            />
            {lineConfigs.map((lc) =>
              activeLines.has(lc.key) ? (
                <Line
                  key={lc.key}
                  type="monotone"
                  dataKey={lc.key}
                  stroke={lc.color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: lc.color }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                  yAxisId={lc.yAxisId}
                  animationDuration={600}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="bg-card rounded-2xl border border-border shadow-card p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold font-heading text-foreground">Course Categories</h3>
          <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
            {(["7d", "30d", "90d"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setPieFilter(f)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${pieFilter === f ? "gradient-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Click a slice to view course</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieDataWithPercent}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              strokeWidth={2}
              stroke="hsl(var(--card))"
              label={({ percent }) => `${percent}% `}
              labelLine={false}
              cursor="pointer"
              onClick={(_: never, index: number) => {
                const course = pieDataWithPercent[index];
                if (course) navigate(`/courses`);
              }}
            >
              {pieDataWithPercent.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i]} className="cursor-pointer hover:opacity-80 transition-opacity" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-xl border border-border bg-popover text-popover-foreground px-3 py-2 shadow-lg text-xs">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-muted-foreground mt-0.5">{d.students} students · {d.percent}%</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {pieDataWithPercent.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
              <span className="text-[11px] text-muted-foreground truncate">{d.name}</span>
              <span className="text-[10px] font-medium text-foreground ml-auto">{d.percent}%</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border text-center">
          <p className="text-lg font-bold text-foreground">{totalStudents.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Total Enrolled Students</p>
        </div>
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card p-6"
      >
        <h3 className="text-base font-semibold font-heading text-foreground mb-1">Top Performing Courses</h3>
        <p className="text-xs text-muted-foreground mb-4">By enrolled students</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={110} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, background: "hsl(var(--card))", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="students" fill="#0F9D8A" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="bg-card rounded-2xl border border-border shadow-card p-6"
      >
        <h3 className="text-base font-semibold font-heading text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { label: "New enrollment", desc: "React Mastery Pro", time: "2m ago", color: "bg-success" },
            { label: "Lead captured", desc: "john@example.com", time: "15m ago", color: "bg-info" },
            { label: "Blog published", desc: "AI in Education", time: "1h ago", color: "bg-warning" },
            { label: "Course updated", desc: "Python Bootcamp", time: "3h ago", color: "bg-primary" },
            { label: "New student", desc: "Sarah Williams", time: "5h ago", color: "bg-success" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${item.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-none">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{item.desc}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
