import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Eye, EyeOff, Save, Edit, X, Check, Image, Type, Upload, Plus, Trash2, Star, Quote, ChevronDown, ChevronRight, Monitor, Video, Link as LinkIcon, Phone, Mail, MapPin, Clock, Search, Filter, BookOpen, Layers, CheckCircle, FileEdit, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MiniSparkline } from "@/components/dashboard/MiniSparkline";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// Helper Interface for our extremely loose CMS sections
interface SectionData {
  // Hero
  bgImg?: string; fgImg?: string; heading?: string; subheading?: string;
  btn1Lbl?: string; btn1Lnk?: string; btn2Lbl?: string; btn2Lnk?: string; videoLnk?: string;
  // About / Highlights
  title?: string; shortDesc?: string; detailedDesc?: string; desc?: string; bullets?: string[]; image?: string;
  // Courses
  courses?: string[]; sectionTitle?: string; sectionSubtitle?: string; btnText?: string;
  // Complex Arrays
  benefits?: { id: string; icon: string; title: string; desc: string }[];
  categories?: { id: string; icon: string; title: string; desc: string; link: string }[];
  testimonials?: { id: string; name: string; photo: string; course: string; text: string; rating: number; videoLnk: string }[];
  gallery?: { id: string; thumbnail: string; title: string; videoLnk: string }[];
  placements?: { id: string; image: string; name: string; company: string; caption: string }[];
  faqs?: { id: string; q: string; a: string }[];
  // Contact
  address?: string; phone?: string; email?: string; hours?: string; formTitle?: string; submitBtnText?: string; successMsg?: string;
  // Footer
  logo?: string; aboutText?: string; copyrightText?: string;
  socialLinks?: { id: string; platform: string; url: string }[];
  quickLinks?: { id: string; label: string; url: string }[];
}

interface Section { id: number; name: string; visible: boolean; desc: string; type: string; data: SectionData; }

const uid = () => Math.random().toString(36).substr(2, 9);

