import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save, Plus, Trash2, Edit, X, Check, Clock, IndianRupee,
    GripVertical, BookOpen, Wifi, MapPin, Calendar, Zap, Star,
    Eye, EyeOff, ChevronDown, ChevronUp, Copy, Search,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";

// ──────────────────────── Types ────────────────────────────
type BatchMode = "Online" | "Offline" | "Hybrid";
type BatchBadge = "none" | "FILLING FAST" | "POPULAR" | "NEW" | "LIMITED SEATS";

interface BatchItem {
    id: number;
    courseName: string;
    amount: number;
    batchTime: string;
    startDate: string;
    mode: BatchMode;
    badge: BatchBadge;
    visible: boolean;
    enrollLink: string;
    seats: number;
}

// ──────────────────── Sample Data ──────────────────────────
const initialBatches: BatchItem[] = [
    { id: 1, courseName: "Java Full Stack", amount: 35000, batchTime: "08:00 AM", startDate: "2024-05-15", mode: "Hybrid", badge: "FILLING FAST", visible: true, enrollLink: "/enroll/java-full-stack", seats: 30 },
    { id: 2, courseName: "Salesforce CRM", amount: 40000, batchTime: "10:00 AM", startDate: "2024-06-22", mode: "Hybrid", badge: "POPULAR", visible: true, enrollLink: "/enroll/salesforce-crm", seats: 25 },
    { id: 3, courseName: "DevOps + AWS", amount: 30000, batchTime: "07:30 PM", startDate: "2024-06-28", mode: "Hybrid", badge: "none", visible: true, enrollLink: "/enroll/devops-aws", seats: 20 },
    { id: 4, courseName: "Cybersecurity (VAPT)", amount: 30000, batchTime: "10:00 AM", startDate: "2024-06-05", mode: "Hybrid", badge: "none", visible: true, enrollLink: "/enroll/cybersecurity", seats: 20 },
    { id: 5, courseName: "Data Science (AI+ML)", amount: 50000, batchTime: "09:00 AM", startDate: "2024-06-12", mode: "Online", badge: "none", visible: true, enrollLink: "/enroll/data-science", seats: 40 },
    { id: 6, courseName: "Software Testing Pro", amount: 25000, batchTime: "08:00 AM", startDate: "2024-06-16", mode: "Hybrid", badge: "none", visible: true, enrollLink: "/enroll/software-testing", seats: 30 },
    { id: 7, courseName: "Internships (Real-Time)", amount: 10000, batchTime: "Flexible", startDate: "", mode: "Offline", badge: "none", visible: true, enrollLink: "/enroll/internship", seats: 50 },
];

const badgeStyles: Record<BatchBadge, string> = {
    none: "",
    "FILLING FAST": "bg-warning/15 text-warning border-warning/30",
    "POPULAR": "bg-success/15 text-success border-success/30",
    "NEW": "bg-primary/15 text-primary border-primary/30",
    "LIMITED SEATS": "bg-destructive/15 text-destructive border-destructive/30",
};

const modeIcon = {
    Online: Wifi,
    Offline: MapPin,
    Hybrid: Zap,
};

const defaultBatch: Omit<BatchItem, "id"> = {
    courseName: "",
    amount: 0,
    batchTime: "",
    startDate: "",
    mode: "Hybrid",
    badge: "none",
    visible: true,
    enrollLink: "",
    seats: 30,
};

