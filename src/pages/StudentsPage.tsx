import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Users, MoreHorizontal, Eye, Ban, CheckCircle, Trash2, Sparkles, Filter, Edit, X, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLeadApproval } from "@/hooks/useLeadApproval";

const allCourses = [
  "React Mastery Pro",
  "Python AI/ML Bootcamp",
  "Cloud DevOps Essentials",
  "UI/UX Design Fundamentals",
  "Data Science with R",
  "Flutter Mobile Apps",
];

interface Student {
  id: number;
  name: string;
  email: string;
  enrolledCourses: string[];
  totalAmount: number;
  paidAmount: number;
  status: string;
  joined: string;
  isNew?: boolean;
  appliedCourse?: string;
}

const initialStudents: Student[] = [
  { id: 1, name: "Sarah Williams", email: "sarah@example.com", enrolledCourses: ["React Mastery Pro", "Python AI/ML Bootcamp", "UI/UX Design Fundamentals", "Data Science with R"], totalAmount: 456, paidAmount: 356, status: "Active", joined: "Jan 15, 2026" },
  { id: 2, name: "James Rodriguez", email: "james@example.com", enrolledCourses: ["Python AI/ML Bootcamp", "Cloud DevOps Essentials", "Data Science with R"], totalAmount: 377, paidAmount: 377, status: "Active", joined: "Dec 10, 2025" },
  { id: 3, name: "Emily Chen", email: "emily@example.com", enrolledCourses: ["React Mastery Pro", "Flutter Mobile Apps"], totalAmount: 188, paidAmount: 100, status: "Active", joined: "Feb 1, 2026" },
  { id: 4, name: "Michael Brown", email: "michael@example.com", enrolledCourses: ["Cloud DevOps Essentials"], totalAmount: 0, paidAmount: 0, status: "Blocked", joined: "Nov 20, 2025" },
  { id: 5, name: "Lisa Anderson", email: "lisa@example.com", enrolledCourses: ["React Mastery Pro", "Python AI/ML Bootcamp", "UI/UX Design Fundamentals", "Data Science with R", "Flutter Mobile Apps"], totalAmount: 545, paidAmount: 500, status: "Active", joined: "Oct 5, 2025" },
  { id: 6, name: "David Kim", email: "david@example.com", enrolledCourses: ["UI/UX Design Fundamentals", "React Mastery Pro"], totalAmount: 178, paidAmount: 178, status: "Active", joined: "Jan 28, 2026" },
];

