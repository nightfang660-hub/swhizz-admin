import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ChevronRight, Save, Eye, Upload, Plus, Trash2, Edit, X,
    ArrowLeft, ChevronDown, ChevronUp, Image, Type, MousePointer,
    Video, Monitor, Layers, AlignLeft, Link as LinkIcon, Star,
    LayoutTemplate, Sparkles,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// ───────────────────────────── Types ──────────────────────────────
interface HeroImage {
    id: number;
    url: string;
    label: string;
    role: "background" | "foreground" | "overlay";
    positionX: string;
    positionY: string;
    opacity: number;
}

interface CTAButton {
    id: number;
    label: string;
    link: string;
    style: "primary" | "secondary" | "outline";
}

interface HeroSectionData {
    heading: string;
    headingHighlight: string;
    subheading: string;
    images: HeroImage[];
    buttons: CTAButton[];
    videoLink: string;
    overlayOpacity: number;
    published: boolean;
    scrollAnimation: boolean;
    metaTitle: string;
    metaDescription: string;
}

// ───────────────────────── Initial State ──────────────────────────
const defaultData: HeroSectionData = {
    heading: "Transform Your Career with Industry-Ready IT Training",
    headingHighlight: "Industry-Ready",
    subheading: "Learn from the best to become the best in your field. Join 10,000+ students.",
    images: [
        {
            id: 1,
            url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop",
            label: "Hero Background",
            role: "background",
            positionX: "center",
            positionY: "center",
            opacity: 100,
        },
        {
            id: 2,
            url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=500&fit=crop",
            label: "Students Foreground",
            role: "foreground",
            positionX: "right",
            positionY: "bottom",
            opacity: 100,
        },
    ],
    buttons: [
        { id: 1, label: "Explore Courses", link: "/courses", style: "primary" },
        { id: 2, label: "Free Counseling", link: "/contact", style: "outline" },
    ],
    videoLink: "",
    overlayOpacity: 50,
    published: true,
    scrollAnimation: true,
    metaTitle: "Swhizz Tech — Transform Your Career",
    metaDescription: "Industry-focused IT training with 100% placement support.",
};

