import { useState, useEffect, createContext } from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, MoreHorizontal, Eye, Trash2, UserPlus, CheckCircle2, UserCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLeadApproval } from "@/hooks/useLeadApproval";

const initialLeads = [
  { id: 1, name: "John Doe", email: "john@example.com", source: "Landing Page", status: "New", date: "Feb 27, 2026", message: "I'm interested in the React Mastery course. Can you share more details?", appliedCourse: "React Mastery Pro" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", source: "Blog", status: "Contacted", date: "Feb 26, 2026", message: "Would like to know about bulk pricing for our team.", appliedCourse: "Python AI/ML Bootcamp" },
  { id: 3, name: "Alex Turner", email: "alex@example.com", source: "Referral", status: "Approved", date: "Feb 25, 2026", message: "Signed up for the AI/ML course. Great platform!", appliedCourse: "Python AI/ML Bootcamp" },
  { id: 4, name: "Maria Garcia", email: "maria@example.com", source: "Social Media", status: "New", date: "Feb 24, 2026", message: "Looking for corporate training options.", appliedCourse: "Cloud DevOps Essentials" },
  { id: 5, name: "Tom Wilson", email: "tom@example.com", source: "Landing Page", status: "New", date: "Feb 23, 2026", message: "Can I get a demo of the platform?", appliedCourse: "UI/UX Design Fundamentals" },
  { id: 6, name: "Priya Sharma", email: "priya@example.com", source: "Referral", status: "New", date: "Mar 1, 2026", message: "Very excited to join the Flutter course!", appliedCourse: "Flutter Mobile Apps" },
  { id: 7, name: "Carlos Mendez", email: "carlos@example.com", source: "Landing Page", status: "New", date: "Mar 1, 2026", message: "I want to enroll in the Data Science course.", appliedCourse: "Data Science with R" },
];

const statusColors: Record<string, string> = {
  New: "bg-info/10 text-info",
  Contacted: "bg-warning/10 text-warning",
  Approved: "bg-success/10 text-success",
  Closed: "bg-muted text-muted-foreground",
};

export default function LeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewLead, setViewLead] = useState<typeof initialLeads[0] | null>(null);
  const { approveStudent } = useLeadApproval();

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const filtered = leads.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()));

  const newLeadsCount = leads.filter(l => l.status === "New").length;

  const updateStatus = (id: number, status: string) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    toast.success(`Lead status updated to ${status}`);
  };

  const handleApprove = (lead: typeof initialLeads[0]) => {
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, status: "Approved" } : l));
    approveStudent({
      name: lead.name,
      email: lead.email,
      appliedCourse: lead.appliedCourse,
      approvedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
    toast.success(`${lead.name} approved and added to Students!`, { icon: "🎉" });
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setLeads((prev) => prev.filter((l) => l.id !== deleteId));
      toast.success("Lead deleted");
      setDeleteId(null);
    }
  };

  if (loading) return <div className="space-y-6 max-w-[1400px] mx-auto"><div className="space-y-1"><div className="h-7 w-20 bg-muted rounded animate-pulse" /><div className="h-4 w-44 bg-muted rounded animate-pulse" /></div><TableSkeleton rows={5} cols={5} /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-heading text-foreground">Leads</h1>
          {newLeadsCount > 0 && (
            <Badge className="bg-info/10 text-info border-0 gap-1">
              <Sparkles className="h-3 w-3" /> {newLeadsCount} New
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">Track and manage incoming leads • Approve to add as students</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border shadow-card">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search leads..." className="h-9 w-full rounded-lg border border-input bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Lead</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Applied Course</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Source</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">No leads found</td></tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors ${l.status === "New" ? "bg-info/[0.03]" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${l.status === "Approved" ? "bg-success/10" : "gradient-soft"}`}>
                          {l.status === "Approved" ? <UserCheck className="h-4 w-4 text-success" /> : <MessageSquare className="h-4 w-4 text-primary" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-foreground">{l.name}</p>
                            {l.status === "New" && <span className="h-2 w-2 rounded-full bg-info animate-pulse" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{l.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground font-medium">{l.appliedCourse}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{l.source}</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className={`border-0 ${statusColors[l.status]}`}>{l.status}</Badge></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{l.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {l.status === "New" && (
                          <button onClick={() => handleApprove(l)} className="h-8 px-2.5 flex items-center gap-1 rounded-lg bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem onClick={() => setViewLead(l)}><Eye className="h-4 w-4 mr-2" /> View Message</DropdownMenuItem>
                            {l.status !== "Approved" && (
                              <>
                                <DropdownMenuItem onClick={() => updateStatus(l.id, "Contacted")}><UserPlus className="h-4 w-4 mr-2" /> Mark Contacted</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleApprove(l)} className="text-success focus:text-success"><CheckCircle2 className="h-4 w-4 mr-2" /> Approve Student</DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => setDeleteId(l.id)} className="text-destructive focus:text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Lead Message Modal */}
      <Dialog open={!!viewLead} onOpenChange={() => setViewLead(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle className="font-heading">Lead Message</DialogTitle></DialogHeader>
          {viewLead && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-soft"><MessageSquare className="h-5 w-5 text-primary" /></div>
                <div><p className="text-sm font-semibold text-foreground">{viewLead.name}</p><p className="text-xs text-muted-foreground">{viewLead.email}</p></div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-sm text-foreground">{viewLead.message}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Course: <strong className="text-foreground">{viewLead.appliedCourse}</strong></span> · <span>Source: {viewLead.source}</span> · <span>{viewLead.date}</span>
              </div>
              {viewLead.status === "New" && (
                <button onClick={() => { handleApprove(viewLead); setViewLead(null); }} className="w-full h-9 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20 transition-colors flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Approve as Student
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={handleDelete} title="Delete Lead?" description="This will permanently delete this lead record." />
    </div>
  );
}
