import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Eye, User, Clock, Share2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const sampleBlogs: Record<string, {
  title: string; author: string; date: string; views: number; status: string;
  readTime: string; excerpt: string; featuredImage: string; content: string;
  tags: string[];
}> = {
  "1": {
    title: "The Future of AI in Education",
    author: "Admin",
    date: "Feb 24, 2026",
    views: 2480,
    status: "Published",
    readTime: "8 min read",
    excerpt: "Explore how artificial intelligence is reshaping the education landscape, from personalized learning paths to AI-powered tutoring systems.",
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    tags: ["AI", "Education", "Technology"],
    content: `## The Rise of AI in Modern Education

Artificial Intelligence is no longer a futuristic concept — it's actively transforming how we learn, teach, and interact with educational content. From adaptive learning platforms to intelligent tutoring systems, AI is making education more personalized and accessible than ever before.

### Personalized Learning Paths

One of the most significant impacts of AI in education is the ability to create **personalized learning experiences**. Traditional one-size-fits-all approaches are being replaced by adaptive systems that understand each student's strengths, weaknesses, and learning pace.

> "AI doesn't replace teachers — it empowers them to focus on what matters most: inspiring and mentoring students." — Dr. Sarah Chen, EdTech Researcher

### Key Benefits of AI in Education

- **Adaptive Assessment**: AI-powered quizzes that adjust difficulty based on student performance
- **24/7 Tutoring**: Virtual assistants that can answer questions anytime
- **Content Curation**: Intelligent recommendations for supplementary learning materials
- **Early Intervention**: Identifying at-risk students before they fall behind

### Real-World Applications

At Swhizz Tech, we've integrated AI into our course platform to provide:

1. **Smart Code Reviews** — Automated feedback on student projects
2. **Progress Analytics** — Real-time dashboards showing learning trajectories
3. **Peer Matching** — Connecting students with complementary skill sets

### The Road Ahead

As we move into 2027, expect to see even more sophisticated AI applications in education. Natural language processing will enable more natural interactions with educational content, while computer vision will open new possibilities for hands-on learning experiences.

The future of education is intelligent, adaptive, and deeply personal. At Swhizz Tech, we're committed to being at the forefront of this transformation.`
  },
  "2": {
    title: "10 React Patterns You Should Know",
    author: "Admin",
    date: "Feb 20, 2026",
    views: 1890,
    status: "Published",
    readTime: "12 min read",
    excerpt: "Master the most important React design patterns that will make your code cleaner, more maintainable, and production-ready.",
    featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    tags: ["React", "JavaScript", "Web Dev"],
    content: `## Essential React Patterns for 2026

React continues to evolve, and with it, the patterns we use to build scalable applications. Here are 10 patterns every React developer should master.

### 1. Compound Components

Compound components let you create expressive, declarative APIs for complex UI elements. Think of how \`<select>\` and \`<option>\` work together.

### 2. Render Props

While hooks have replaced many use cases, render props remain powerful for sharing behavior between components without changing their hierarchy.

### 3. Custom Hooks

Extract reusable logic into custom hooks. This is the modern replacement for HOCs and render props in most scenarios.

### 4. Context Module Pattern

Combine React Context with a module pattern to create clean, testable state management without external libraries.

### 5. State Reducer Pattern

Give consumers control over internal state changes by accepting a reducer function, popularized by Kent C. Dodds.

### 6. Controlled & Uncontrolled Components

Understanding when to use controlled vs uncontrolled components is fundamental to building robust forms.

### 7. Composition over Inheritance

React's composition model is powerful. Use children and slots instead of inheritance hierarchies.

### 8. Error Boundaries

Wrap critical sections of your app in error boundaries to prevent cascading failures.

### 9. Suspense Patterns

Use React Suspense for data fetching and code splitting to create smooth loading experiences.

### 10. Server Components

React Server Components represent the next evolution — understand when and how to use them effectively.

---

*Want to master these patterns hands-on? Check out our [React Mastery Pro](/courses) course!*`
  },
  "3": {
    title: "Getting Started with Cloud Computing",
    author: "Admin",
    date: "Feb 18, 2026",
    views: 0,
    status: "Draft",
    readTime: "6 min read",
    excerpt: "A beginner's guide to cloud computing concepts, services, and how to get started with AWS, Azure, and GCP.",
    featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    tags: ["Cloud", "AWS", "DevOps"],
    content: `## What is Cloud Computing?

Cloud computing delivers computing services — servers, storage, databases, networking, software — over the internet. Instead of owning and maintaining physical data centers, you can access technology on-demand.

### The Three Service Models

- **IaaS** (Infrastructure as a Service): Virtual machines, storage, networks
- **PaaS** (Platform as a Service): Development platforms, databases, middleware
- **SaaS** (Software as a Service): Ready-to-use applications

### Major Cloud Providers

| Provider | Strengths | Best For |
|----------|-----------|----------|
| AWS | Broadest service catalog | Enterprise & startups |
| Azure | Microsoft integration | Enterprise/.NET shops |
| GCP | Data & AI/ML | Data-heavy applications |

### Getting Started

1. Create a free tier account on AWS
2. Launch your first EC2 instance
3. Deploy a simple web application
4. Explore managed services like RDS and S3

*This article is a preview — full content coming soon!*`
  },
  "4": {
    title: "Design Systems That Scale",
    author: "Admin",
    date: "Feb 15, 2026",
    views: 1245,
    status: "Published",
    readTime: "10 min read",
    excerpt: "Learn how to build and maintain design systems that grow with your organization and product.",
    featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    tags: ["Design", "UI/UX", "Systems"],
    content: `## Building Design Systems That Last

A design system is more than a component library — it's a shared language between design and development teams.

### Core Pillars

**1. Design Tokens**
Start with tokens: colors, spacing, typography, shadows. These are the atoms of your system.

**2. Component Architecture**
Build components in layers: primitives → composites → patterns → templates.

**3. Documentation**
Every component needs usage guidelines, do's and don'ts, and live examples.

### Scaling Strategies

- **Monorepo**: Keep design tokens, components, and docs in one repository
- **Versioning**: Semantic versioning for predictable updates
- **Contribution Model**: Clear guidelines for adding new components
- **Governance**: A cross-functional team to maintain quality

### Tools We Recommend

- **Figma** for design
- **Storybook** for component development
- **Chromatic** for visual regression testing
- **Tailwind CSS** for token-driven styling

*At Swhizz Tech, our UI/UX Design course covers design system creation in depth.*`
  },
  "5": {
    title: "Python vs JavaScript in 2026",
    author: "Admin",
    date: "Feb 10, 2026",
    views: 3120,
    status: "Published",
    readTime: "7 min read",
    excerpt: "An honest comparison of Python and JavaScript in 2026 — where each language shines and which one to learn first.",
    featuredImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop",
    tags: ["Python", "JavaScript", "Career"],
    content: `## Python vs JavaScript: The 2026 Showdown

Both Python and JavaScript remain dominant forces in software development. Let's break down where each excels.

### Python Wins At

- **Data Science & AI/ML**: NumPy, Pandas, TensorFlow, PyTorch
- **Scientific Computing**: Research and academic applications
- **Automation**: Scripting and task automation
- **Backend APIs**: Django, FastAPI, Flask

### JavaScript Wins At

- **Web Development**: The only language that runs natively in browsers
- **Full-Stack**: Node.js, Deno, Bun for backend
- **Mobile**: React Native for cross-platform apps
- **Real-time**: WebSockets, streaming applications

### Which Should You Learn First?

It depends on your goals:

| Goal | Choose |
|------|--------|
| Web development | JavaScript |
| Data science / AI | Python |
| General programming | Python |
| Startup / full-stack | JavaScript |
| Career flexibility | Both! |

### The Verdict

There's no wrong choice. Both languages have massive ecosystems, strong communities, and excellent career prospects. At Swhizz Tech, we offer courses in both — start with whichever excites you more!`
  },
};

