import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPageCMS() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    const handleSave = () => {
        toast.success("Services Page updated successfully!");
    };

    if (loading) return <div className="space-y-6 max-w-[1400px] mx-auto p-6 animate-pulse"><div className="h-8 w-48 bg-muted rounded" /></div>;

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto p-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-foreground">Services Page CMS</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Edit independent service blocks, features, and offerings</p>
                </div>
                <button onClick={handleSave} className="flex items-center gap-1.5 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90">
                    <Save className="h-4 w-4" /> Save Page
                </button>
            </div>
            <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                Services CMS Builder Space
            </div>
        </div>
    );
}
