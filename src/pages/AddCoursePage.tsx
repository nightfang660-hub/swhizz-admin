import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight, Save, Eye, Upload, Plus, Trash2, Edit, GripVertical, X,
  Play, Shield, Monitor, Code, Database, Globe, Zap, Target, Star,
  Users, Award, BookOpen, ArrowLeft, ChevronDown, ChevronUp,
  MessageSquare, Briefcase, TrendingUp, CheckCircle, Image,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";

// Icon map for skills
const skillIcons: Record<string, React.ElementType> = {
  Shield, Monitor, Code, Database, Globe, Zap, Target, Star, Users, Award, BookOpen, Briefcase, TrendingUp,
};
const skillIconNames = Object.keys(skillIcons);

interface SubModuleItem { id: number; name: string; topics: string[]; }
interface SkillItem { id: number; title: string; icon: string; }
interface ModuleItem { id: number; number: number; title: string; description: string; thumbnail: string; topics: string[]; subModules: SubModuleItem[]; }
interface ProjectItem { id: number; title: string; description: string; tags: string[]; grade: string; }
interface BenefitItem { id: number; title: string; description: string; icon: string; }
interface AudienceItem { id: number; title: string; description: string; icon: string; }
interface JourneyStep { id: number; step: number; title: string; description: string; }
interface FAQItem { id: number; question: string; answer: string; }

const sampleCourse = {
  title: "",
  subtitle: "",
  description: "",
  duration: "",
  skillLevel: "All Levels",
  mode: "Hybrid / Live",
  thumbnail: "",
  videoLink: "",
  status: "Draft",
  skills: [] as SkillItem[],
  modules: [] as ModuleItem[],
  projects: [] as ProjectItem[],
  projectSectionTitle: "",
  projectSectionDesc: "",
  projectLevels: ["NORMAL", "MID", "ADVANCED", "REAL-TIME"],
  whyChooseUs: [] as BenefitItem[],
  targetAudience: [] as AudienceItem[],
  stats: { rating: "0/5", strikeRate: "0%", partners: "0+" },
  programBenefits: [] as BenefitItem[],
  journeySteps: [] as JourneyStep[],
  faqs: [] as FAQItem[],
};