export default function ViewBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = sampleBlogs[id || ""];

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Blog post not found</p>
        <button onClick={() => navigate("/blogs")} className="mt-4 text-primary hover:underline text-sm">← Back to Blogs</button>
      </div>
    );
  }

  const renderMarkdown = (text: string) => {
    // Simple markdown-like rendering
    return text.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3 font-heading">{block.slice(3)}</h2>;
      if (block.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">{block.slice(4)}</h3>;
      if (block.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-primary pl-4 py-2 my-4 text-muted-foreground italic bg-muted/30 rounded-r-lg">{block.slice(2)}</blockquote>;
      if (block.startsWith("---")) return <hr key={i} className="my-6 border-border" />;
      if (block.startsWith("| ")) {
        const rows = block.split("\n").filter(r => !r.startsWith("|--"));
        return (
          <div key={i} className="my-4 overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead><tr className="bg-muted">{rows[0]?.split("|").filter(Boolean).map((cell, j) => <th key={j} className="px-3 py-2 text-left font-medium text-foreground">{cell.trim()}</th>)}</tr></thead>
              <tbody>{rows.slice(1).map((row, ri) => <tr key={ri} className="border-t border-border">{row.split("|").filter(Boolean).map((cell, j) => <td key={j} className="px-3 py-2 text-muted-foreground">{cell.trim()}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      }
      if (block.match(/^(\d+\.\s|[-*]\s)/m)) {
        const items = block.split("\n").filter(Boolean);
        const isOrdered = items[0]?.match(/^\d+\./);
        const Tag = isOrdered ? "ol" : "ul";
        return (
          <Tag key={i} className={`my-3 space-y-1.5 ${isOrdered ? "list-decimal" : "list-disc"} pl-6`}>
            {items.map((item, j) => {
              const text = item.replace(/^(\d+\.\s|[-*]\s)/, "");
              return <li key={j} className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-medium">$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-muted rounded text-xs font-mono text-foreground">$1</code>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>') }} />;
            })}
          </Tag>
        );
      }
      return <p key={i} className="text-sm text-muted-foreground leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-medium">$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-muted rounded text-xs font-mono text-foreground">$1</code>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>') }} />;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button onClick={() => navigate("/blogs")} className="h-9 w-9 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold font-heading text-foreground">Blog Preview</h1>
          <p className="text-xs text-muted-foreground">Showing how this post appears to visitors</p>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }} className="h-9 px-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
      </motion.div>

      <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {/* Featured Image */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {blog.tags.map(tag => <Badge key={tag} variant="secondary" className="bg-card/70 backdrop-blur text-xs">{tag}</Badge>)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <Badge variant={blog.status === "Published" ? "default" : "secondary"} className={blog.status === "Published" ? "bg-success/10 text-success border-0 mb-3" : "mb-3"}>{blog.status}</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading leading-tight">{blog.title}</h1>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">{blog.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {blog.author}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {blog.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {blog.readTime}</span>
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {blog.views.toLocaleString()} views</span>
          </div>

          <div className="mt-8 prose-sm">
            {renderMarkdown(blog.content)}
          </div>
        </div>
      </motion.article>

      {/* Related posts hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl border border-border shadow-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> More from Swhizz Tech Blog</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(sampleBlogs).filter(([key]) => key !== id).slice(0, 2).map(([key, b]) => (
            <button key={key} onClick={() => navigate(`/blogs/${key}`)} className="text-left p-3 rounded-xl border border-border hover:shadow-card-hover transition-all group">
              <img src={b.featuredImage} alt={b.title} className="w-full h-24 object-cover rounded-lg mb-2" />
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{b.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{b.readTime}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
