import { useState, useRef, useEffect } from "react";
import { Bell, Search, ChevronRight, LogOut, Settings, User, X, Check, Clock } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/courses": "Courses",
  "/courses/new": "New Course",
  "/blogs": "Blogs",
  "/blogs/new": "New Blog",
  "/cms": "Homepage CMS",
  "/students": "Students",
  "/leads": "Leads",
  "/media": "Media Library",
  "/settings": "Settings",
};

const searchableItems = [
  { label: "Dashboard", path: "/", type: "Page" },
  { label: "Courses", path: "/courses", type: "Page" },
  { label: "Add New Course", path: "/courses/new", type: "Action" },
  { label: "Blogs", path: "/blogs", type: "Page" },
  { label: "Add New Blog", path: "/blogs/new", type: "Action" },
  { label: "Homepage CMS", path: "/cms", type: "Page" },
  { label: "Students", path: "/students", type: "Page" },
  { label: "Leads", path: "/leads", type: "Page" },
  { label: "Media Library", path: "/media", type: "Page" },
  { label: "Settings", path: "/settings", type: "Page" },
];

const notifications = [
  { id: 1, title: "New enrollment", desc: "Sarah Williams enrolled in React Mastery Pro", time: "2 min ago", read: false },
  { id: 2, title: "New lead captured", desc: "John Doe submitted a contact form", time: "15 min ago", read: false },
  { id: 3, title: "Course published", desc: "Python AI/ML Bootcamp is now live", time: "1 hour ago", read: false },
  { id: 4, title: "Blog comment", desc: "New comment on 'Future of AI in Education'", time: "3 hours ago", read: true },
  { id: 5, title: "Payment received", desc: "₹99 payment for UI/UX Design course", time: "5 hours ago", read: true },
];

export function TopHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = routeNames[location.pathname] || "Dashboard";

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const filteredItems = searchableItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id: number) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <header className="sticky top-0 z-30 glass">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Admin</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">{pageName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div ref={searchRef} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <input
              type="text"
              placeholder="Search anything…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              className="h-9 w-64 rounded-lg border border-input bg-secondary pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {searchOpen && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                {filteredItems.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">No results found</div>
                ) : (
                  filteredItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setSearchOpen(false); setSearchQuery(""); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.type}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-card text-muted-foreground hover:text-foreground hover:shadow-card-hover transition-all duration-200"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm font-semibold font-heading text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Check className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifs.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0 ${!n.read ? "bg-accent/30" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                        <div className={!n.read ? "" : "ml-4"}>
                          <p className="text-sm font-medium text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {n.time}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2.5 rounded-lg border border-input bg-card px-2.5 py-1.5 cursor-pointer hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary">
                <span className="text-xs font-semibold text-primary-foreground">A</span>
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-foreground leading-none">Admin User</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Super Admin</p>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@swhizztech.com</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { navigate("/settings"); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" /> Settings
                  </button>
                  <button
                    onClick={() => { navigate("/settings"); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <User className="h-4 w-4 text-muted-foreground" /> Profile
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={() => { toast.info("Logout functionality requires authentication setup"); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
