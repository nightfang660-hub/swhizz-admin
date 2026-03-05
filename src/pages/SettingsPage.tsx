import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Globe, Mail, Phone, Shield, Save, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [website, setWebsite] = useState("https://swhizztech.com");
  const [email, setEmail] = useState("admin@swhizztech.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [roles, setRoles] = useState(["Super Admin", "Content Manager", "Analytics Viewer"]);
  const [newRole, setNewRole] = useState("");
  const [deleteRole, setDeleteRole] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const handleImageUpload = (setter: (v: string | null) => void, label: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setter(reader.result as string); toast.success(`${label} uploaded`); };
      reader.readAsDataURL(file);
    }
  };

  const addRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole("");
      toast.success("Role added");
    }
  };

  const handleDeleteRole = () => {
    if (deleteRole) {
      setRoles(roles.filter((r) => r !== deleteRole));
      toast.success("Role deleted");
      setDeleteRole(null);
    }
  };

  const handleSave = () => toast.success("Settings saved successfully");

  if (loading) return <div className="space-y-6 max-w-3xl mx-auto"><div className="space-y-1"><div className="h-7 w-28 bg-muted rounded animate-pulse" /><div className="h-4 w-48 bg-muted rounded animate-pulse" /></div>{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />)}</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your platform settings</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
        {/* Branding */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6">
          <h3 className="text-base font-semibold font-heading text-foreground mb-4">Branding</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ label: "Logo", preview: logoPreview, setter: setLogoPreview, desc: "Upload your logo" },
              { label: "Favicon", preview: faviconPreview, setter: setFaviconPreview, desc: "Upload favicon" }].map(({ label, preview, setter, desc }) => (
              <div key={label}>
                {preview ? (
                  <div className="relative rounded-xl border border-border p-4 flex items-center gap-3">
                    <img src={preview} alt={label} className="h-12 w-12 object-contain rounded" />
                    <div className="flex-1"><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs text-muted-foreground">Uploaded</p></div>
                    <button onClick={() => setter(null)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <label className="flex items-center gap-4 rounded-xl border border-border border-dashed p-4 cursor-pointer hover:border-primary/30 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
                    <input type="file" accept="image/*" onChange={handleImageUpload(setter, label)} className="hidden" />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6">
          <h3 className="text-base font-semibold font-heading text-foreground mb-4">Contact Information</h3>
          <div className="space-y-3">
            {[{ icon: Globe, label: "Website URL", value: website, setter: setWebsite },
              { icon: Mail, label: "Contact Email", value: email, setter: setEmail },
              { icon: Phone, label: "Phone", value: phone, setter: setPhone }].map(({ icon: Icon, label, value, setter }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-soft shrink-0"><Icon className="h-4 w-4 text-primary" /></div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">{label}</label>
                  <input type="text" value={value} onChange={(e) => setter(e.target.value)} className="w-full text-sm text-foreground bg-transparent border-b border-border pb-1 focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold font-heading text-foreground">Admin Roles</h3>
          </div>
          <div className="space-y-2 mb-3">
            {roles.map((role) => (
              <div key={role} className="flex items-center justify-between rounded-xl border border-border p-3">
                <span className="text-sm text-foreground">{role}</span>
                <button onClick={() => setDeleteRole(role)} className="text-xs text-destructive hover:underline flex items-center gap-1"><Trash2 className="h-3 w-3" /> Remove</button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input value={newRole} onChange={(e) => setNewRole(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addRole()} placeholder="New role name" className="flex-1 h-9 rounded-lg border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
            <button onClick={addRole} className="h-9 px-3 rounded-lg gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"><Plus className="h-4 w-4" /></button>
          </div>
        </div>

        <button onClick={handleSave} className="w-full h-10 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Save className="h-4 w-4" /> Save Settings
        </button>
      </motion.div>

      <ConfirmDeleteModal open={deleteRole !== null} onOpenChange={(open) => !open && setDeleteRole(null)} onConfirm={handleDeleteRole} title="Delete Role?" description={`This will remove the "${deleteRole}" role from the system.`} />
    </div>
  );
}
