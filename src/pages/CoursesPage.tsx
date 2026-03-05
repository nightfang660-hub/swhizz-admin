import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Download, Plus, BookOpen, MoreHorizontal, Edit, Trash2, Eye, X, Upload,
  Grid3X3, List, Users, Layers, CheckCircle, FileEdit, GripVertical, Clock, DollarSign,
  Globe, Tag, Award, Settings2, Copy, ExternalLink, ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MiniSparkline } from "@/components/dashboard/MiniSparkline";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface ModuleData {
  id: number;
  number: number;
  title: string;
  description: string;
  thumbnail: string;
  topics: string[];
  published?: boolean;
}

interface CourseData {
  id: number;
  title: string;
  slug: string;
  category: string;
  students: number;
  status: string;
  price: string;
  updated: string;
  description: string;
  thumbnail: string | null;
  instructor: string;
  technologies: { name: string; icon: string }[];
  modules: ModuleData[];
  featured: boolean;
  certificate: boolean;
  accessDuration: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

const initialCourses: CourseData[] = [
  {
    id: 1, title: "React Mastery Pro", slug: "react-mastery-pro", category: "Web Dev", students: 486, status: "Published", price: "₹99", updated: "2 days ago",
    description: "Master React with hooks, context, Redux and build production apps.", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    instructor: "John Smith", technologies: [{ name: "React", icon: "⚛️" }, { name: "TypeScript", icon: "🔷" }],
    modules: [{ id: 1, number: 1, title: "Introduction to React", description: "Learn React from scratch", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop", topics: ["JSX", "Components"] }],
    featured: true, certificate: true, accessDuration: "Lifetime", metaTitle: "React Mastery Pro", metaDescription: "Learn React", keywords: "react"
  },
  {
    id: 2, title: "Python AI/ML Bootcamp", slug: "python-ai-ml-bootcamp", category: "Data Science", students: 412, status: "Published", price: "₹149", updated: "5 days ago",
    description: "Complete AI and Machine Learning bootcamp.", thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
    instructor: "Emily Chen", technologies: [{ name: "Python", icon: "🐍" }, { name: "TensorFlow", icon: "🧠" }],
    modules: [{ id: 4, number: 1, title: "Python Fundamentals", description: "Python arrays and types", thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop", topics: ["Data Types", "Loops"] }],
    featured: true, certificate: true, accessDuration: "Lifetime", metaTitle: "", metaDescription: "", keywords: ""
  },
  {
    id: 3, title: "Cloud DevOps Essentials", slug: "cloud-devops-essentials", category: "Cloud", students: 378, status: "Draft", price: "Free", updated: "1 week ago",
    description: "Learn cloud infrastructure.", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
    instructor: "Alex Johnson", technologies: [{ name: "Docker", icon: "🐳" }, { name: "AWS", icon: "☁️" }],
    modules: [{ id: 7, number: 1, title: "Cloud Basics", description: "AWS servers", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop", topics: ["EC2", "S3"] }],
    featured: false, certificate: false, accessDuration: "6 Months", metaTitle: "", metaDescription: "", keywords: ""
  },
  {
    id: 4, title: "UI/UX Design Fundamentals", slug: "ui-ux-design-fundamentals", category: "Design", students: 324, status: "Published", price: "₹79", updated: "3 days ago",
    description: "Design beautiful interfaces.", thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    instructor: "Sarah Davis", technologies: [{ name: "Figma", icon: "🎨" }],
    modules: [{ id: 9, number: 1, title: "Design Principles", description: "Color theory", thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop", topics: ["Colors", "Typography"] }],
    featured: false, certificate: true, accessDuration: "Lifetime", metaTitle: "", metaDescription: "", keywords: ""
  },
  {
    id: 5, title: "Data Science with R", slug: "data-science-with-r", category: "Data Science", students: 298, status: "Published", price: "₹129", updated: "1 day ago",
    description: "Statistical analysis and data visualization.", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    instructor: "Mark Lee", technologies: [{ name: "Python", icon: "🐍" }],
    modules: [{ id: 11, number: 1, title: "R Basics", description: "R environment", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop", topics: ["RStudio", "DataFrames"] }],
    featured: false, certificate: true, accessDuration: "1 Year", metaTitle: "", metaDescription: "", keywords: ""
  },
  {
    id: 6, title: "Flutter Mobile Apps", slug: "flutter-mobile-apps", category: "Mobile", students: 245, status: "Draft", price: "₹89", updated: "4 days ago",
    description: "Build cross-platform mobile applications.", thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    instructor: "Priya Sharma", technologies: [{ name: "Flutter", icon: "💙" }],
    modules: [{ id: 13, number: 1, title: "Dart Language", description: "Dart concepts", thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop", topics: ["Variables", "Functions"] }],
    featured: false, certificate: false, accessDuration: "Lifetime", metaTitle: "", metaDescription: "", keywords: ""
  },
];

const categoryColors: Record<string, string> = {
  "Web Dev": "bg-info/10 text-info",
  "Data Science": "bg-warning/10 text-warning",
  "Cloud": "bg-primary/10 text-primary",
  "Design": "bg-accent text-accent-foreground",
  "Mobile": "bg-success/10 text-success",
};

const techIcons: Record<string, string> = {
  "React": "⚛️", "Python": "🐍", "JavaScript": "🟨", "TypeScript": "🔷", "Node.js": "🟢",
  "Docker": "🐳", "AWS": "☁️", "Firebase": "🔥", "MongoDB": "🍃", "PostgreSQL": "🐘",
  "Flutter": "💙", "Swift": "🍎", "Kotlin": "🟣", "Go": "🔵", "Rust": "🦀",
  "Vue": "💚", "Angular": "🔴", "Next.js": "▲", "TensorFlow": "🧠", "Figma": "🎨",
};

export default function CoursesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewCourse, setViewCourse] = useState<CourseData | null>(null);
  const [editingModule, setEditingModule] = useState<{ courseId: number, module: ModuleData } | null>(null);
  const [moduleDrawer, setModuleDrawer] = useState<CourseData | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: courses.length,
    totalModules: courses.reduce((a, c) => a + c.modules.length, 0),
    published: courses.filter(c => c.status === "Published").length,
    draft: courses.filter(c => c.status === "Draft").length,
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setCourses((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Course deleted successfully");
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    const csv = "Title,Category,Students,Price,Status\n" + courses.map((c) => `${c.title},${c.category},${c.students},${c.price},${c.status}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "courses.csv"; a.click();
    toast.success("Courses exported as CSV");
  };

  const handleSaveModule = () => {
    if (!editingModule) return;
    const { courseId, module } = editingModule;
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const exists = c.modules.some(m => m.id === module.id);
      const newModules = exists ? c.modules.map(m => m.id === module.id ? module : m) : [...c.modules, module];
      return { ...c, modules: newModules };
    }));
    if (moduleDrawer && moduleDrawer.id === courseId) {
      const exists = moduleDrawer.modules.some(m => m.id === module.id);
      const newModules = exists ? moduleDrawer.modules.map(m => m.id === module.id ? module : m) : [...moduleDrawer.modules, module];
      setModuleDrawer({ ...moduleDrawer, modules: newModules });
    }
    setEditingModule(null);
    toast.success("Module saved successfully");
  };

  const handleDragEnd = (result: DropResult, courseId: number) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (moduleDrawer) {
      const items = Array.from(moduleDrawer.modules);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedItems = items.map((item, index) => ({
        ...item,
        number: index + 1
      }));

      const updatedCourse = { ...moduleDrawer, modules: updatedItems };
      setModuleDrawer(updatedCourse);
      setCourses(prev => prev.map(c => c.id === courseId ? updatedCourse : c));
    }
  };

  const duplicateCourse = (c: CourseData) => {
    const dup = { ...c, id: Date.now(), title: `${c.title} (Copy)`, slug: `${c.slug}-copy`, status: "Draft", students: 0 };
    setCourses((prev) => [dup, ...prev]);
    toast.success(`"${c.title}" duplicated as Draft`);
  };

  // toggleModulePublish — available for future use when a publish toggle UI is added

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const bulkDelete = () => {
    setCourses(prev => prev.filter(c => !selectedIds.has(c.id)));
    toast.success(`${selectedIds.size} course(s) deleted`);
    setSelectedIds(new Set());
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-1"><div className="h-7 w-48 bg-muted rounded animate-pulse" /><div className="h-4 w-64 bg-muted rounded animate-pulse" /></div>
          <div className="h-9 w-32 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)}</div>
        <TableSkeleton rows={6} cols={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <span>Dashboard</span><ChevronRight className="h-3 w-3" /><span className="text-foreground font-medium">Courses</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Course Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage courses and modules</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search courses..." className="h-9 w-56 rounded-lg border border-input bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 px-3 rounded-lg border border-input text-sm text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1.5 transition-colors">
                <Filter className="h-3.5 w-3.5" /> {statusFilter === "All" ? "All" : statusFilter}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              {["All", "Published", "Draft", "Archived"].map((s) => (
                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>{s}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button onClick={() => navigate("/courses/new")} className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> Create Course
          </button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Courses", value: stats.total, icon: BookOpen, spark: [3, 4, 5, 4, 6, 5, stats.total], color: "text-primary" },
          { label: "Total Modules", value: stats.totalModules, icon: Layers, spark: [8, 10, 12, 11, 14, 13, stats.totalModules], color: "text-info" },
          { label: "Published", value: stats.published, icon: CheckCircle, spark: [2, 3, 3, 4, 3, 4, stats.published], color: "text-success" },
          { label: "Drafts", value: stats.draft, icon: FileEdit, spark: [1, 2, 1, 2, 2, 1, stats.draft], color: "text-warning" },
        ].map((s, i) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border shadow-card p-4 hover:shadow-card-hover transition-all duration-200 group">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl gradient-soft ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
              <MiniSparkline data={s.spark} color={s.color === "text-primary" ? "#0F9D8A" : s.color === "text-info" ? "#3B82F6" : s.color === "text-success" ? "#22C55E" : "#F59E0B"} />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Bulk actions & view toggle */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 bg-destructive/5 rounded-lg px-3 py-1.5">
              <span className="text-xs font-medium text-destructive">{selectedIds.size} selected</span>
              <button onClick={bulkDelete} className="text-xs font-medium text-destructive hover:underline">Delete</button>
              <button onClick={() => setSelectedIds(new Set())} className="text-xs text-muted-foreground hover:underline">Clear</button>
            </div>
          )}
          <button onClick={handleExport} className="h-8 px-3 rounded-lg border border-input text-xs text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1.5 transition-colors">
            <Download className="h-3 w-3" /> Export
          </button>
        </div>
        <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
          <button onClick={() => setViewMode("grid")} className={`h-7 w-7 flex items-center justify-center rounded-md transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}><Grid3X3 className="h-3.5 w-3.5" /></button>
          <button onClick={() => setViewMode("table")} className={`h-7 w-7 flex items-center justify-center rounded-md transition-all ${viewMode === "table" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}><List className="h-3.5 w-3.5" /></button>
        </div>
      </motion.div>

      {/* Course Display */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-16 text-sm text-muted-foreground">No courses found</div>
            ) : filtered.map((c) => (
              <div key={c.id} className="group bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-200 overflow-hidden">
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full gradient-soft flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge className={c.status === "Published" ? "bg-success/90 text-success-foreground border-0 text-[10px]" : "bg-warning/90 text-warning-foreground border-0 text-[10px]"}>{c.status}</Badge>
                    {c.featured && <Badge className="bg-primary/90 text-primary-foreground border-0 text-[10px]">Featured</Badge>}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="h-4 w-4 rounded border-2 border-card accent-primary" />
                  </div>
                  {/* Quick actions on hover */}
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setViewCourse(c)} className="h-7 w-7 flex items-center justify-center rounded-lg bg-card/90 backdrop-blur text-foreground hover:bg-card shadow-sm"><Eye className="h-3.5 w-3.5" /></button>
                    <button onClick={() => navigate(`/courses/${c.id}/edit`)} className="h-7 w-7 flex items-center justify-center rounded-lg bg-card/90 backdrop-blur text-foreground hover:bg-card shadow-sm"><Edit className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${categoryColors[c.category] || ""}`}>{c.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">{c.price}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">{c.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.students}</span>
                      <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> {c.modules.length} Syllabus Modules</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl w-48">
                        <DropdownMenuItem onClick={() => setViewCourse(c)}><Eye className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/courses/${c.id}/edit`)}><Edit className="h-4 w-4 mr-2" /> Edit Course</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setModuleDrawer(c)}><Layers className="h-4 w-4 mr-2" /> Manage Modules</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => duplicateCourse(c)}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuItem><ExternalLink className="h-4 w-4 mr-2" /> Preview</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteId(c.id)} className="text-destructive focus:text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-foreground">{c.instructor.split(" ").map(n => n[0]).join("")}</div>
                    <span className="text-xs text-muted-foreground">{c.instructor}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{c.updated}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded accent-primary" onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(new Set(filtered.map(c => c.id)));
                      } else {
                        setSelectedIds(new Set());
                      }
                    }} /></th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Course</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Instructor</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Students</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Modules</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Price</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">No courses found</td></tr>
                  ) : filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="rounded accent-primary" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {c.thumbnail ? (
                            <img src={c.thumbnail} alt="" className="h-9 w-14 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="h-9 w-14 rounded-lg gradient-soft flex items-center justify-center shrink-0"><BookOpen className="h-4 w-4 text-primary/40" /></div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-foreground">{c.title}</span>
                            <span className="block text-[10px] text-muted-foreground">{c.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{c.instructor}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{c.students}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{c.modules.length} Highlights</td>
                      <td className="px-4 py-3 text-sm text-foreground">{c.price}</td>
                      <td className="px-4 py-3">
                        <Badge variant={c.status === "Published" ? "default" : "secondary"} className={c.status === "Published" ? "bg-success/10 text-success border-0 hover:bg-success/20" : ""}>{c.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl w-48">
                            <DropdownMenuItem onClick={() => setViewCourse(c)}><Eye className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/courses/${c.id}/edit`)}><Edit className="h-4 w-4 mr-2" /> Edit Course</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setModuleDrawer(c)}><Layers className="h-4 w-4 mr-2" /> Manage Modules</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => duplicateCourse(c)}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(c.id)} className="text-destructive focus:text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-border">
              <span className="text-xs text-muted-foreground">Showing {filtered.length} of {courses.length} courses</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((p) => (
                  <button key={p} className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-medium transition-all ${p === 1 ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* View Course Details Modal */}
      <Dialog open={!!viewCourse} onOpenChange={() => setViewCourse(null)}>
        <DialogContent className="rounded-2xl max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">Course Details</DialogTitle></DialogHeader>
          {viewCourse && (
            <div className="space-y-4">
              {viewCourse.thumbnail && <img src={viewCourse.thumbnail} alt={viewCourse.title} className="w-full h-40 object-cover rounded-xl" />}
              <div>
                <h3 className="text-lg font-bold text-foreground">{viewCourse.title}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary">{viewCourse.category}</Badge>
                  <Badge className={viewCourse.status === "Published" ? "bg-success/10 text-success border-0" : ""}>{viewCourse.status}</Badge>
                  <span className="text-sm font-semibold text-primary">{viewCourse.price}</span>
                  {viewCourse.featured && <Badge className="bg-primary/10 text-primary border-0">Featured</Badge>}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{viewCourse.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">Instructor</span>
                  <span className="text-xs font-medium text-foreground">{viewCourse.instructor}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">Access Duration</span>
                  <span className="text-xs font-medium text-foreground">{viewCourse.accessDuration}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">Certificate</span>
                  <span className="text-xs font-medium text-foreground">{viewCourse.certificate ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase font-semibold mb-0.5">Last Updated</span>
                  <span className="text-xs font-medium text-foreground">{viewCourse.updated}</span>
                </div>
              </div>

              {(viewCourse.metaTitle || viewCourse.keywords) && (
                <div className="p-3 bg-muted/30 rounded-xl border border-border space-y-2">
                  <h4 className="text-[10px] font-semibold text-muted-foreground uppercase">SEO Details</h4>
                  {viewCourse.metaTitle && (
                    <div className="text-xs">
                      <span className="text-muted-foreground mr-1">T:</span>
                      <span className="text-foreground">{viewCourse.metaTitle}</span>
                    </div>
                  )}
                  {viewCourse.keywords && (
                    <div className="text-xs">
                      <span className="text-muted-foreground mr-1">K:</span>
                      <span className="text-foreground line-clamp-1">{viewCourse.keywords}</span>
                    </div>
                  )}
                </div>
              )}
              {viewCourse.technologies.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewCourse.technologies.map((t) => (
                      <span key={t.name} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-medium">
                        <span>{t.icon}</span> {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Modules ({viewCourse.modules.length})</h4>
                <div className="space-y-1.5">
                  {viewCourse.modules.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border border-border">
                      <div>
                        <span className="text-sm text-foreground font-medium">{m.title}</span>
                        <span className="block text-[10px] text-muted-foreground">{m.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{m.topics.length} topics</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border p-3 text-center">
                  <span className="text-xl font-bold text-foreground">{viewCourse.students}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Students</p>
                </div>
                <div className="rounded-xl border border-border p-3 text-center">
                  <span className="text-xl font-bold text-foreground">{viewCourse.modules.reduce((a, m) => a + m.topics.length, 0)}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Topics</p>
                </div>
                <div className="rounded-xl border border-border p-3 text-center">
                  <span className="text-xl font-bold text-foreground">{viewCourse.modules.length}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Modules</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{editingModule?.module.id.toString().startsWith('n') ? "Add Module" : "Edit Module"}</DialogTitle></DialogHeader>
          {editingModule && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Module Title</label>
                <input value={editingModule.module.title} onChange={e => setEditingModule({ ...editingModule, module: { ...editingModule.module, title: e.target.value } })} className="w-full h-10 rounded-lg border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                <textarea value={editingModule.module.description} onChange={e => setEditingModule({ ...editingModule, module: { ...editingModule.module, description: e.target.value } })} rows={2} className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Thumbnail URL</label>
                <input value={editingModule.module.thumbnail} onChange={e => setEditingModule({ ...editingModule, module: { ...editingModule.module, thumbnail: e.target.value } })} className="w-full h-10 rounded-lg border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Topics (Bullet Points)</label>
                <div className="space-y-1.5">
                  {editingModule.module.topics.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={t} onChange={e => { const topics = [...editingModule.module.topics]; topics[i] = e.target.value; setEditingModule({ ...editingModule, module: { ...editingModule.module, topics } }); }} className="w-full h-9 rounded-lg border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
                      <button onClick={() => setEditingModule({ ...editingModule, module: { ...editingModule.module, topics: editingModule.module.topics.filter((_, j) => j !== i) } })} className="text-destructive shrink-0"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => setEditingModule({ ...editingModule, module: { ...editingModule.module, topics: [...editingModule.module.topics, ""] } })} className="text-xs text-primary hover:underline flex items-center gap-1.5 mt-2"><Plus className="h-3 w-3" /> Add Topic</button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditingModule(null)} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleSaveModule} className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Module Management Drawer */}
      <Sheet open={!!moduleDrawer} onOpenChange={() => setModuleDrawer(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-heading">{moduleDrawer?.title}</SheetTitle>
            <p className="text-xs text-muted-foreground">Manage syllabus modules</p>
          </SheetHeader>
          {moduleDrawer && (
            <div className="mt-6 space-y-3">
              <DragDropContext onDragEnd={(result) => handleDragEnd(result, moduleDrawer.id)}>
                <Droppable droppableId={`modules-${moduleDrawer.id}`}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {moduleDrawer.modules.map((m, i) => (
                        <Draggable key={m.id} draggableId={m.id.toString()} index={i}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className={`group flex gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:shadow-card-hover transition-all ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''}`}>
                              <span {...provided.dragHandleProps} className="mt-1"><GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" /></span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold text-foreground"><span className="text-primary mr-1">M{m.number}:</span>{m.title}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{m.description}</p>
                                  </div>
                                  {m.thumbnail && <img src={m.thumbnail} alt="" className="h-10 w-16 object-cover rounded shrink-0" />}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {m.topics.slice(0, 3).map((t, ti) => (
                                    <span key={ti} className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground">{t}</span>
                                  ))}
                                  {m.topics.length > 3 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">+{m.topics.length - 3}</span>}
                                </div>
                              </div>
                              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button onClick={() => setEditingModule({ courseId: moduleDrawer.id, module: { ...m, topics: [...m.topics] } })} className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"><Edit className="h-3 w-3" /></button>
                                <button onClick={() => {
                                  const newMods = moduleDrawer.modules.filter(x => x.id !== m.id);
                                  newMods.forEach((x, i) => x.number = i + 1);
                                  const updated = { ...moduleDrawer, modules: newMods };
                                  setModuleDrawer(updated);
                                  setCourses(prev => prev.map(c => c.id === moduleDrawer.id ? updated : c));
                                }} className="h-6 w-6 rounded flex items-center justify-center text-destructive"><Trash2 className="h-3 w-3" /></button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <button onClick={() => setEditingModule({ courseId: moduleDrawer.id, module: { id: Date.now(), number: moduleDrawer.modules.length + 1, title: "", description: "", thumbnail: "", topics: [""] } })} className="w-full h-10 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
                <Plus className="h-4 w-4" /> Add Syllabus Module
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDeleteModal open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={handleDelete} title="Delete Course?" description="This will permanently delete this course and all its modules." />
    </div>
  );
}
