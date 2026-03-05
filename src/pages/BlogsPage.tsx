import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, FileText, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const initialBlogs = [
  { id: 1, title: "The Future of AI in Education", author: "Admin", views: 2480, status: "Published", date: "Feb 24, 2026" },
  { id: 2, title: "10 React Patterns You Should Know", author: "Admin", views: 1890, status: "Published", date: "Feb 20, 2026" },
  { id: 3, title: "Getting Started with Cloud Computing", author: "Admin", views: 0, status: "Draft", date: "Feb 18, 2026" },
  { id: 4, title: "Design Systems That Scale", author: "Admin", views: 1245, status: "Published", date: "Feb 15, 2026" },
  { id: 5, title: "Python vs JavaScript in 2026", author: "Admin", views: 3120, status: "Published", date: "Feb 10, 2026" },
];

export default function BlogsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const filtered = blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = () => {
    if (deleteId !== null) {
      setBlogs((prev) => prev.filter((b) => b.id !== deleteId));
      toast.success("Blog post deleted successfully");
      setDeleteId(null);
    }
  };

  if (loading) return <div className="space-y-6 max-w-[1400px] mx-auto"><div className="flex items-center justify-between"><div className="space-y-1"><div className="h-7 w-24 bg-muted rounded animate-pulse" /><div className="h-4 w-48 bg-muted rounded animate-pulse" /></div><div className="h-9 w-28 bg-muted rounded-lg animate-pulse" /></div><TableSkeleton rows={5} cols={4} /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Blogs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create and manage blog content</p>
        </div>
        <button onClick={() => navigate("/blogs/new")} className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border shadow-card">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search blog posts..." className="h-9 w-full rounded-lg border border-input bg-secondary pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Post</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Views</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">No blog posts found</td></tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-soft"><FileText className="h-4 w-4 text-primary" /></div>
                        <span className="text-sm font-medium text-foreground">{b.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1 text-sm text-muted-foreground"><Eye className="h-3.5 w-3.5" /> {b.views.toLocaleString()}</div></td>
                    <td className="px-4 py-3"><Badge variant={b.status === "Published" ? "default" : "secondary"} className={b.status === "Published" ? "bg-success/10 text-success border-0" : ""}>{b.status}</Badge></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{b.date}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => navigate(`/blogs/${b.id}`)}><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/blogs/${b.id}/edit`)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(b.id)} className="text-destructive focus:text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
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

      <ConfirmDeleteModal open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={handleDelete} title="Delete Blog Post?" description="This will permanently delete this blog post and its content." />
    </div>
  );
}
