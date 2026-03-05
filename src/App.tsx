import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import CoursesPage from "./pages/CoursesPage";
import AddCoursePage from "./pages/AddCoursePage";
import EditCoursePage from "./pages/EditCoursePage";
import BlogsPage from "./pages/BlogsPage";
import AddBlogPage from "./pages/AddBlogPage";
import ViewBlogPage from "./pages/ViewBlogPage";
import HomePageCMS from "./pages/cms/HomePage";
import HeroSectionPage from "./pages/cms/HeroSectionPage";
import AboutPageCMS from "./pages/cms/AboutPage";
import ServicesPageCMS from "./pages/cms/ServicesPage";
import BatchesPageCMS from "./pages/cms/BatchesPage";
import PlacementPageCMS from "./pages/cms/PlacementPage";
import StudentsPage from "./pages/StudentsPage";
import LeadsPage from "./pages/LeadsPage";
import MediaPage from "./pages/MediaPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/new" element={<AddCoursePage />} />
              <Route path="/courses/:id/edit" element={<EditCoursePage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/new" element={<AddBlogPage />} />
              <Route path="/blogs/:id" element={<ViewBlogPage />} />
              <Route path="/cms" element={<HomePageCMS />} />
              <Route path="/cms/hero" element={<HeroSectionPage />} />
              <Route path="/cms/about" element={<AboutPageCMS />} />
              <Route path="/cms/services" element={<ServicesPageCMS />} />
              <Route path="/cms/batches" element={<BatchesPageCMS />} />
              <Route path="/cms/placement" element={<PlacementPageCMS />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