const initialSections: Section[] = [
  { id: 1, name: "Hero Banner", visible: true, desc: "Rebuilt to accept Background image, Bottom/Foreground overlapping image, Headline, Subheadline, CTA Button 1 & 2 arrays (label and link), and an optional video pop-up link.", type: "hero", data: { heading: "Transform Your Career with Industry-Ready IT Training", subheading: "Learn from the best to become the best in your field.", bgImg: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=500&fit=crop", fgImg: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop", btn1Lbl: "Explore Courses", btn1Lnk: "/courses", btn2Lbl: "Free Counseling", btn2Lnk: "/contact", videoLnk: "" } },
  { id: 2, name: "About Institute", visible: true, desc: "Allows a short description, detailed paragraph block, an image upload, and dynamic capability to add/remove multiple bullet points.", type: "about", data: { title: "About Swhizz Tech", shortDesc: "Empowering careers since 2012", detailedDesc: "We provide industry-focused training with hands-on projects...", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop", bullets: ["Industry focused training", "Hands-on projects", "Placement support"] } },
  { id: 3, name: "Featured Courses", visible: true, desc: "Fields for section labels and a preview of the mock multi-select array that will be connected to your course database.", type: "courses", data: { sectionTitle: "Our Top Programs", sectionSubtitle: "Master the most demanded technologies", courses: ["1", "2"], btnText: "Explore All Programs" } },
  { id: 4, name: "Training Benefits", visible: true, desc: "Create a mini-grid by infinitely adding dynamic card layouts with built-in \"Icon, Title, Description\" fields.", type: "benefits", data: { benefits: [{ id: uid(), icon: "👔", title: "Hands-on Training", desc: "Real practical labs" }, { id: uid(), icon: "🌟", title: "Industry Mentors", desc: "Learn from pros" }, { id: uid(), icon: "💻", title: "Real-Time Projects", desc: "Build real apps" }, { id: uid(), icon: "⏱", title: "Flexible Learning", desc: "Learn at your pace" }] } },
  { id: 5, name: "Program Highlights", visible: true, desc: "Structured with description areas, image uploads, and dynamic bullet-points list.", type: "highlights", data: { title: "Why Choose Our Programs?", desc: "We focus on building strong foundations.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop", bullets: ["100% Practical", "MNC standard curriculum", "Interview Prep"] } },
  { id: 6, name: "Course Category List", visible: true, desc: "Dynamic multi-item cards to display icon markers, titles, short descriptions, and destination links to those specific paths.", type: "categories", data: { categories: [{ id: uid(), icon: "🌐", title: "Web Development", desc: "Full stack engineering", link: "/category/web" }, { id: uid(), icon: "📊", title: "Data Science", desc: "AI & ML", link: "/category/data" }] } },
  { id: 7, name: "Student Testimonials", visible: true, desc: "Rich array controller capturing Name, Course Taken, Photo URL, Review Body text, optional video links, and an interconnected 5-Star input system rating.", type: "testimonials", data: { testimonials: [{ id: uid(), name: "John Doe", photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", course: "React Mastery", text: "Amazing experience. Got placed instantly!", rating: 5, videoLnk: "" }] } },
  { id: 8, name: "Training Gallery", visible: true, desc: "Dynamic grid input mapping (Thumbnails, Titles, embedded video links).", type: "gallery", data: { gallery: [{ id: uid(), thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop", title: "Hackathon 2025", videoLnk: "" }, { id: uid(), thumbnail: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=300&h=200&fit=crop", title: "Classroom Lab", videoLnk: "" }] } },
  { id: 9, name: "Placement Stories", visible: true, desc: "Add dynamic success cards by filling out Student Image URL, Name, Company Hired At, and the position/short caption.", type: "placements", data: { placements: [{ id: uid(), image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", name: "Mike Ross", company: "Google", caption: "Placed as SDE I" }] } },
  { id: 10, name: "FAQs", visible: true, desc: "Full accordion data-mapper generating infinite Q&A blocks.", type: "faqs", data: { faqs: [{ id: uid(), q: "Do you offer placement guarantee?", a: "Yes, we offer 100% placement assistance." }, { id: uid(), q: "Are courses online or offline?", a: "We provide both hybrid models." }] } },
  { id: 11, name: "Contact Info", visible: true, desc: "Split-panel inputs. The left side captures raw info (Office Address, Phone, Email, Working Hours) while the right side configures your form strings (Form Title, Submit Text, Success Message).", type: "contact", data: { address: "123 Tech Park, Silicon Valley", phone: "+1 (555) 123-4567", email: "info@swhizz.tech", hours: "Mon-Sat: 9AM - 6PM", formTitle: "Get In Touch", submitBtnText: "Send Message", successMsg: "We'll get back to you shortly!" } },
  { id: 12, name: "Footer", visible: true, desc: "Unified dashboard capturing Institute Logo, general About snippet, Copyright string, alongside infinite row-mapping for Social Media Links & Quick Navigation Links.", type: "footer", data: { logo: "Swhizz Tech", aboutText: "Empowering students worldwide.", copyrightText: "© 2026 Swhizz Tech. All rights reserved.", socialLinks: [{ id: uid(), platform: "LinkedIn", url: "https://linkedin.com" }], quickLinks: [{ id: uid(), label: "Privacy Policy", url: "/privacy" }, { id: uid(), label: "Terms of Service", url: "/terms" }] } }
];


const sectionThumbnails: Record<string, string> = {
  hero: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=300&fit=crop",
  about: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=300&fit=crop",
  courses: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop",
  benefits: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop",
  highlights: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=300&fit=crop",
  categories: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=300&fit=crop",
  testimonials: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=300&fit=crop",
  gallery: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop",
  placements: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=300&fit=crop",
  faqs: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&h=300&fit=crop",
  contact: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&h=300&fit=crop",
  footer: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=300&fit=crop",
};

// Helper to safely assign typed any to avoid TS errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

const MiniPreview = ({ type }: { type: string }) => {
  return <div className="p-3 bg-muted/50 rounded-lg border border-border text-center text-xs text-muted-foreground">Preview for <strong className="uppercase">{type}</strong> section is abstract in CMS view. Please click "Full Preview" to visualize actual website layout.</div>;
};

export default function WebsitePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [addingNew, setAddingNew] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [editing, setEditing] = useState<Section | null>(null);
  const [newType, setNewType] = useState("about");
  const [newName, setNewName] = useState("");

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const filtered = sections.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || (statusFilter === "Visible" ? s.visible : !s.visible);
    return matchSearch && matchStatus;
  });

  const stats = {
    total: sections.length,
    visible: sections.filter(s => s.visible).length,
    hidden: sections.filter(s => !s.visible).length,
    types: new Set(sections.map(s => s.type)).size
  };

  const toggleVis = (id: number) => { setSections(p => p.map(s => s.id === id ? { ...s, visible: !s.visible } : s)); }
  const toggle = (id: number) => setExpandedSection(expandedSection === id ? null : id);
  const onDragEnd = (res: DropResult) => {
    if (!res.destination) return;
    const items = Array.from(sections);
    const [reordered] = items.splice(res.source.index, 1);
    items.splice(res.destination.index, 0, reordered);
    setSections(items);
    toast.success("Sections reordered");
  };

  const handleSave = () => {
    toast.success("All sections saved successfully!");
  };

  if (loading) return <div className="space-y-6 max-w-[1400px] mx-auto p-6"><div className="h-8 w-48 bg-muted rounded animate-pulse" /><div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div></div>;

  const renderEditor = (editing: Section) => {
    if (!editing) return null;
    const { type, data } = editing;

    const updateSection = (field: string, value: AnyType) => { setSections(prev => prev.map(s => s.id === editing.id ? { ...s, data: { ...s.data, [field]: value } } : s)); };
    const updateArray = (arr: string, val: AnyType) => { setSections(prev => prev.map(s => s.id === editing.id ? { ...s, data: { ...s.data, [arr]: val } } : s)); };

    return (
      <div className="space-y-4 pr-2">
        {type === "hero" && (
          <div className="space-y-3">
            <div><label className="text-sm font-medium">Background Image URL</label><input value={data.bgImg || ""} onChange={e => updateSection("bgImg", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1" /></div>
            <div><label className="text-sm font-medium">Foreground Image URL (Group img)</label><input value={data.fgImg || ""} onChange={e => updateSection("fgImg", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1" /></div>
            <div><label className="text-sm font-medium">Heading Text</label><input value={data.heading || ""} onChange={e => updateSection("heading", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1" /></div>
            <div><label className="text-sm font-medium">Subheading Text</label><textarea value={data.subheading || ""} onChange={e => updateSection("subheading", e.target.value)} className="w-full h-16 rounded-md border bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-1" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-sm font-medium">Btn 1 Label</label><input value={data.btn1Lbl || ""} onChange={e => updateSection("btn1Lbl", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm" /></div>
              <div><label className="text-sm font-medium">Btn 1 Link</label><input value={data.btn1Lnk || ""} onChange={e => updateSection("btn1Lnk", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm" /></div>
              <div><label className="text-sm font-medium">Btn 2 Label</label><input value={data.btn2Lbl || ""} onChange={e => updateSection("btn2Lbl", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm" /></div>
              <div><label className="text-sm font-medium">Btn 2 Link</label><input value={data.btn2Lnk || ""} onChange={e => updateSection("btn2Lnk", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm" /></div>
            </div>
            <div><label className="text-sm font-medium">Optional Video Link (Popup)</label><input value={data.videoLnk || ""} onChange={e => updateSection("videoLnk", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1" /></div>
          </div>
        )}

        {(type === "about" || type === "highlights") && (
          <div className="space-y-3">
            <div><label className="text-sm font-medium">Section Title</label><input value={data.title || ""} onChange={e => updateSection("title", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1" /></div>
            {type === "about" && <div><label className="text-sm font-medium">Short Description</label><input value={data.shortDesc || ""} onChange={e => updateSection("shortDesc", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1" /></div>}
            <div><label className="text-sm font-medium">{type === "about" ? "Detailed Paragraph" : "Description"}</label><textarea value={type === "about" ? data.detailedDesc || "" : data.desc || ""} onChange={e => updateSection(type === "about" ? "detailedDesc" : "desc", e.target.value)} className="w-full h-20 rounded-md border bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-1" /></div>
            <div><label className="text-sm font-medium">Image Upload / URL</label><input value={data.image || ""} onChange={e => updateSection("image", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1" /></div>
            <div>
              <div className="flex justify-between mb-1"><label className="text-sm font-medium">Bullet Points</label><button onClick={() => updateArray("bullets", [...(data.bullets || []), ""])} className="text-xs text-primary">+ Add</button></div>
              {data.bullets?.map((b, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={b} onChange={e => { const nb = [...data.bullets!]; nb[i] = e.target.value; updateArray("bullets", nb); }} className="flex-1 h-8 rounded border bg-secondary px-2 text-sm focus:outline-none" />
                  <button onClick={() => { const nb = [...data.bullets!]; nb.splice(i, 1); updateArray("bullets", nb); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === "courses" && (
          <div className="space-y-3">
            <div><label className="text-sm font-medium">Section Title</label><input value={data.sectionTitle || ""} onChange={e => updateSection("sectionTitle", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1" /></div>
            <div><label className="text-sm font-medium">Subtitle</label><input value={data.sectionSubtitle || ""} onChange={e => updateSection("sectionSubtitle", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1" /></div>
            <div><label className="text-sm font-medium">Button Link Text</label><input value={data.btnText || ""} onChange={e => updateSection("btnText", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1" /></div>
            <div className="p-3 bg-muted/30 border border-border rounded-lg"><p className="text-xs text-muted-foreground">Course multi-select integration will fetch directly from Course Database in production.</p></div>
          </div>
        )}

        {type === "benefits" && (
          <div>
            <div className="flex justify-between mb-2"><label className="text-sm font-medium">Benefit Cards</label><button onClick={() => updateArray("benefits", [...(data.benefits || []), { id: uid(), icon: "", title: "", desc: "" }])} className="text-xs text-primary">+ Add</button></div>
            {data.benefits?.map((b, i) => (
              <div key={b.id} className="p-3 mb-2 rounded-lg border border-border bg-muted/20 flex gap-2">
                <input value={b.icon} onChange={e => { const nb = [...data.benefits!]; nb[i].icon = e.target.value; updateArray("benefits", nb); }} placeholder="Icon" className="w-12 h-8 rounded border bg-secondary px-2 text-sm font-mono text-center" />
                <div className="flex-1 space-y-2">
                  <input value={b.title} onChange={e => { const nb = [...data.benefits!]; nb[i].title = e.target.value; updateArray("benefits", nb); }} placeholder="Title" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
                  <input value={b.desc} onChange={e => { const nb = [...data.benefits!]; nb[i].desc = e.target.value; updateArray("benefits", nb); }} placeholder="Description" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
                </div>
                <button onClick={() => { const nb = [...data.benefits!]; nb.splice(i, 1); updateArray("benefits", nb); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}

        {type === "categories" && (
          <div>
            <div className="flex justify-between mb-2"><label className="text-sm font-medium">Program Categories</label><button onClick={() => updateArray("categories", [...(data.categories || []), { id: uid(), icon: "", title: "", desc: "", link: "" }])} className="text-xs text-primary">+ Add Category</button></div>
            {data.categories?.map((b, i) => (
              <div key={b.id} className="p-3 mb-2 rounded-lg border border-border bg-muted/20 space-y-2 relative">
                <button onClick={() => { const nb = [...data.categories!]; nb.splice(i, 1); updateArray("categories", nb); }} className="absolute top-2 right-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
                <div className="flex gap-2">
                  <input value={b.icon} onChange={e => { const nb = [...data.categories!]; nb[i].icon = e.target.value; updateArray("categories", nb); }} placeholder="Icon" className="w-12 h-8 rounded border bg-secondary px-2 text-sm font-mono text-center" />
                  <input value={b.title} onChange={e => { const nb = [...data.categories!]; nb[i].title = e.target.value; updateArray("categories", nb); }} placeholder="Title" className="flex-1 h-8 rounded border bg-secondary px-2 text-sm" />
                </div>
                <input value={b.desc} onChange={e => { const nb = [...data.categories!]; nb[i].desc = e.target.value; updateArray("categories", nb); }} placeholder="Short description" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
                <input value={b.link} onChange={e => { const nb = [...data.categories!]; nb[i].link = e.target.value; updateArray("categories", nb); }} placeholder="Link (e.g., /category/web)" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
              </div>
            ))}
          </div>
        )}

        {type === "testimonials" && (
          <div>
            <div className="flex justify-between mb-2"><label className="text-sm font-medium">Student Testimonials</label><button onClick={() => updateArray("testimonials", [...(data.testimonials || []), { id: uid(), name: "", photo: "", course: "", text: "", rating: 5, videoLnk: "" }])} className="text-xs text-primary">+ Add</button></div>
            {data.testimonials?.map((b, i) => (
              <div key={b.id} className="p-3 mb-2 rounded-lg border border-border bg-muted/20 space-y-2 relative">
                <button onClick={() => { const nb = [...data.testimonials!]; nb.splice(i, 1); updateArray("testimonials", nb); }} className="absolute top-2 right-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
                <div className="grid grid-cols-2 gap-2">
                  <input value={b.name} onChange={e => { const nb = [...data.testimonials!]; nb[i].name = e.target.value; updateArray("testimonials", nb); }} placeholder="Name" className="h-8 rounded border bg-secondary px-2 text-sm" />
                  <input value={b.course} onChange={e => { const nb = [...data.testimonials!]; nb[i].course = e.target.value; updateArray("testimonials", nb); }} placeholder="Course Taken" className="h-8 rounded border bg-secondary px-2 text-sm" />
                </div>
                <input value={b.photo} onChange={e => { const nb = [...data.testimonials!]; nb[i].photo = e.target.value; updateArray("testimonials", nb); }} placeholder="Photo URL" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
                <textarea value={b.text} onChange={e => { const nb = [...data.testimonials!]; nb[i].text = e.target.value; updateArray("testimonials", nb); }} placeholder="Review text" className="w-full h-16 rounded border bg-secondary py-1 px-2 text-sm" />
                <input value={b.videoLnk} onChange={e => { const nb = [...data.testimonials!]; nb[i].videoLnk = e.target.value; updateArray("testimonials", nb); }} placeholder="Optional Video Link URL" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground mr-2">Rating:</span>
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => { const nb = [...data.testimonials!]; nb[i].rating = r; updateArray("testimonials", nb); }} className={r <= b.rating ? "text-warning" : "text-muted-foreground"}><Star className="h-4 w-4 fill-current" /></button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {type === "gallery" && (
          <div>
            <div className="flex justify-between mb-2"><label className="text-sm font-medium">Media Gallery</label><button onClick={() => updateArray("gallery", [...(data.gallery || []), { id: uid(), thumbnail: "", title: "", videoLnk: "" }])} className="text-xs text-primary">+ Add</button></div>
            {data.gallery?.map((b, i) => (
              <div key={b.id} className="p-3 mb-2 rounded-lg border border-border bg-muted/20 space-y-2 relative">
                <button onClick={() => { const nb = [...data.gallery!]; nb.splice(i, 1); updateArray("gallery", nb); }} className="absolute top-2 right-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
                <input value={b.thumbnail} onChange={e => { const nb = [...data.gallery!]; nb[i].thumbnail = e.target.value; updateArray("gallery", nb); }} placeholder="Thumbnail Image URL" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
                <input value={b.title} onChange={e => { const nb = [...data.gallery!]; nb[i].title = e.target.value; updateArray("gallery", nb); }} placeholder="Title" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
                <input value={b.videoLnk} onChange={e => { const nb = [...data.gallery!]; nb[i].videoLnk = e.target.value; updateArray("gallery", nb); }} placeholder="Video Link (optional)" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
              </div>
            ))}
          </div>
        )}

        {type === "placements" && (
          <div>
            <div className="flex justify-between mb-2"><label className="text-sm font-medium">Placement Stories</label><button onClick={() => updateArray("placements", [...(data.placements || []), { id: uid(), image: "", name: "", company: "", caption: "" }])} className="text-xs text-primary">+ Add</button></div>
            {data.placements?.map((b, i) => (
              <div key={b.id} className="p-3 mb-2 rounded-lg border border-border bg-muted/20 space-y-2 relative">
                <button onClick={() => { const nb = [...data.placements!]; nb.splice(i, 1); updateArray("placements", nb); }} className="absolute top-2 right-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
                <div className="grid grid-cols-2 gap-2">
                  <input value={b.name} onChange={e => { const nb = [...data.placements!]; nb[i].name = e.target.value; updateArray("placements", nb); }} placeholder="Student Name" className="h-8 rounded border bg-secondary px-2 text-sm" />
                  <input value={b.company} onChange={e => { const nb = [...data.placements!]; nb[i].company = e.target.value; updateArray("placements", nb); }} placeholder="Company Name" className="h-8 rounded border bg-secondary px-2 text-sm" />
                </div>
                <input value={b.image} onChange={e => { const nb = [...data.placements!]; nb[i].image = e.target.value; updateArray("placements", nb); }} placeholder="Student Image URL" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
                <input value={b.caption} onChange={e => { const nb = [...data.placements!]; nb[i].caption = e.target.value; updateArray("placements", nb); }} placeholder="Short Caption (e.g., Placed as SDE I)" className="w-full h-8 rounded border bg-secondary px-2 text-sm" />
              </div>
            ))}
          </div>
        )}

        {type === "faqs" && (
          <div>
            <div className="flex justify-between mb-2"><label className="text-sm font-medium">Frequently Asked Questions</label><button onClick={() => updateArray("faqs", [...(data.faqs || []), { id: uid(), q: "", a: "" }])} className="text-xs text-primary">+ Add</button></div>
            {data.faqs?.map((b, i) => (
              <div key={b.id} className="p-3 mb-2 rounded-lg border border-border bg-muted/20 relative">
                <button onClick={() => { const nb = [...data.faqs!]; nb.splice(i, 1); updateArray("faqs", nb); }} className="absolute top-2 right-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
                <input value={b.q} onChange={e => { const nb = [...data.faqs!]; nb[i].q = e.target.value; updateArray("faqs", nb); }} placeholder="Question" className="w-[85%] mb-2 h-8 rounded border bg-secondary px-2 text-sm" />
                <textarea value={b.a} onChange={e => { const nb = [...data.faqs!]; nb[i].a = e.target.value; updateArray("faqs", nb); }} placeholder="Answer" className="w-full h-16 rounded border bg-secondary px-2 py-1 text-sm" />
              </div>
            ))}
          </div>
        )}

        {type === "contact" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm border-b pb-1">Left Side (Info)</h4>
              <div><label className="text-xs font-medium">Office Address</label><input value={data.address || ""} onChange={e => updateSection("address", e.target.value)} className="w-full h-8 rounded border bg-secondary px-2 text-xs" /></div>
              <div><label className="text-xs font-medium">Phone Number</label><input value={data.phone || ""} onChange={e => updateSection("phone", e.target.value)} className="w-full h-8 rounded border bg-secondary px-2 text-xs" /></div>
              <div><label className="text-xs font-medium">Email Address</label><input value={data.email || ""} onChange={e => updateSection("email", e.target.value)} className="w-full h-8 rounded border bg-secondary px-2 text-xs" /></div>
              <div><label className="text-xs font-medium">Working Hours</label><input value={data.hours || ""} onChange={e => updateSection("hours", e.target.value)} className="w-full h-8 rounded border bg-secondary px-2 text-xs" /></div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm border-b pb-1">Right Side (Form Settings)</h4>
              <div><label className="text-xs font-medium">Form Title</label><input value={data.formTitle || ""} onChange={e => updateSection("formTitle", e.target.value)} className="w-full h-8 rounded border bg-secondary px-2 text-xs" /></div>
              <div><label className="text-xs font-medium">Submit Button Text</label><input value={data.submitBtnText || ""} onChange={e => updateSection("submitBtnText", e.target.value)} className="w-full h-8 rounded border bg-secondary px-2 text-xs" /></div>
              <div><label className="text-xs font-medium">Success Message</label><input value={data.successMsg || ""} onChange={e => updateSection("successMsg", e.target.value)} className="w-full h-8 rounded border bg-secondary px-2 text-xs" /></div>
            </div>
          </div>
        )}

        {type === "footer" && (
          <div className="space-y-3">
            <div><label className="text-sm font-medium">Logo / Brand Name</label><input value={data.logo || ""} onChange={e => updateSection("logo", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm" /></div>
            <div><label className="text-sm font-medium">About Text</label><textarea value={data.aboutText || ""} onChange={e => updateSection("aboutText", e.target.value)} className="w-full h-16 rounded-md border bg-secondary px-3 py-1 text-sm" /></div>

            <div>
              <div className="flex justify-between mb-1"><label className="text-sm font-medium">Social Links</label><button onClick={() => updateArray("socialLinks", [...(data.socialLinks || []), { id: uid(), platform: "", url: "" }])} className="text-xs text-primary">+ Add</button></div>
              {data.socialLinks?.map((l, i) => (
                <div key={l.id} className="flex gap-2 mb-2">
                  <input value={l.platform} onChange={e => { const nb = [...data.socialLinks!]; nb[i].platform = e.target.value; updateArray("socialLinks", nb); }} placeholder="Platform" className="w-1/3 h-8 rounded border bg-secondary px-2 text-xs" />
                  <input value={l.url} onChange={e => { const nb = [...data.socialLinks!]; nb[i].url = e.target.value; updateArray("socialLinks", nb); }} placeholder="URL" className="flex-1 h-8 rounded border bg-secondary px-2 text-xs" />
                  <button onClick={() => { const nb = [...data.socialLinks!]; nb.splice(i, 1); updateArray("socialLinks", nb); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between mb-1"><label className="text-sm font-medium">Quick Links</label><button onClick={() => updateArray("quickLinks", [...(data.quickLinks || []), { id: uid(), label: "", url: "" }])} className="text-xs text-primary">+ Add</button></div>
              {data.quickLinks?.map((l, i) => (
                <div key={l.id} className="flex gap-2 mb-2">
                  <input value={l.label} onChange={e => { const nb = [...data.quickLinks!]; nb[i].label = e.target.value; updateArray("quickLinks", nb); }} placeholder="Label" className="w-1/3 h-8 rounded border bg-secondary px-2 text-xs" />
                  <input value={l.url} onChange={e => { const nb = [...data.quickLinks!]; nb[i].url = e.target.value; updateArray("quickLinks", nb); }} placeholder="URL" className="flex-1 h-8 rounded border bg-secondary px-2 text-xs" />
                  <button onClick={() => { const nb = [...data.quickLinks!]; nb.splice(i, 1); updateArray("quickLinks", nb); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>

            <div><label className="text-sm font-medium">Copyright Text</label><input value={data.copyrightText || ""} onChange={e => updateSection("copyrightText", e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm" /></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <span>Website</span><ChevronRight className="h-3 w-3" /><span className="text-foreground font-medium">Home Page</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Home Page CMS</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your public-facing homepage layout and sections</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search sections..." className="h-9 w-56 rounded-lg border border-input bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 px-3 rounded-lg border border-input text-sm text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1.5 transition-colors">
                <Filter className="h-3.5 w-3.5" /> {statusFilter === "All" ? "All" : statusFilter}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              {["All", "Visible", "Hidden"].map((s) => (
                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>{s}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button onClick={() => setAddingNew(true)} className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> Add Section
          </button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sections", value: stats.total, icon: LayoutTemplate, spark: [3, 4, 5, 4, 6, 5, stats.total], color: "text-primary" },
          { label: "Visible Elements", value: stats.visible, icon: Eye, spark: [8, 10, 12, 11, 14, 13, stats.visible], color: "text-success" },
          { label: "Hidden Elements", value: stats.hidden, icon: EyeOff, spark: [2, 3, 3, 4, 3, 4, stats.hidden], color: "text-warning" },
          { label: "Unique Types", value: stats.types, icon: Layers, spark: [1, 2, 1, 2, 2, 1, stats.types], color: "text-info" },
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

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cms-sections">
          {(provided) => (
            <motion.div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sections.map((s, i) => (
                <Draggable key={s.id} draggableId={String(s.id)} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-card rounded-2xl border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col group relative ${snapshot.isDragging ? "ring-2 ring-primary/50 shadow-2xl scale-105 z-50" : ""}`}
                    >
                      {/* Image Thumbnail Header */}
                      <div className="relative h-44 overflow-hidden bg-muted">
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide shadow-sm z-10 ${s.visible ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                          {s.visible ? "Published" : "Hidden"}
                        </span>

                        <div {...provided.dragHandleProps} className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1.5 rounded-md text-white cursor-grab active:cursor-grabbing hover:bg-black/80 backdrop-blur-sm">
                          <GripVertical className="h-4 w-4" />
                        </div>

                        <img
                          src={sectionThumbnails[s.type] || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=300&fit=crop"}
                          alt={s.name}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!s.visible ? "grayscale opacity-50" : ""}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                          <h3 className="font-semibold text-lg text-white line-clamp-1">{s.name}</h3>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary uppercase tracking-wider">{s.type} Section</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3 mb-4 flex-1">{s.desc}</p>

                        {/* Stats / Status metrics similar to courses */}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-semibold mt-auto">
                          <span>Component Level</span>
                          <span className="flex items-center gap-1">Global Scope</span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-4 py-3 bg-muted/20 border-t border-border flex items-center justify-between">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleVis(s.id); }}
                          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${s.visible ? "text-success hover:text-success/80" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {s.visible ? <><Eye className="h-3.5 w-3.5" /> Published</> : <><EyeOff className="h-3.5 w-3.5" /> Hidden</>}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (s.type === "hero") {
                              navigate("/cms/hero");
                            } else {
                              setEditing({ ...s });
                            }
                          }}
                          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded-md transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" /> Edit Section
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </motion.div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={addingNew} onOpenChange={setAddingNew}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
            <DialogDescription>Add a new block to your page layout</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium">Section Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Special Offer" className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Layout Type</label>
              <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full h-9 rounded-md border bg-secondary px-3 text-sm focus:outline-none focus:ring-1 mt-1">
                <option value="about">Standard Text & Image</option>
                <option value="courses">Course List Banner</option>
                <option value="benefits">Mini Cards Grid</option>
                <option value="gallery">Media Gallery</option>
                <option value="faqs">FAQ Accordion</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
            <button onClick={() => setAddingNew(false)} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => {
              if (!newName) return toast.error("Name is required");
              const ns: Section = { id: Date.now(), name: newName, visible: true, desc: "Custom generated section", type: newType, data: {} };
              setSections([...sections, ns]);
              toast.success("Section added");
              setAddingNew(false);
              setNewName("");
            }} className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium flex gap-1.5 items-center"><Check className="h-4 w-4" /> Create</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(isOpen) => !isOpen && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>Edit Section: {editing?.name}</DialogTitle>
            <DialogDescription>Make changes to this section's content below.</DialogDescription>
          </DialogHeader>
          {editing && renderEditor(editing)}
          <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted">Close</button>
            <button onClick={() => { handleSave(); setEditing(null); }} className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium flex gap-1.5 items-center"><Save className="h-4 w-4" /> Save Details</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
