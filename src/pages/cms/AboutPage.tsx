import { useState, useEffect } from "react";
import { CopyPlus, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Provide a basic shell similar to CMSPage that works for About Section.
export default function AboutPageCMS() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    const handleSave = () => {
        toast.success("About Page updated successfully!");
    };

    if (loading) {
        return <div className="space-y-6 max-w-[1400px] mx-auto p-6 animate-pulse"><div className="h-8 w-48 bg-muted rounded" /></div>;
    }

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto p-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-foreground">About Page CMS</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Manage the internal sections forming the About Us page</p>
                </div>
                <button onClick={handleSave} className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">
                    <Save className="h-4 w-4" /> Save Page
                </button>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                Use the structure and form builder here to control the individual sections within the About page, similar to the Home Page layout.
            </div>
        </div>
    );
}