// ─────────────────────────── Component ────────────────────────────
export default function HeroSectionPage() {
    const navigate = useNavigate();
    const [data, setData] = useState<HeroSectionData>(defaultData);
    const [expandedSection, setExpandedSection] = useState<string | null>("images");
    const [editingImage, setEditingImage] = useState<HeroImage | null>(null);

    const toggle = (s: string) => setExpandedSection(expandedSection === s ? null : s);

    const handleSave = () => {
        toast.success("Hero section saved successfully!");
        navigate("/cms");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageId: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData(prev => ({
                    ...prev,
                    images: prev.images.map(img => img.id === imageId ? { ...img, url: reader.result as string } : img),
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addImage = () => {
        const newImg: HeroImage = {
            id: Date.now(),
            url: "",
            label: "New Image",
            role: "overlay",
            positionX: "center",
            positionY: "center",
            opacity: 100,
        };
        setData(prev => ({ ...prev, images: [...prev.images, newImg] }));
        setEditingImage(newImg);
    };

    const removeImage = (id: number) => {
        setData(prev => ({ ...prev, images: prev.images.filter(img => img.id !== id) }));
    };

    const updateImage = (id: number, field: keyof HeroImage, value: string | number) => {
        setData(prev => ({
            ...prev,
            images: prev.images.map(img => img.id === id ? { ...img, [field]: value } : img),
        }));
    };

    const addButton = () => {
        setData(prev => ({
            ...prev,
            buttons: [...prev.buttons, { id: Date.now(), label: "", link: "", style: "secondary" }],
        }));
    };

    const removeButton = (id: number) => {
        setData(prev => ({ ...prev, buttons: prev.buttons.filter(b => b.id !== id) }));
    };

    const updateButton = (id: number, field: keyof CTAButton, value: string) => {
        setData(prev => ({
            ...prev,
            buttons: prev.buttons.map(b => b.id === id ? { ...b, [field]: value } : b),
        }));
    };

    const inputClass = "h-9 w-full rounded-lg border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20";
    const textareaClass = "w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20";

    const roleColors: Record<HeroImage["role"], string> = {
        background: "bg-primary/10 text-primary",
        foreground: "bg-success/10 text-success",
        overlay: "bg-warning/10 text-warning",
    };

    const SectionHeader = ({
        id: sId, title, desc, icon: Icon, count,
    }: { id: string; title: string; desc: string; icon: React.ElementType; count?: number }) => (
        <button
            onClick={() => toggle(sId)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-t-2xl"
        >
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-xl gradient-soft flex items-center justify-center text-primary">
                    <Icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                        {count !== undefined && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{count}</span>
                        )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
                </div>
            </div>
            {expandedSection === sId
                ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
        </button>
    );

    // ── Live mini preview of the hero ──
    const bgImage = data.images.find(i => i.role === "background");
    const fgImage = data.images.find(i => i.role === "foreground");

    return (
        <div className="space-y-4 max-w-[1200px] mx-auto pb-10">

            {/* ── Page Header ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <button onClick={() => navigate("/cms")} className="hover:text-foreground transition-colors flex items-center gap-1">
                            <ArrowLeft className="h-3 w-3" /> Home Page CMS
                        </button>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground font-medium">Hero Banner Editor</span>
                    </div>
                    <h1 className="text-2xl font-bold font-heading text-foreground">Hero Section Builder</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Manage background, foreground images, text and call-to-action buttons</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={data.published ? "bg-success/10 text-success border-0" : "bg-warning/10 text-warning border-0"}>
                        {data.published ? "Published" : "Draft"}
                    </Badge>
                    <button className="h-9 px-3 rounded-lg border border-input text-sm text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1.5 transition-colors">
                        <Eye className="h-3.5 w-3.5" /> Preview
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">
                        <Save className="h-4 w-4" /> Save Hero
                    </button>
                </div>
            </motion.div>

            {/* ── Mini Live Preview ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative h-52 rounded-2xl overflow-hidden border border-border shadow-card">
                {bgImage?.url && (
                    <img src={bgImage.url} alt="bg" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: data.overlayOpacity / 100 }}
                />
                {fgImage?.url && (
                    <img
                        src={fgImage.url}
                        alt="fg"
                        className="absolute right-4 bottom-0 h-48 object-contain"
                    />
                )}
                <div className="absolute inset-0 flex flex-col justify-center px-10">
                    <span className="text-[10px] uppercase tracking-widest text-white/60 font-semibold mb-2">Live Preview</span>
                    <h2 className="text-2xl font-bold text-white leading-tight max-w-md">
                        {data.heading.split(data.headingHighlight).map((part, i, arr) => (
                            <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                    <span className="text-primary">{data.headingHighlight}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </h2>
                    <p className="text-sm text-white/70 mt-2 max-w-sm line-clamp-2">{data.subheading}</p>
                    <div className="flex gap-2 mt-4">
                        {data.buttons.map(b => (
                            <span key={b.id} className={`px-4 py-1.5 rounded-lg text-xs font-medium ${b.style === "primary" ? "gradient-primary text-primary-foreground shadow-glow"
                                    : b.style === "outline" ? "border border-white/50 text-white"
                                        : "bg-white/10 text-white"
                                }`}>
                                {b.label || "Button"}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 bg-card/80 backdrop-blur rounded-lg text-[10px] font-medium text-foreground flex items-center gap-1">
                    <Monitor className="h-3 w-3" /> Live Preview
                </div>
            </motion.div>

            {/* ── SECTION 1: Image Manager ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <SectionHeader
                    id="images"
                    title="Image Layers"
                    desc="Manage background, foreground and overlay images. Stack them visually on the hero."
                    icon={Image}
                    count={data.images.length}
                />
                {expandedSection === "images" && (
                    <div className="p-4 pt-0 border-t border-border space-y-4 mt-4">

                        {/* Overlay opacity */}
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border">
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-foreground mb-1">Dark Overlay Intensity: {data.overlayOpacity}%</p>
                                <input
                                    type="range" min={0} max={90} value={data.overlayOpacity}
                                    onChange={e => setData(prev => ({ ...prev, overlayOpacity: Number(e.target.value) }))}
                                    className="w-full accent-primary"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">Scroll Animation</p>
                                <Switch checked={data.scrollAnimation} onCheckedChange={v => setData(prev => ({ ...prev, scrollAnimation: v }))} />
                            </div>
                        </div>

                        {/* Image cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.images.map((img, idx) => (
                                <div key={img.id} className="group rounded-xl border border-border bg-muted/20 overflow-hidden hover:border-primary/30 hover:shadow-card-hover transition-all">
                                    {/* Thumbnail */}
                                    <div className="relative h-36 bg-muted">
                                        {img.url ? (
                                            <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                        ) : (
                                            <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-muted/80 transition-colors">
                                                <Upload className="h-7 w-7 text-muted-foreground mb-1" />
                                                <span className="text-xs text-muted-foreground">Upload image</span>
                                                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, img.id)} className="hidden" />
                                            </label>
                                        )}
                                        {/* Role badge */}
                                        <div className="absolute top-2 left-2">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${roleColors[img.role]}`}>
                                                {img.role}
                                            </span>
                                        </div>
                                        {/* Actions */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingImage(img)} className="h-6 w-6 rounded-md bg-card/90 backdrop-blur text-foreground hover:bg-card flex items-center justify-center shadow-sm">
                                                <Edit className="h-3 w-3" />
                                            </button>
                                            {data.images.length > 1 && (
                                                <button onClick={() => removeImage(img.id)} className="h-6 w-6 rounded-md bg-destructive/90 backdrop-blur text-white hover:bg-destructive flex items-center justify-center shadow-sm">
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                        {img.url && (
                                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
                                        )}
                                        <div className="absolute bottom-2 left-2">
                                            <span className="text-[10px] text-white font-semibold">Layer {idx + 1}</span>
                                        </div>
                                    </div>

                                    {/* Label + URL */}
                                    <div className="p-3 space-y-2">
                                        <div>
                                            <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Label</label>
                                            <input value={img.label} onChange={e => updateImage(img.id, "label", e.target.value)} className={inputClass} placeholder="e.g. Hero Background" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Image URL</label>
                                            <input value={img.url} onChange={e => updateImage(img.id, "url", e.target.value)} className={inputClass} placeholder="https://..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Role</label>
                                                <select value={img.role} onChange={e => updateImage(img.id, "role", e.target.value as HeroImage["role"])} className={inputClass}>
                                                    <option value="background">Background</option>
                                                    <option value="foreground">Foreground</option>
                                                    <option value="overlay">Overlay</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Opacity: {img.opacity}%</label>
                                                <input type="range" min={10} max={100} value={img.opacity}
                                                    onChange={e => updateImage(img.id, "opacity", Number(e.target.value))}
                                                    className="w-full mt-2 accent-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">H. Position</label>
                                                <select value={img.positionX} onChange={e => updateImage(img.id, "positionX", e.target.value)} className={inputClass}>
                                                    {["left", "center", "right"].map(v => <option key={v}>{v}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">V. Position</label>
                                                <select value={img.positionY} onChange={e => updateImage(img.id, "positionY", e.target.value)} className={inputClass}>
                                                    {["top", "center", "bottom"].map(v => <option key={v}>{v}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add image button */}
                            <button
                                onClick={addImage}
                                className="h-full min-h-[280px] rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex flex-col items-center justify-center gap-2"
                            >
                                <Plus className="h-8 w-8" />
                                <span className="text-sm font-medium">Add Image Layer</span>
                                <span className="text-[10px]">Background, Foreground or Overlay</span>
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* ── SECTION 2: Text Content ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <SectionHeader id="text" title="Headline & Copy" desc="Main heading, highlighted keyword, subheading text shown on the hero." icon={Type} />
                {expandedSection === "text" && (
                    <div className="p-4 pt-0 border-t border-border mt-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1.5">Main Heading</label>
                            <textarea
                                value={data.heading}
                                onChange={e => setData(prev => ({ ...prev, heading: e.target.value }))}
                                rows={2}
                                className={textareaClass}
                                placeholder="Transform Your Career with..."
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">This is the large headline displayed on the hero banner.</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1.5">
                                Highlight Keyword <span className="text-muted-foreground font-normal">(exact word/phrase from heading to colorize)</span>
                            </label>
                            <input
                                value={data.headingHighlight}
                                onChange={e => setData(prev => ({ ...prev, headingHighlight: e.target.value }))}
                                className={inputClass}
                                placeholder="e.g. Industry-Ready"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">This exact text inside the heading will be rendered in your brand color.</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1.5">Subheading / Tagline</label>
                            <textarea
                                value={data.subheading}
                                onChange={e => setData(prev => ({ ...prev, subheading: e.target.value }))}
                                rows={3}
                                className={textareaClass}
                                placeholder="Learn from the best..."
                            />
                        </div>
                    </div>
                )}
            </motion.div>

            {/* ── SECTION 3: CTA Buttons ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <SectionHeader id="buttons" title="Call-to-Action Buttons" desc="Add, remove and configure the buttons shown on the hero." icon={MousePointer} count={data.buttons.length} />
                {expandedSection === "buttons" && (
                    <div className="p-4 pt-0 border-t border-border mt-4 space-y-3">
                        {data.buttons.map((btn, idx) => (
                            <div key={btn.id} className="group flex gap-3 items-start p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/20 transition-all">
                                <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0 mt-1">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1.5">Button Label</label>
                                        <input value={btn.label} onChange={e => updateButton(btn.id, "label", e.target.value)} className={inputClass} placeholder="e.g. Explore Courses" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1.5">Link / URL</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                            <input value={btn.link} onChange={e => updateButton(btn.id, "link", e.target.value)} className={`${inputClass} pl-8`} placeholder="/courses" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1.5">Style</label>
                                        <select value={btn.style} onChange={e => updateButton(btn.id, "style", e.target.value as CTAButton["style"])} className={inputClass}>
                                            <option value="primary">Primary (Gradient)</option>
                                            <option value="outline">Outline (Border)</option>
                                            <option value="secondary">Secondary (Muted)</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Preview + delete */}
                                <div className="flex flex-col gap-2 shrink-0">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${btn.style === "primary" ? "gradient-primary text-primary-foreground shadow-glow"
                                            : btn.style === "outline" ? "border border-border text-foreground"
                                                : "bg-secondary text-muted-foreground"
                                        }`}>
                                        {btn.label || "Preview"}
                                    </span>
                                    {data.buttons.length > 1 && (
                                        <button onClick={() => removeButton(btn.id)} className="h-6 w-6 rounded-md flex items-center justify-center text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity mx-auto">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addButton}
                            className="w-full h-10 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1.5"
                        >
                            <Plus className="h-4 w-4" /> Add Button
                        </button>
                    </div>
                )}
            </motion.div>

            {/* ── SECTION 4: Video Popup ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <SectionHeader id="video" title="Optional Video Popup" desc="Add a YouTube/Vimeo link to play when the user clicks the play button on the hero." icon={Video} />
                {expandedSection === "video" && (
                    <div className="p-4 pt-0 border-t border-border mt-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1.5">Video URL</label>
                            <input
                                value={data.videoLink}
                                onChange={e => setData(prev => ({ ...prev, videoLink: e.target.value }))}
                                className={inputClass}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">Supports YouTube, Vimeo, or any direct video URL. Leave empty to hide the play button.</p>
                        </div>
                        {data.videoLink && (
                            <div className="p-3 bg-muted/30 rounded-xl border border-border flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-glow">
                                    <Video className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">Video configured</p>
                                    <p className="text-[10px] text-muted-foreground truncate max-w-xs">{data.videoLink}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            {/* ── SECTION 5: Animation & Display ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <SectionHeader id="display" title="Animation & Display Settings" desc="Control scroll animations, publish status and visibility on the live site." icon={Sparkles} />
                {expandedSection === "display" && (
                    <div className="p-4 pt-0 border-t border-border mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Scroll Animation</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Fade-in and slide animations when page loads and scrolls</p>
                                </div>
                                <Switch checked={data.scrollAnimation} onCheckedChange={v => setData(prev => ({ ...prev, scrollAnimation: v }))} />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Published</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Make the hero section visible on the live website</p>
                                </div>
                                <Switch checked={data.published} onCheckedChange={v => setData(prev => ({ ...prev, published: v }))} />
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* ── SECTION 6: SEO ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <SectionHeader id="seo" title="SEO & Meta Tags" desc="Optimize how this page appears in search engine results." icon={Star} />
                {expandedSection === "seo" && (
                    <div className="p-4 pt-0 border-t border-border mt-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1.5">Meta Title</label>
                            <input value={data.metaTitle} onChange={e => setData(prev => ({ ...prev, metaTitle: e.target.value }))} className={inputClass} placeholder="Page Title for Google" />
                            <p className="text-[10px] text-muted-foreground mt-1">Recommended: 50–60 characters</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1.5">Meta Description</label>
                            <textarea value={data.metaDescription} onChange={e => setData(prev => ({ ...prev, metaDescription: e.target.value }))} rows={2} className={textareaClass} placeholder="A concise description for search engines." />
                            <p className="text-[10px] text-muted-foreground mt-1">Recommended: 150–160 characters. Currently: {data.metaDescription.length}</p>
                        </div>
                        {/* Google Preview */}
                        <div className="p-4 rounded-xl bg-muted/30 border border-border">
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-2">Google Search Preview</p>
                            <p className="text-sm text-blue-500 font-medium truncate">{data.metaTitle || "Page Title"}</p>
                            <p className="text-[11px] text-green-600">swhizz.tech › homepage</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{data.metaDescription || "Meta description will appear here..."}</p>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* ── Bottom Save Bar ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="sticky bottom-4 z-10">
                <div className="bg-card/95 backdrop-blur border border-border rounded-2xl shadow-card-hover p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl gradient-soft flex items-center justify-center text-primary">
                            <LayoutTemplate className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Hero Section</p>
                            <p className="text-[10px] text-muted-foreground">{data.images.length} image layers · {data.buttons.length} buttons · {data.scrollAnimation ? "Animated" : "Static"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate("/cms")} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-1.5 h-9 px-5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">
                            <Save className="h-4 w-4" /> Save & Publish
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
