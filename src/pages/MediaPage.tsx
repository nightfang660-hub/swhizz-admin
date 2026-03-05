import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Search, Trash2, ZoomIn, Grid3X3, List, Users, Edit3, Check, X } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryItem {
  id: number;
  name: string;
  studentName: string;
  url: string;
  category: string;
  date: string;
}

const sampleGallery: GalleryItem[] = [
  { id: 1, name: "Sarah Williams", studentName: "Sarah Williams", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face", category: "Students", date: "Feb 27, 2026" },
  { id: 2, name: "James Chen", studentName: "James Chen", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face", category: "Students", date: "Feb 25, 2026" },
  { id: 3, name: "Emily Rodriguez", studentName: "Emily Rodriguez", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face", category: "Students", date: "Feb 24, 2026" },
  { id: 4, name: "Graduation Ceremony 2026", studentName: "", url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop", category: "Events", date: "Feb 22, 2026" },
  { id: 5, name: "Hackathon Winners", studentName: "", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop", category: "Events", date: "Feb 20, 2026" },
  { id: 6, name: "David Kim", studentName: "David Kim", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face", category: "Students", date: "Feb 18, 2026" },
  { id: 7, name: "Tech Workshop", studentName: "", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop", category: "Events", date: "Feb 16, 2026" },
  { id: 8, name: "Priya Sharma", studentName: "Priya Sharma", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face", category: "Students", date: "Feb 14, 2026" },
  { id: 9, name: "Campus Tour", studentName: "", url: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop", category: "Campus", date: "Feb 12, 2026" },
  { id: 10, name: "Alex Thompson", studentName: "Alex Thompson", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face", category: "Students", date: "Feb 10, 2026" },
  { id: 11, name: "Coding Lab", studentName: "", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop", category: "Campus", date: "Feb 8, 2026" },
  { id: 12, name: "Maria Garcia", studentName: "Maria Garcia", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face", category: "Students", date: "Feb 6, 2026" },
];

const categories = ["All", "Students", "Events", "Campus"];

export default function MediaPage() {
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState(sampleGallery);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [editNameValue, setEditNameValue] = useState("");

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const filtered = gallery.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.studentName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || m.category === filter;
    return matchSearch && matchFilter;
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setTimeout(() => {
      const newItems: GalleryItem[] = Array.from(files).map((file, i) => ({
        id: Date.now() + i,
        name: file.name.replace(/\.[^/.]+$/, ""),
        studentName: "",
        url: URL.createObjectURL(file),
        category: "Students",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      }));
      setGallery((prev) => [...newItems, ...prev]);
      setUploading(false);
      toast.success(`${newItems.length} image(s) uploaded`);
    }, 1000);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setGallery((prev) => prev.filter((m) => m.id !== deleteId));
      toast.success("Image removed from gallery");
      setDeleteId(null);
    }
  };

  const startEditName = (item: GalleryItem) => {
    setEditingNameId(item.id);
    setEditNameValue(item.studentName);
  };

  const saveEditName = (id: number) => {
    setGallery((prev) => prev.map((m) => m.id === id ? { ...m, studentName: editNameValue } : m));
    setEditingNameId(null);
    toast.success("Student name updated");
  };

  const studentCount = gallery.filter(g => g.category === "Students").length;

  if (loading) return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between"><div className="space-y-1"><div className="h-7 w-36 bg-muted rounded animate-pulse" /><div className="h-4 w-44 bg-muted rounded animate-pulse" /></div><div className="h-9 w-28 bg-muted rounded-lg animate-pulse" /></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Media Gallery</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {studentCount} student photos · {gallery.length} total</p>
        </div>
        <label className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity cursor-pointer">
          <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Images"}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border shadow-card">
        <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search gallery..." className="h-9 w-full rounded-lg border border-input bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <div className="flex gap-1">
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`h-8 px-3 rounded-lg text-xs font-medium transition-all ${filter === c ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>{c}</button>
            ))}
          </div>
          <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5 ml-auto">
            <button onClick={() => setViewMode("grid")} className={`h-7 w-7 flex items-center justify-center rounded-md transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}><Grid3X3 className="h-3.5 w-3.5" /></button>
            <button onClick={() => setViewMode("list")} className={`h-7 w-7 flex items-center justify-center rounded-md transition-all ${viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}><List className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        {uploading && (
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full gradient-primary rounded-full animate-pulse" style={{ width: "60%" }} /></div>
              <span className="text-xs text-muted-foreground">Uploading...</span>
            </div>
          </div>
        )}

        <div className={`p-4 ${viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-2"}`}>
          {filtered.length === 0 ? (
            <div className={`${viewMode === "grid" ? "col-span-full" : ""} text-center py-12 text-sm text-muted-foreground`}>No images found</div>
          ) : (
            filtered.map((item) => viewMode === "grid" ? (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative rounded-xl overflow-hidden border border-border aspect-square cursor-pointer hover:shadow-card-hover transition-all duration-200">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                
                {/* Student name overlay - always visible at bottom-left */}
                {item.studentName && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent pt-8 pb-2 px-3">
                    <p className="text-xs font-semibold text-white drop-shadow-md">{item.studentName}</p>
                  </div>
                )}

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); startEditName(item); }} className="h-7 w-7 flex items-center justify-center rounded-lg bg-card/80 backdrop-blur text-foreground hover:bg-card transition-colors" title="Edit student name"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setLightbox(item)} className="h-7 w-7 flex items-center justify-center rounded-lg bg-card/80 backdrop-blur text-foreground hover:bg-card transition-colors"><ZoomIn className="h-3.5 w-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }} className="h-7 w-7 flex items-center justify-center rounded-lg bg-card/80 backdrop-blur text-destructive hover:bg-card transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                {/* Inline name editor */}
                {editingNameId === item.id && (
                  <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-3" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-card rounded-xl p-3 w-full shadow-lg">
                      <label className="text-xs font-medium text-foreground block mb-1.5">Student Name</label>
                      <input
                        autoFocus
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        placeholder="Enter student name..."
                        className="h-8 w-full rounded-lg border border-input bg-secondary px-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                        onKeyDown={(e) => { if (e.key === "Enter") saveEditName(item.id); if (e.key === "Escape") setEditingNameId(null); }}
                      />
                      <div className="flex justify-end gap-1.5 mt-2">
                        <button onClick={() => setEditingNameId(null)} className="h-7 px-2.5 rounded-md text-xs text-muted-foreground hover:bg-muted transition-colors"><X className="h-3 w-3" /></button>
                        <button onClick={() => saveEditName(item.id)} className="h-7 px-2.5 rounded-md text-xs gradient-primary text-primary-foreground font-medium"><Check className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl border border-border hover:shadow-card-hover transition-all group">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                  <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                  {item.studentName && (
                    <div className="absolute bottom-0 left-0 right-0 bg-foreground/60 px-1 py-0.5">
                      <p className="text-[8px] font-medium text-white truncate">{item.studentName}</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category} · {item.date}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditName(item)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground" title="Edit name"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => setLightbox(item)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground"><ZoomIn className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(item.id)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl">
          {lightbox && (
            <div>
              <div className="relative">
                <img src={lightbox.url} alt={lightbox.name} className="w-full max-h-[70vh] object-contain bg-muted" />
                {lightbox.studentName && (
                  <div className="absolute bottom-3 left-3 bg-foreground/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <p className="text-sm font-semibold text-white">{lightbox.studentName}</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-card">
                <p className="text-sm font-medium text-foreground">{lightbox.name}</p>
                <p className="text-xs text-muted-foreground">{lightbox.category} · {lightbox.date}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={handleDelete} title="Remove Image?" description="This will permanently remove this image from the gallery." />
    </div>
  );
}
