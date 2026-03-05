import { useState } from "react";
import {
  LayoutDashboard, BookOpen, FileText, Home, Users, MessageSquare,
  Image, Settings, LogOut, Globe, ChevronDown, ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Blogs", url: "/blogs", icon: FileText },
  {
    title: "Website",
    icon: Globe,
    subItems: [
      { title: "Home Page", url: "/cms" },
      { title: "About Page", url: "/cms/about" },
      { title: "Services Page", url: "/cms/services" },
      { title: "Batches Page", url: "/cms/batches" },
      { title: "Placement Page", url: "/cms/placement" }
    ]
  },
  { title: "Students", url: "/students", icon: Users },
  { title: "Leads", url: "/leads", icon: MessageSquare },
  { title: "Media Library", url: "/media", icon: Image },
  { title: "Settings", url: "/settings", icon: Settings },
];


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NavItem({ item, collapsed, location }: { item: any, collapsed: boolean, location: any }) {
  const hasSub = !!item.subItems;
  const isActive = item.url ? (item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url)) : false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSubActive = hasSub && item.subItems?.some((sub: any) => location.pathname === sub.url || location.pathname.startsWith(sub.url));
  const [isOpen, setIsOpen] = useState(false);

  if (hasSub) {
    return (
      <div className="group/website relative" onMouseEnter={() => !collapsed && setIsOpen(true)} onMouseLeave={() => !collapsed && setIsOpen(false)}>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => collapsed && setIsOpen(!isOpen)}
            className={`h-10 w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200 ${isSubActive ? "gradient-primary text-primary-foreground shadow-glow font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </div>
            {!collapsed && (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
          </SidebarMenuButton>

          {isOpen && !collapsed && (
            <SidebarMenuSub className="mt-1 pb-1">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {item.subItems?.map((sub: any) => {
                const subActive = location.pathname === sub.url;
                return (
                  <SidebarMenuSubItem key={sub.title}>
                    <SidebarMenuSubButton asChild isActive={subActive} className={`h-8 hover:bg-sidebar-accent/50 ${subActive ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                      <NavLink to={sub.url}>
                        <span>{sub.title}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      </div>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className="h-10">
        <NavLink
          to={item.url!}
          end={item.url === "/"}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${isActive
            ? "gradient-primary text-primary-foreground shadow-glow font-medium"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          activeClassName=""
        >
          <item.icon className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {

  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-primary">
          <span className="text-sm font-bold text-primary-foreground">ST</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold font-heading text-foreground">Swhizz Tech</span>
            <span className="text-[11px] text-muted-foreground">Admin Portal</span>
          </div>
        )}
      </div>

      <SidebarContent className="scrollbar-thin px-2 pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <NavItem key={item.title} item={item} collapsed={collapsed} location={location} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-2 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-10 text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="text-sm">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