export default function StudentsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const { getApprovedStudents, subscribe } = useLeadApproval();

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const sync = () => {
      const approved = getApprovedStudents();
      setStudents((prev) => {
        const existingEmails = new Set(prev.map((s) => s.email));
        const newStudents = approved
          .filter((a) => !existingEmails.has(a.email))
          .map((a, i) => ({
            id: Date.now() + i,
            name: a.name,
            email: a.email,
            enrolledCourses: a.appliedCourse ? [a.appliedCourse] : [],
            totalAmount: 0,
            paidAmount: 0,
            status: "Active",
            joined: a.approvedDate,
            isNew: true,
            appliedCourse: a.appliedCourse,
          }));
        if (newStudents.length === 0) return prev;
        return [...newStudents, ...prev];
      });
    };
    sync();
    const unsub = subscribe(sync);
    return unsub;
  }, [getApprovedStudents, subscribe]);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === "All" || s.enrolledCourses.includes(courseFilter);
    return matchSearch && matchCourse;
  });

  const newStudentsCount = students.filter(s => s.isNew).length;

  const toggleBlock = (id: number) => {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "Active" ? "Blocked" : "Active" } : s));
    const student = students.find((s) => s.id === id);
    toast.success(`${student?.name} ${student?.status === "Active" ? "blocked" : "unblocked"}`);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setStudents((prev) => prev.filter((s) => s.id !== deleteId));
      toast.success("Student removed");
      setDeleteId(null);
    }
  };

  const markAsReviewed = (id: number) => {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, isNew: false } : s));
  };

  const handleEditSave = () => {
    if (!editStudent) return;
    setStudents(prev => prev.map(s => s.id === editStudent.id ? editStudent : s));
    toast.success(`${editStudent.name} updated successfully`);
    setEditStudent(null);
  };

  const inputClass = "h-9 w-full rounded-lg border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20";

  if (loading) return <div className="space-y-6 max-w-[1400px] mx-auto"><div className="space-y-1"><div className="h-7 w-28 bg-muted rounded animate-pulse" /><div className="h-4 w-44 bg-muted rounded animate-pulse" /></div><TableSkeleton rows={6} cols={4} /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-heading text-foreground">Students</h1>
          {newStudentsCount > 0 && (
            <Badge className="bg-success/10 text-success border-0 gap-1">
              <Sparkles className="h-3 w-3" /> {newStudentsCount} New
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">Manage enrolled students</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border shadow-card">
        <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search students..." className="h-9 w-full rounded-lg border border-input bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 px-3 rounded-lg border border-input text-sm text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1.5 transition-colors">
                <Filter className="h-3.5 w-3.5" /> {courseFilter === "All" ? "All Courses" : courseFilter}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl w-56">
              <DropdownMenuItem onClick={() => setCourseFilter("All")}>All Courses</DropdownMenuItem>
              {allCourses.map((c) => (
                <DropdownMenuItem key={c} onClick={() => setCourseFilter(c)}>{c}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Student</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">
                  {courseFilter !== "All" ? "Filtered Course" : "Enrolled Courses"}
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Total Amount</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Paid Amount</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">No students found</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors ${s.isNew ? "bg-success/[0.03]" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary">
                            <span className="text-xs font-semibold text-primary-foreground">{s.name.split(" ").map((n) => n[0]).join("")}</span>
                          </div>
                          {s.isNew && <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-foreground">{s.name}</p>
                            {s.isNew && <Badge className="bg-success/10 text-success border-0 text-[10px] px-1.5 py-0">NEW</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {courseFilter !== "All" ? (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 font-normal">{courseFilter}</Badge>
                        ) : (
                          <>
                            {s.enrolledCourses.slice(0, 2).map((c) => (
                              <Badge key={c} variant="secondary" className="text-[10px] px-1.5 py-0.5 font-normal">{c}</Badge>
                            ))}
                            {s.enrolledCourses.length > 2 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 font-normal">+{s.enrolledCourses.length - 2} more</Badge>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground flex items-center gap-1"><span className="text-muted-foreground text-xs">₹</span>{s.totalAmount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium flex items-center gap-1 ${s.paidAmount >= s.totalAmount ? "text-success" : "text-warning"}`}>
                        <span className="text-xs">₹</span>{s.paidAmount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.status === "Active" ? "default" : "destructive"} className={s.status === "Active" ? "bg-success/10 text-success border-0" : "bg-destructive/10 text-destructive border-0"}>{s.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => setProfileStudent(s)}><Eye className="h-4 w-4 mr-2" /> View Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditStudent({ ...s, enrolledCourses: [...s.enrolledCourses] })}><Edit className="h-4 w-4 mr-2" /> Edit Student</DropdownMenuItem>
                          {s.isNew && <DropdownMenuItem onClick={() => markAsReviewed(s.id)}><CheckCircle className="h-4 w-4 mr-2" /> Mark Reviewed</DropdownMenuItem>}
                          <DropdownMenuItem onClick={() => toggleBlock(s.id)}>
                            {s.status === "Active" ? <><Ban className="h-4 w-4 mr-2" /> Block</> : <><CheckCircle className="h-4 w-4 mr-2" /> Unblock</>}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(s.id)} className="text-destructive focus:text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Student Profile Modal */}
      <Dialog open={!!profileStudent} onOpenChange={() => setProfileStudent(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Student Profile</DialogTitle>
          </DialogHeader>
          {profileStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary">
                    <span className="text-lg font-bold text-primary-foreground">{profileStudent.name.split(" ").map((n) => n[0]).join("")}</span>
                  </div>
                  {profileStudent.isNew && <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-success border-2 border-card" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-foreground">{profileStudent.name}</p>
                    {profileStudent.isNew && <Badge className="bg-success/10 text-success border-0 text-xs">NEW</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{profileStudent.email}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Enrolled Courses ({profileStudent.enrolledCourses.length})</h4>
                <div className="space-y-1.5">
                  {profileStudent.enrolledCourses.map((c) => (
                    <div key={c} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
                      <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border border-border p-3 text-center">
                  <span className="text-muted-foreground block text-xs">Total Amount</span>
                  <span className="text-foreground font-semibold text-lg">₹{profileStudent.totalAmount}</span>
                </div>
                <div className="rounded-xl border border-border p-3 text-center">
                  <span className="text-muted-foreground block text-xs">Paid Amount</span>
                  <span className={`font-semibold text-lg ${profileStudent.paidAmount >= profileStudent.totalAmount ? "text-success" : "text-warning"}`}>₹{profileStudent.paidAmount}</span>
                </div>
                <div className="rounded-xl border border-border p-3 text-center">
                  <span className="text-muted-foreground block text-xs">Balance</span>
                  <span className={`font-semibold text-lg ${profileStudent.totalAmount - profileStudent.paidAmount > 0 ? "text-destructive" : "text-success"}`}>₹{profileStudent.totalAmount - profileStudent.paidAmount}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border p-3"><span className="text-muted-foreground block text-xs">Status</span><Badge className={profileStudent.status === "Active" ? "bg-success/10 text-success border-0 mt-1" : "bg-destructive/10 text-destructive border-0 mt-1"}>{profileStudent.status}</Badge></div>
                <div className="rounded-xl border border-border p-3"><span className="text-muted-foreground block text-xs">Joined</span><span className="text-foreground font-medium">{profileStudent.joined}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={!!editStudent} onOpenChange={() => setEditStudent(null)}>
        <DialogContent className="rounded-2xl max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">Edit Student</DialogTitle></DialogHeader>
          {editStudent && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Name</label>
                <input value={editStudent.name} onChange={e => setEditStudent({ ...editStudent, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                <input value={editStudent.email} onChange={e => setEditStudent({ ...editStudent, email: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Enrolled Courses</label>
                <div className="space-y-1.5 mb-2">
                  {editStudent.enrolledCourses.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <select value={c} onChange={e => { const courses = [...editStudent.enrolledCourses]; courses[i] = e.target.value; setEditStudent({ ...editStudent, enrolledCourses: courses }); }} className={inputClass}>
                        {allCourses.map(ac => <option key={ac} value={ac}>{ac}</option>)}
                      </select>
                      <button onClick={() => setEditStudent({ ...editStudent, enrolledCourses: editStudent.enrolledCourses.filter((_, j) => j !== i) })} className="text-destructive shrink-0"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setEditStudent({ ...editStudent, enrolledCourses: [...editStudent.enrolledCourses, allCourses[0]] })} className="text-xs text-primary hover:underline">+ Add Course</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Total Amount (₹)</label>
                  <input type="number" value={editStudent.totalAmount} onChange={e => setEditStudent({ ...editStudent, totalAmount: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Paid Amount (₹)</label>
                  <input type="number" value={editStudent.paidAmount} onChange={e => setEditStudent({ ...editStudent, paidAmount: Number(e.target.value) })} className={inputClass} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditStudent(null)} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleEditSave} className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">Save Changes</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={handleDelete} title="Remove Student?" description="This will remove the student from the platform." />
    </div>
  );
}