// ──────────────────── Component ────────────────────────────
export default function BatchesPageCMS() {
    const [loading, setLoading] = useState(true);
    const [batches, setBatches] = useState<BatchItem[]>(initialBatches);
    const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [statsOpen, setStatsOpen] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(t);
    }, []);

    const filtered = batches.filter(b =>
        b.courseName.toLowerCase().includes(search.toLowerCase())
    );

    const handleSave = () => {
        toast.success("Batches page saved successfully!");
    };

    const openAdd = () => {
        setEditingBatch({ id: 0, ...defaultBatch });
    };

    const handleSaveBatch = () => {
        if (!editingBatch) return;
        if (!editingBatch.courseName.trim()) return toast.error("Course name is required");
        if (editingBatch.amount <= 0) return toast.error("Amount must be greater than 0");
        if (!editingBatch.batchTime.trim()) return toast.error("Batch time is required");

        if (editingBatch.id === 0) {
            // New batch
            const newBatch = { ...editingBatch, id: Date.now() };
            setBatches(prev => [...prev, newBatch]);
            toast.success(`"${editingBatch.courseName}" batch added!`);
        } else {
            setBatches(prev => prev.map(b => b.id === editingBatch.id ? editingBatch : b));
            toast.success(`"${editingBatch.courseName}" updated!`);
        }
        setEditingBatch(null);
    };

    const handleDelete = () => {
        if (deleteTarget === null) return;
        setBatches(prev => prev.filter(b => b.id !== deleteTarget));
        toast.success("Batch deleted");
        setDeleteTarget(null);
    };

    const toggleVisible = (id: number) => {
        setBatches(prev => prev.map(b => b.id === id ? { ...b, visible: !b.visible } : b));
    };

    const duplicateBatch = (b: BatchItem) => {
        const dup = { ...b, id: Date.now(), courseName: `${b.courseName} (Copy)` };
        setBatches(prev => [...prev, dup]);
        toast.success("Batch duplicated");
    };

    const inputClass = "h-9 w-full rounded-lg border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20";

    const stats = {
        total: batches.length,
        visible: batches.filter(b => b.visible).length,
        online: batches.filter(b => b.mode === "Online").length,
        avgFee: batches.length ? Math.round(batches.reduce((s, b) => s + b.amount, 0) / batches.length) : 0,
    };

    if (loading) return (
        <div className="space-y-4 max-w-[1200px] mx-auto pb-8 animate-pulse">
            <div className="h-10 w-64 bg-muted rounded-xl" />
            <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-2xl" />)}</div>
            <div className="h-96 bg-muted rounded-2xl" />
        </div>
    );

    return (
        <div className="space-y-5 max-w-[1200px] mx-auto pb-10">

            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-foreground">Batches Manager</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Add, edit, and manage all upcoming training batches and their fees</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={openAdd} className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
                        <Plus className="h-4 w-4" /> Add Batch
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">
                        <Save className="h-4 w-4" /> Save All
                    </button>
                </div>
            </motion.div>

            {/* ── Stats ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Batches", value: stats.total, icon: BookOpen, color: "text-primary" },
                    { label: "Visible", value: stats.visible, icon: Eye, color: "text-success" },
                    { label: "Online Batches", value: stats.online, icon: Wifi, color: "text-blue-500" },
                    { label: "Avg. Fee", value: `₹${stats.avgFee.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-orange-500" },
                ].map((s, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-card flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl gradient-soft flex items-center justify-center ${s.color}`}>
                            <s.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-foreground">{s.value}</p>
                            <p className="text-[11px] text-muted-foreground">{s.label}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* ── Batch Table ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border gap-3 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{filtered.length} Batch{filtered.length !== 1 ? "es" : ""}</p>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search batches..."
                            className="h-8 pl-8 pr-3 rounded-lg border border-input bg-secondary text-xs focus:outline-none focus:ring-1 focus:ring-ring/30 w-52"
                        />
                    </div>
                </div>

                {/* Batch cards list */}
                <div className="divide-y divide-border">
                    <AnimatePresence>
                        {filtered.map((batch, idx) => {
                            const ModeIc = modeIcon[batch.mode];
                            return (
                                <motion.div
                                    key={batch.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className={`group flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors ${!batch.visible ? "opacity-50" : ""}`}
                                >
                                    {/* Drag handle */}
                                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />

                                    {/* Course number */}
                                    <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                                        {idx + 1}
                                    </div>

                                    {/* Course info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-foreground">{batch.courseName}</p>
                                            {batch.badge !== "none" && (
                                                <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase tracking-wide border ${badgeStyles[batch.badge]}`}>
                                                    {batch.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                                            <span className="flex items-center gap-1"><ModeIc className="h-3 w-3" />{batch.mode}</span>
                                            {batch.startDate && (
                                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Starts {new Date(batch.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                            )}
                                            <span>{batch.seats} seats</span>
                                        </div>
                                    </div>

                                    {/* Batch Time */}
                                    <div className="text-center shrink-0 hidden sm:block">
                                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Batch Time</p>
                                        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                                            <Clock className="h-3.5 w-3.5 text-primary" />
                                            {batch.batchTime}
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="text-center shrink-0">
                                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Course Fee</p>
                                        <div className="flex items-center gap-0.5 text-sm font-bold text-foreground">
                                            <IndianRupee className="h-3.5 w-3.5 text-primary" />
                                            {batch.amount.toLocaleString("en-IN")}
                                        </div>
                                    </div>

                                    {/* Visibility toggle */}
                                    <div className="shrink-0">
                                        <Switch checked={batch.visible} onCheckedChange={() => toggleVisible(batch.id)} />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingBatch({ ...batch })} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                            <Edit className="h-3.5 w-3.5" />
                                        </button>
                                        <button onClick={() => duplicateBatch(batch)} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                            <Copy className="h-3.5 w-3.5" />
                                        </button>
                                        <button onClick={() => setDeleteTarget(batch.id)} className="h-7 w-7 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <BookOpen className="h-10 w-10 mb-3 opacity-40" />
                            <p className="text-sm font-medium">{search ? "No batches match your search" : "No batches yet"}</p>
                            <button onClick={openAdd} className="mt-3 text-xs text-primary hover:underline flex items-center gap-1">
                                <Plus className="h-3 w-3" /> Add your first batch
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer add row */}
                <div className="border-t border-border px-5 py-3">
                    <button onClick={openAdd} className="w-full h-9 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
                        <Plus className="h-4 w-4" /> Add New Batch
                    </button>
                </div>
            </motion.div>

            {/* ── Edit / Add Dialog ── */}
            <Dialog open={!!editingBatch} onOpenChange={(open) => { if (!open) setEditingBatch(null); }}>
                <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-base">
                            {editingBatch?.id === 0 ? "Add New Batch" : `Edit — ${editingBatch?.courseName}`}
                        </DialogTitle>
                    </DialogHeader>

                    {editingBatch && (
                        <div className="space-y-5 pt-1">

                            {/* Row 1: Course name + Badge */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1.5">
                                        Course Name <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        autoFocus
                                        value={editingBatch.courseName}
                                        onChange={e => setEditingBatch({ ...editingBatch, courseName: e.target.value })}
                                        className={inputClass}
                                        placeholder="e.g. Java Full Stack"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1.5">Badge / Tag</label>
                                    <select value={editingBatch.badge} onChange={e => setEditingBatch({ ...editingBatch, badge: e.target.value as BatchBadge })} className={inputClass}>
                                        <option value="none">— No Badge —</option>
                                        <option value="FILLING FAST">🔥 FILLING FAST</option>
                                        <option value="POPULAR">⭐ POPULAR</option>
                                        <option value="NEW">🆕 NEW</option>
                                        <option value="LIMITED SEATS">🚨 LIMITED SEATS</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Amount + Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1.5">
                                        Course Fee (₹) <span className="text-destructive">*</span>
                                    </label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <input
                                            type="number"
                                            value={editingBatch.amount || ""}
                                            onChange={e => setEditingBatch({ ...editingBatch, amount: Number(e.target.value) })}
                                            className={`${inputClass} pl-8`}
                                            placeholder="e.g. 35000"
                                            min={0}
                                        />
                                    </div>
                                    {editingBatch.amount > 0 && (
                                        <p className="text-[10px] text-muted-foreground mt-1">= ₹{editingBatch.amount.toLocaleString("en-IN")}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1.5">
                                        Batch Time <span className="text-destructive">*</span>
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <input
                                            value={editingBatch.batchTime}
                                            onChange={e => setEditingBatch({ ...editingBatch, batchTime: e.target.value })}
                                            className={`${inputClass} pl-8`}
                                            placeholder="e.g. 08:00 AM or Flexible"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">You can type AM/PM times or just "Flexible"</p>
                                </div>
                            </div>

                            {/* Row 3: Start Date + Seats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1.5">Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <input
                                            type="date"
                                            value={editingBatch.startDate}
                                            onChange={e => setEditingBatch({ ...editingBatch, startDate: e.target.value })}
                                            className={`${inputClass} pl-8`}
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">Leave empty to show "Starts Ongoing"</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1.5">Total Seats</label>
                                    <input
                                        type="number"
                                        value={editingBatch.seats || ""}
                                        onChange={e => setEditingBatch({ ...editingBatch, seats: Number(e.target.value) })}
                                        className={inputClass}
                                        placeholder="e.g. 30"
                                        min={1}
                                    />
                                </div>
                            </div>

                            {/* Row 4: Mode + Enroll Link */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1.5">Mode</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(["Online", "Offline", "Hybrid"] as BatchMode[]).map(m => {
                                            const Ic = modeIcon[m];
                                            return (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => setEditingBatch({ ...editingBatch, mode: m })}
                                                    className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${editingBatch.mode === m
                                                            ? "border-primary gradient-soft text-primary shadow-glow"
                                                            : "border-border text-muted-foreground hover:border-primary/30"
                                                        }`}
                                                >
                                                    <Ic className="h-4 w-4" />
                                                    {m}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1.5">Enroll Link / Slug</label>
                                    <input
                                        value={editingBatch.enrollLink}
                                        onChange={e => setEditingBatch({ ...editingBatch, enrollLink: e.target.value })}
                                        className={inputClass}
                                        placeholder="/enroll/course-slug"
                                    />
                                </div>
                            </div>

                            {/* Visibility toggle */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Visible on website</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Toggle off to hide this batch without deleting</p>
                                </div>
                                <Switch checked={editingBatch.visible} onCheckedChange={v => setEditingBatch({ ...editingBatch, visible: v })} />
                            </div>

                            {/* Live Preview Card */}
                            <div className="rounded-xl border border-border bg-muted/30 p-4">
                                <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-3">Live Card Preview</p>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-bold text-foreground">{editingBatch.courseName || "Course Name"}</p>
                                            {editingBatch.badge !== "none" && (
                                                <Badge variant="outline" className={`text-[9px] px-1.5 border ${badgeStyles[editingBatch.badge]}`}>
                                                    {editingBatch.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                                            {React.createElement(modeIcon[editingBatch.mode], { className: "h-3 w-3" })}
                                            <span>{editingBatch.mode}</span>
                                            {editingBatch.startDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Starts {new Date(editingBatch.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] text-muted-foreground uppercase mb-0.5">Batch Time</p>
                                        <p className="text-sm font-bold text-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" />{editingBatch.batchTime || "—"}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] text-muted-foreground uppercase mb-0.5">Course Fee</p>
                                        <p className="text-sm font-bold text-foreground flex items-center gap-0.5"><IndianRupee className="h-3.5 w-3.5 text-primary" />{editingBatch.amount ? editingBatch.amount.toLocaleString("en-IN") : "—"}</p>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold shadow-glow">
                                        Enroll Now →
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-1 border-t border-border">
                                <button onClick={() => setEditingBatch(null)} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSaveBatch} className="h-9 px-5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity flex items-center gap-1.5">
                                    <Check className="h-4 w-4" /> {editingBatch.id === 0 ? "Add Batch" : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ── Confirm Delete ── */}
            <ConfirmDeleteModal
                open={deleteTarget !== null}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                title="Delete Batch?"
                description={`This will permanently remove "${batches.find(b => b.id === deleteTarget)?.courseName}" from the batches list.`}
            />
        </div>
    );
}
