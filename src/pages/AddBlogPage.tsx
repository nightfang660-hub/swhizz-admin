import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Save, Send, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function AddBlogPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  const generateSlug = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFeaturedImage(reader.result as string);
      reader.readAsDataURL(file);
      toast.success("Featured image uploaded");
    }
  };

  const handleSave = (publish: boolean) => {
    if (!title.trim()) { toast.error("Blog title is required"); return; }
    if (!content.trim()) { toast.error("Blog content is required"); return; }
    toast.success(`Blog "${title}" ${publish ? "published" : "saved as draft"} successfully!`);
    navigate("/blogs");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/blogs")} className="h-9 w-9 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-heading text-foreground">New Blog Post</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Write and publish a new article</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave(false)} className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button onClick={() => handleSave(true)} className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">
            <Send className="h-4 w-4" /> Publish
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-5">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Title *</label>
              <input value={title} onChange={(e) => generateSlug(e.target.value)} placeholder="Enter blog title..." className="w-full h-10 rounded-lg border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Slug</label>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">/blog/</span>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="flex-1 h-9 rounded-lg border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Excerpt</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Brief summary for the blog card..." className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Content *</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} placeholder="Write your blog post content here... (Markdown supported)" className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none font-mono" />
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-5">
          {/* Featured Image */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold font-heading text-foreground mb-3">Featured Image</h3>
            {featuredImage ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img src={featuredImage} alt="Featured" className="w-full h-36 object-cover" />
                <button onClick={() => setFeaturedImage(null)} className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-lg bg-card/80 backdrop-blur text-foreground hover:bg-card">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/30 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground mb-1.5" />
                <span className="text-xs text-muted-foreground">Upload image</span>
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            )}
          </div>

          {/* Publish Settings */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-4">
            <h3 className="text-sm font-semibold font-heading text-foreground">Publish Settings</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Publish immediately</span>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-3">
            <h3 className="text-sm font-semibold font-heading text-foreground">SEO Settings</h3>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Meta Title</label>
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title || "SEO title"} className="w-full h-9 rounded-lg border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">{(metaTitle || title).length}/60</span>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Meta Description</label>
              <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={3} placeholder="Brief description for search engines..." className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none" />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">{metaDesc.length}/160</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