export default function AddCoursePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(sampleCourse);
  const [expandedSection, setExpandedSection] = useState<string | null>("hero");
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [editingBenefit, setEditingBenefit] = useState<{ item: BenefitItem; section: "why" | "program" } | null>(null);
  const [editingAudience, setEditingAudience] = useState<AudienceItem | null>(null);
  const [editingStep, setEditingStep] = useState<JourneyStep | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number } | null>(null);

  const toggle = (s: string) => setExpandedSection(expandedSection === s ? null : s);

  const handleSave = () => {
    toast.success("Course added successfully!");
    navigate("/courses");
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCourse({ ...course, thumbnail: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    if (type === "skill") setCourse({ ...course, skills: course.skills.filter(s => s.id !== id) });
    if (type === "module") setCourse({ ...course, modules: course.modules.filter(m => m.id !== id).map((m, i) => ({ ...m, number: i + 1 })) });
    if (type === "project") setCourse({ ...course, projects: course.projects.filter(p => p.id !== id) });
    if (type === "why") setCourse({ ...course, whyChooseUs: course.whyChooseUs.filter(w => w.id !== id) });
    if (type === "audience") setCourse({ ...course, targetAudience: course.targetAudience.filter(a => a.id !== id) });
    if (type === "program") setCourse({ ...course, programBenefits: course.programBenefits.filter(b => b.id !== id) });
    if (type === "step") setCourse({ ...course, journeySteps: course.journeySteps.filter(s => s.id !== id).map((s, i) => ({ ...s, step: i + 1 })) });
    if (type === "faq") setCourse({ ...course, faqs: course.faqs.filter(f => f.id !== id) });
    toast.success("Item deleted");
    setDeleteTarget(null);
  };

  const SectionHeader = ({ id: sId, title, icon: Icon, count }: { id: string; title: string; icon: React.ElementType; count?: number }) => (
    <button onClick={() => toggle(sId)} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl gradient-soft flex items-center justify-center text-primary"><Icon className="h-4 w-4" /></div>
        <div className="text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {count !== undefined && <span className="text-[10px] text-muted-foreground">{count} items</span>}
        </div>
      </div>
      {expandedSection === sId ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
    </button>
  );

  const IconSelector = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="flex flex-wrap gap-1.5">
      {skillIconNames.map(name => {
        const Ic = skillIcons[name];
        return (
          <button key={name} type="button" onClick={() => onChange(name)}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${value === name ? "gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            <Ic className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );

  const inputClass = "h-9 w-full rounded-lg border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20";
  const textareaClass = "w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20";

  return (
    <div className="space-y-4 max-w-[1200px] mx-auto pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <button onClick={() => navigate("/courses")} className="hover:text-foreground transition-colors flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Dashboard</button>
            <ChevronRight className="h-3 w-3" /><span>Courses</span><ChevronRight className="h-3 w-3" /><span className="text-foreground font-medium">Add Course</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Course Builder</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Build out a new course</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={course.status === "Published" ? "bg-success/10 text-success border-0" : "bg-warning/10 text-warning border-0"}>{course.status}</Badge>
          <button className="h-9 px-3 rounded-lg border border-input text-sm text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1.5 transition-colors"><Eye className="h-3.5 w-3.5" /> Preview</button>
          <button onClick={handleSave} className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity"><Save className="h-4 w-4" /> Save Course</button>
        </div>
      </motion.div>

      {/* SECTION 1 & 2: Course Hero + Media */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <SectionHeader id="hero" title="Course Hero Content" icon={BookOpen} />
        {expandedSection === "hero" && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              {/* Left: Fields */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Course Title</label>
                    <input value={course.title} onChange={e => setCourse({ ...course, title: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Subtitle</label>
                    <input value={course.subtitle} onChange={e => setCourse({ ...course, subtitle: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                  <textarea value={course.description} onChange={e => setCourse({ ...course, description: e.target.value })} rows={3} className={textareaClass} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Duration</label>
                    <input value={course.duration} onChange={e => setCourse({ ...course, duration: e.target.value })} className={inputClass} placeholder="3 Months" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Skill Level</label>
                    <select value={course.skillLevel} onChange={e => setCourse({ ...course, skillLevel: e.target.value })} className={inputClass}>
                      {["All Levels", "Beginner", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Mode</label>
                    <select value={course.mode} onChange={e => setCourse({ ...course, mode: e.target.value })} className={inputClass}>
                      {["Hybrid / Live", "Online", "Offline", "Live Only"].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Right: Media Panel */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Thumbnail</label>
                  {course.thumbnail ? (
                    <div className="relative rounded-xl overflow-hidden border border-border group">
                      <img src={course.thumbnail} alt="Thumbnail" className="w-full h-36 object-cover" />
                      <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-12 w-12 rounded-full bg-card/90 backdrop-blur flex items-center justify-center"><Play className="h-5 w-5 text-foreground ml-0.5" /></div>
                      </div>
                      <button onClick={() => setCourse({ ...course, thumbnail: "" })} className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-lg bg-card/80 backdrop-blur text-foreground hover:bg-card"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/30 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" /><span className="text-xs text-muted-foreground">Upload thumbnail</span>
                      <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Video Link</label>
                  <input value={course.videoLink} onChange={e => setCourse({ ...course, videoLink: e.target.value })} className={inputClass} placeholder="YouTube, Vimeo, or any video URL" />
                  <p className="text-[10px] text-muted-foreground mt-1">Supports YouTube, Vimeo, Google Drive</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border">
                  <div><p className="text-sm font-medium text-foreground">Published</p><p className="text-[10px] text-muted-foreground">Make course live</p></div>
                  <Switch checked={course.status === "Published"} onCheckedChange={v => setCourse({ ...course, status: v ? "Published" : "Draft" })} />
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* SECTION 3: Key Skills */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <SectionHeader id="skills" title="Key Skills / Learning Icons" icon={Zap} count={course.skills.length} />
        {expandedSection === "skills" && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="flex flex-wrap gap-3 mt-4">
              {course.skills.map(skill => {
                const Ic = skillIcons[skill.icon] || Shield;
                return (
                  <div key={skill.id} className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/30 hover:border-primary/20 transition-all">
                    <div className="h-8 w-8 rounded-lg gradient-soft flex items-center justify-center text-primary"><Ic className="h-4 w-4" /></div>
                    <span className="text-sm font-medium text-foreground">{skill.title}</span>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingSkill({ ...skill })} className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"><Edit className="h-3 w-3" /></button>
                      <button onClick={() => setDeleteTarget({ type: "skill", id: skill.id })} className="h-6 w-6 rounded flex items-center justify-center text-destructive"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                );
              })}
              <button onClick={() => setEditingSkill({ id: Date.now(), title: "", icon: "Shield" })} className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                <Plus className="h-4 w-4" /> Add Skill
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* SECTION 4: Syllabus Highlights (Modules) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <SectionHeader id="modules" title="Syllabus Highlights (Course Path)" icon={BookOpen} count={course.modules.length} />
        {expandedSection === "modules" && (
          <div className="p-4 pt-0 border-t border-border">
            <p className="text-xs text-muted-foreground mt-3 mb-4">Modules represent learning stages only. No class or video management.</p>
            <div className="space-y-3">
              {course.modules.map(mod => (
                <div key={mod.id} className="group flex gap-4 p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/20 hover:shadow-card-hover transition-all">
                  <div className="flex items-start gap-3 shrink-0">
                    <GripVertical className="h-4 w-4 text-muted-foreground mt-1 cursor-grab" />
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">{mod.number}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{mod.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{mod.description}</p>
                      </div>
                      {mod.thumbnail && <img src={mod.thumbnail} alt="" className="h-12 w-20 rounded-lg object-cover shrink-0" />}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mod.topics.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">• {t}</span>
                      ))}
                      {mod.topics.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">+{mod.topics.length - 3} more</span>}
                      {mod.subModules && mod.subModules.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{mod.subModules.length} sub-module{mod.subModules.length > 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingModule({ ...mod, topics: [...mod.topics], subModules: [...(mod.subModules || [])] })} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteTarget({ type: "module", id: mod.id })} className="h-7 w-7 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/5"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setEditingModule({ id: Date.now(), number: course.modules.length + 1, title: "", description: "", thumbnail: "", topics: [""], subModules: [] })}
              className="w-full mt-3 h-10 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
              <Plus className="h-4 w-4" /> Add Module
            </button>
          </div>
        )}
      </motion.div>

      {/* SECTION 5: Projects */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <SectionHeader id="projects" title="Project / Practical Section" icon={Briefcase} count={course.projects.length} />
        {expandedSection === "projects" && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Section Title</label>
                <input value={course.projectSectionTitle} onChange={e => setCourse({ ...course, projectSectionTitle: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                <input value={course.projectSectionDesc} onChange={e => setCourse({ ...course, projectSectionDesc: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {course.projects.map(proj => (
                <div key={proj.id} className="group p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/20 hover:shadow-card-hover transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg gradient-soft flex items-center justify-center text-primary"><Globe className="h-4 w-4" /></div>
                    <div className="flex gap-1">
                      {proj.tags.map(t => <Badge key={t} variant="outline" className="text-[9px] px-1.5 py-0 border-primary/30 text-primary">{t}</Badge>)}
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{proj.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{proj.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-primary font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {proj.grade}</span>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingProject({ ...proj, tags: [...proj.tags] })} className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"><Edit className="h-3 w-3" /></button>
                      <button onClick={() => setDeleteTarget({ type: "project", id: proj.id })} className="h-6 w-6 rounded flex items-center justify-center text-destructive"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setEditingProject({ id: Date.now(), title: "", description: "", tags: [""], grade: "PROFESSIONAL GRADE" })}
              className="w-full mt-3 h-10 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
              <Plus className="h-4 w-4" /> Add Project
            </button>
          </div>
        )}
      </motion.div>

      {/* SECTION 6: Why Choose Us */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <SectionHeader id="why" title="Why Choose Us" icon={Award} count={course.whyChooseUs.length} />
        {expandedSection === "why" && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="space-y-2 mt-4">
              {course.whyChooseUs.map(item => {
                const Ic = skillIcons[item.icon] || Award;
                return (
                  <div key={item.id} className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:border-primary/20 transition-all">
                    <div className="h-8 w-8 rounded-lg gradient-soft flex items-center justify-center text-primary shrink-0"><Ic className="h-4 w-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => setEditingBenefit({ item: { ...item }, section: "why" })} className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"><Edit className="h-3 w-3" /></button>
                      <button onClick={() => setDeleteTarget({ type: "why", id: item.id })} className="h-6 w-6 rounded flex items-center justify-center text-destructive"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setEditingBenefit({ item: { id: Date.now(), title: "", description: "", icon: "Award" }, section: "why" })}
              className="w-full mt-3 h-10 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
              <Plus className="h-4 w-4" /> Add Benefit
            </button>
          </div>
        )}
      </motion.div>

      {/* SECTION 7: Target Audience */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <SectionHeader id="audience" title="Course Target Audience" icon={Users} count={course.targetAudience.length} />
        {expandedSection === "audience" && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {course.targetAudience.map(a => {
                const Ic = skillIcons[a.icon] || Users;
                return (
                  <div key={a.id} className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:border-primary/20 transition-all">
                    <div className="h-8 w-8 rounded-lg gradient-soft flex items-center justify-center text-primary shrink-0"><Ic className="h-4 w-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => setEditingAudience({ ...a })} className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"><Edit className="h-3 w-3" /></button>
                      <button onClick={() => setDeleteTarget({ type: "audience", id: a.id })} className="h-6 w-6 rounded flex items-center justify-center text-destructive"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setEditingAudience({ id: Date.now(), title: "", description: "", icon: "Users" })}
              className="w-full mt-3 h-10 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
              <Plus className="h-4 w-4" /> Add Audience
            </button>
          </div>
        )}
      </motion.div>

      {/* SECTION 8: Course Statistics */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <SectionHeader id="stats" title="Course Statistics" icon={Star} />
        {expandedSection === "stats" && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">⭐ Rating</label>
                <input value={course.stats.rating} onChange={e => setCourse({ ...course, stats: { ...course.stats, rating: e.target.value } })} className={inputClass} placeholder="4.8/5" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">✅ Strike Rate</label>
                <input value={course.stats.strikeRate} onChange={e => setCourse({ ...course, stats: { ...course.stats, strikeRate: e.target.value } })} className={inputClass} placeholder="100%" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">🤝 Partner Companies</label>
                <input value={course.stats.partners} onChange={e => setCourse({ ...course, stats: { ...course.stats, partners: e.target.value } })} className={inputClass} placeholder="200+" />
              </div>
            </div>
            {/* Preview */}
            <div className="flex justify-center gap-8 mt-6 p-4 rounded-xl bg-muted/30 border border-border">
              {[
                { icon: "⭐", value: course.stats.rating, label: "Rating" },
                { icon: "✅", value: course.stats.strikeRate, label: "Strike Rate" },
                { icon: "🤝", value: course.stats.partners, label: "Partners" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <span className="text-2xl">{s.icon}</span>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* SECTION 9: Program Benefits */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <SectionHeader id="programBenefits" title="Program Benefits" icon={CheckCircle} count={course.programBenefits.length} />
        {expandedSection === "programBenefits" && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {course.programBenefits.map(b => {
                const Ic = skillIcons[b.icon] || CheckCircle;
                return (
                  <div key={b.id} className="group p-3 rounded-xl border border-border bg-muted/20 hover:border-primary/20 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-8 w-8 rounded-lg gradient-soft flex items-center justify-center text-primary"><Ic className="h-4 w-4" /></div>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingBenefit({ item: { ...b }, section: "program" })} className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"><Edit className="h-3 w-3" /></button>
                        <button onClick={() => setDeleteTarget({ type: "program", id: b.id })} className="h-6 w-6 rounded flex items-center justify-center text-destructive"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">{b.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{b.description}</p>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setEditingBenefit({ item: { id: Date.now(), title: "", description: "", icon: "CheckCircle" }, section: "program" })}
              className="w-full mt-3 h-10 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
              <Plus className="h-4 w-4" /> Add Benefit
            </button>
          </div>
        )}
      </motion.div>

      {/* SECTION 10: Learning Journey */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <SectionHeader id="journey" title="Learning Journey Steps" icon={TrendingUp} count={course.journeySteps.length} />
        {expandedSection === "journey" && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="flex flex-wrap gap-3 mt-4">
              {course.journeySteps.map(step => (
                <div key={step.id} className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:border-primary/20 transition-all min-w-[180px]">
                  <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">{step.step}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    <p className="text-[10px] text-muted-foreground">{step.description}</p>
                  </div>
                  <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => setEditingStep({ ...step })} className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"><Edit className="h-3 w-3" /></button>
                    <button onClick={() => setDeleteTarget({ type: "step", id: step.id })} className="h-5 w-5 rounded flex items-center justify-center text-destructive"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setEditingStep({ id: Date.now(), step: course.journeySteps.length + 1, title: "", description: "" })}
              className="w-full mt-3 h-10 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
              <Plus className="h-4 w-4" /> Add Step
            </button>
          </div>
        )}
      </motion.div>

      {/* SECTION 11: FAQ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <SectionHeader id="faq" title="FAQ Management" icon={MessageSquare} count={course.faqs.length} />
        {expandedSection === "faq" && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="space-y-2 mt-4">
              {course.faqs.map(faq => (
                <div key={faq.id} className="group flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:border-primary/20 transition-all">
                  <GripVertical className="h-4 w-4 text-muted-foreground mt-1 cursor-grab shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{faq.question}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{faq.answer}</p>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => setEditingFaq({ ...faq })} className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"><Edit className="h-3 w-3" /></button>
                    <button onClick={() => setDeleteTarget({ type: "faq", id: faq.id })} className="h-6 w-6 rounded flex items-center justify-center text-destructive"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setEditingFaq({ id: Date.now(), question: "", answer: "" })}
              className="w-full mt-3 h-10 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
              <Plus className="h-4 w-4" /> Add FAQ
            </button>
          </div>
        )}
      </motion.div>

      {/* ===== EDIT MODALS ===== */}

      {/* Skill Modal */}
      <Dialog open={!!editingSkill} onOpenChange={() => setEditingSkill(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{editingSkill?.title ? "Edit Skill" : "Add Skill"}</DialogTitle></DialogHeader>
          {editingSkill && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Skill Title</label>
                <input value={editingSkill.title} onChange={e => setEditingSkill({ ...editingSkill, title: e.target.value })} className={inputClass} placeholder="e.g. Network Security" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Icon</label>
                <IconSelector value={editingSkill.icon} onChange={icon => setEditingSkill({ ...editingSkill, icon })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditingSkill(null)} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={() => {
                  if (!editingSkill.title) return toast.error("Title is required");
                  const exists = course.skills.find(s => s.id === editingSkill.id);
                  if (exists) setCourse({ ...course, skills: course.skills.map(s => s.id === editingSkill.id ? editingSkill : s) });
                  else setCourse({ ...course, skills: [...course.skills, editingSkill] });
                  toast.success(exists ? "Skill updated" : "Skill added");
                  setEditingSkill(null);
                }} className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Module Modal */}
      <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editingModule?.title ? "Edit Module" : "Add Module"}</DialogTitle></DialogHeader>
          {editingModule && (
            <div className="space-y-4">
              {/* ── Core module fields ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Module Title</label>
                  <input value={editingModule.title} onChange={e => setEditingModule({ ...editingModule, title: e.target.value })} className={inputClass} placeholder="e.g. Salesforce Administration" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Thumbnail URL</label>
                  <input value={editingModule.thumbnail} onChange={e => setEditingModule({ ...editingModule, thumbnail: e.target.value })} className={inputClass} placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                <textarea value={editingModule.description} onChange={e => setEditingModule({ ...editingModule, description: e.target.value })} rows={2} className={textareaClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Overview Topics</label>
                <div className="space-y-1.5">
                  {editingModule.topics.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={t} onChange={e => { const topics = [...editingModule.topics]; topics[i] = e.target.value; setEditingModule({ ...editingModule, topics }); }} className={inputClass} placeholder={`Topic ${i + 1}`} />
                      <button onClick={() => setEditingModule({ ...editingModule, topics: editingModule.topics.filter((_, j) => j !== i) })} className="text-destructive shrink-0"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => setEditingModule({ ...editingModule, topics: [...editingModule.topics, ""] })} className="text-xs text-primary hover:underline">+ Add Topic</button>
                </div>
              </div>

              {/* ── Sub-modules ── */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Sub-modules</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Named topic groups that appear inside this module (like in the user-facing syllabus view)</p>
                  </div>
                  <button
                    onClick={() => setEditingModule({ ...editingModule, subModules: [...(editingModule.subModules || []), { id: Date.now(), name: "", topics: [""] }] })}
                    className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Sub-module
                  </button>
                </div>

                {(!editingModule.subModules || editingModule.subModules.length === 0) ? (
                  <div className="flex flex-col items-center justify-center py-6 rounded-xl border-2 border-dashed border-border text-muted-foreground">
                    <BookOpen className="h-6 w-6 mb-1.5" />
                    <p className="text-xs">No sub-modules yet. Click "Add Sub-module" to create one.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editingModule.subModules.map((sm, smIdx) => (
                      <div key={sm.id} className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                        {/* Sub-module header */}
                        <div className="flex items-center gap-3 px-3 py-2.5 bg-muted/40 border-b border-border">
                          <div className="h-6 w-6 rounded-md gradient-soft flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                            {smIdx + 1}
                          </div>
                          <input
                            value={sm.name}
                            onChange={e => {
                              const subModules = editingModule.subModules.map(s => s.id === sm.id ? { ...s, name: e.target.value } : s);
                              setEditingModule({ ...editingModule, subModules });
                            }}
                            className="flex-1 h-7 rounded-md border border-input bg-secondary px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring/30 font-semibold uppercase tracking-wide"
                            placeholder="Sub-module name, e.g. AGILE, DEVOPS & PROJECT LIFECYCLE"
                          />
                          <button
                            onClick={() => setEditingModule({ ...editingModule, subModules: editingModule.subModules.filter(s => s.id !== sm.id) })}
                            className="h-6 w-6 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-md shrink-0"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {/* Sub-module topics */}
                        <div className="p-3 space-y-1.5">
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-2"><CheckCircle className="h-3 w-3" /> Topics in this sub-module</p>
                          {sm.topics.map((topic, tIdx) => (
                            <div key={tIdx} className="flex gap-2">
                              <div className="flex items-center gap-2 flex-1 h-8 rounded-lg border border-input bg-secondary px-3 text-xs text-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                                <input
                                  value={topic}
                                  onChange={e => {
                                    const topics = [...sm.topics]; topics[tIdx] = e.target.value;
                                    const subModules = editingModule.subModules.map(s => s.id === sm.id ? { ...s, topics } : s);
                                    setEditingModule({ ...editingModule, subModules });
                                  }}
                                  className="flex-1 bg-transparent outline-none"
                                  placeholder={`Topic ${tIdx + 1}`}
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const topics = sm.topics.filter((_, j) => j !== tIdx);
                                  const subModules = editingModule.subModules.map(s => s.id === sm.id ? { ...s, topics } : s);
                                  setEditingModule({ ...editingModule, subModules });
                                }}
                                className="text-destructive shrink-0 hover:bg-destructive/10 rounded-md h-8 w-8 flex items-center justify-center"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const subModules = editingModule.subModules.map(s => s.id === sm.id ? { ...s, topics: [...s.topics, ""] } : s);
                              setEditingModule({ ...editingModule, subModules });
                            }}
                            className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            <Plus className="h-3 w-3" /> Add Topic
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditingModule(null)} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={() => {
                  if (!editingModule.title) return toast.error("Title is required");
                  const clean = {
                    ...editingModule,
                    topics: editingModule.topics.filter(t => t.trim()),
                    subModules: (editingModule.subModules || []).map(sm => ({ ...sm, topics: sm.topics.filter(t => t.trim()) })).filter(sm => sm.name.trim()),
                  };
                  const exists = course.modules.find(m => m.id === editingModule.id);
                  if (exists) setCourse({ ...course, modules: course.modules.map(m => m.id === editingModule.id ? clean : m) });
                  else setCourse({ ...course, modules: [...course.modules, clean] });
                  toast.success(exists ? "Module updated" : "Module added");
                  setEditingModule(null);
                }} className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Project Modal */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{editingProject?.title ? "Edit Project" : "Add Project"}</DialogTitle></DialogHeader>
          {editingProject && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Project Title</label>
                <input value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                <textarea value={editingProject.description} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} rows={2} className={textareaClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Grade</label>
                <select value={editingProject.grade} onChange={e => setEditingProject({ ...editingProject, grade: e.target.value })} className={inputClass}>
                  {["NORMAL", "MID", "ADVANCED", "REAL-TIME", "PROFESSIONAL GRADE"].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Tags</label>
                <div className="space-y-1.5">
                  {editingProject.tags.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={t} onChange={e => { const tags = [...editingProject.tags]; tags[i] = e.target.value; setEditingProject({ ...editingProject, tags }); }} className={inputClass} />
                      <button onClick={() => setEditingProject({ ...editingProject, tags: editingProject.tags.filter((_, j) => j !== i) })} className="text-destructive shrink-0"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => setEditingProject({ ...editingProject, tags: [...editingProject.tags, ""] })} className="text-xs text-primary hover:underline">+ Add Tag</button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditingProject(null)} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={() => {
                  if (!editingProject.title) return toast.error("Title is required");
                  const clean = { ...editingProject, tags: editingProject.tags.filter(t => t.trim()) };
                  const exists = course.projects.find(p => p.id === editingProject.id);
                  if (exists) setCourse({ ...course, projects: course.projects.map(p => p.id === editingProject.id ? clean : p) });
                  else setCourse({ ...course, projects: [...course.projects, clean] });
                  toast.success(exists ? "Project updated" : "Project added");
                  setEditingProject(null);
                }} className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Benefit Modal (Why Choose Us + Program Benefits) */}
      <Dialog open={!!editingBenefit} onOpenChange={() => setEditingBenefit(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{editingBenefit?.item.title ? "Edit Benefit" : "Add Benefit"}</DialogTitle></DialogHeader>
          {editingBenefit && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Title</label>
                <input value={editingBenefit.item.title} onChange={e => setEditingBenefit({ ...editingBenefit, item: { ...editingBenefit.item, title: e.target.value } })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                <textarea value={editingBenefit.item.description} onChange={e => setEditingBenefit({ ...editingBenefit, item: { ...editingBenefit.item, description: e.target.value } })} rows={2} className={textareaClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Icon</label>
                <IconSelector value={editingBenefit.item.icon} onChange={icon => setEditingBenefit({ ...editingBenefit, item: { ...editingBenefit.item, icon } })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditingBenefit(null)} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={() => {
                  if (!editingBenefit.item.title) return toast.error("Title is required");
                  const key = editingBenefit.section === "why" ? "whyChooseUs" : "programBenefits";
                  const list = course[key];
                  const exists = list.find(b => b.id === editingBenefit.item.id);
                  if (exists) setCourse({ ...course, [key]: list.map(b => b.id === editingBenefit.item.id ? editingBenefit.item : b) });
                  else setCourse({ ...course, [key]: [...list, editingBenefit.item] });
                  toast.success(exists ? "Benefit updated" : "Benefit added");
                  setEditingBenefit(null);
                }} className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Audience Modal */}
      <Dialog open={!!editingAudience} onOpenChange={() => setEditingAudience(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{editingAudience?.title ? "Edit Audience" : "Add Audience"}</DialogTitle></DialogHeader>
          {editingAudience && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Audience Title</label>
                <input value={editingAudience.title} onChange={e => setEditingAudience({ ...editingAudience, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                <textarea value={editingAudience.description} onChange={e => setEditingAudience({ ...editingAudience, description: e.target.value })} rows={2} className={textareaClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Icon</label>
                <IconSelector value={editingAudience.icon} onChange={icon => setEditingAudience({ ...editingAudience, icon })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditingAudience(null)} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={() => {
                  if (!editingAudience.title) return toast.error("Title is required");
                  const exists = course.targetAudience.find(a => a.id === editingAudience.id);
                  if (exists) setCourse({ ...course, targetAudience: course.targetAudience.map(a => a.id === editingAudience.id ? editingAudience : a) });
                  else setCourse({ ...course, targetAudience: [...course.targetAudience, editingAudience] });
                  toast.success(exists ? "Audience updated" : "Audience added");
                  setEditingAudience(null);
                }} className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Journey Step Modal */}
      <Dialog open={!!editingStep} onOpenChange={() => setEditingStep(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{editingStep?.title ? "Edit Step" : "Add Step"}</DialogTitle></DialogHeader>
          {editingStep && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Step Title</label>
                <input value={editingStep.title} onChange={e => setEditingStep({ ...editingStep, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                <input value={editingStep.description} onChange={e => setEditingStep({ ...editingStep, description: e.target.value })} className={inputClass} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditingStep(null)} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={() => {
                  if (!editingStep.title) return toast.error("Title is required");
                  const exists = course.journeySteps.find(s => s.id === editingStep.id);
                  if (exists) setCourse({ ...course, journeySteps: course.journeySteps.map(s => s.id === editingStep.id ? editingStep : s) });
                  else setCourse({ ...course, journeySteps: [...course.journeySteps, editingStep] });
                  toast.success(exists ? "Step updated" : "Step added");
                  setEditingStep(null);
                }} className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* FAQ Modal */}
      <Dialog open={!!editingFaq} onOpenChange={() => setEditingFaq(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{editingFaq?.question ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
          {editingFaq && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Question</label>
                <input value={editingFaq.question} onChange={e => setEditingFaq({ ...editingFaq, question: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Answer</label>
                <textarea value={editingFaq.answer} onChange={e => setEditingFaq({ ...editingFaq, answer: e.target.value })} rows={3} className={textareaClass} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditingFaq(null)} className="h-9 px-4 rounded-lg border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={() => {
                  if (!editingFaq.question) return toast.error("Question is required");
                  const exists = course.faqs.find(f => f.id === editingFaq.id);
                  if (exists) setCourse({ ...course, faqs: course.faqs.map(f => f.id === editingFaq.id ? editingFaq : f) });
                  else setCourse({ ...course, faqs: [...course.faqs, editingFaq] });
                  toast.success(exists ? "FAQ updated" : "FAQ added");
                  setEditingFaq(null);
                }} className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">Save</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDeleteModal open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
}
