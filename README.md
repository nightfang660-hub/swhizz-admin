# Swhizz Admin Panel

A production-ready, scalable SaaS Admin Panel for **Swhizz Tech** — a corporate tech education platform.

---

## 🚀 Tech Stack

- **Vite** — lightning-fast build tool
- **React 18** — component-based UI
- **TypeScript** — type-safe codebase
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible component library
- **Recharts** — interactive data visualizations
- **Framer Motion** — smooth animations

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18+) and npm installed — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Setup

```sh
# Step 1: Clone the repository
git clone https://github.com/nightfang660-hub/swhizz-admin.git

# Step 2: Navigate to the project directory
cd swhizz-admin

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── dashboard/       # KPI cards, charts, sparklines
│   ├── layout/          # Sidebar, TopHeader
│   ├── shared/          # Reusable modals, skeletons
│   └── ui/              # shadcn/ui components
├── pages/
│   ├── Index.tsx         # Dashboard
│   ├── CoursesPage.tsx   # Course management
│   ├── StudentsPage.tsx  # Student management
│   ├── LeadsPage.tsx     # Lead management
│   ├── BlogsPage.tsx     # Blog management
│   ├── MediaPage.tsx     # Media library
│   ├── SettingsPage.tsx  # Settings
│   └── cms/              # CMS pages (Hero, About, Batches...)
├── hooks/               # Custom React hooks
└── lib/                 # Utility functions
```

---

## ✨ Features

- 📊 **Dashboard** — KPI cards, growth charts, revenue overview
- 📚 **Course Management** — create, edit, delete, duplicate courses
- 👨‍🎓 **Student Management** — profiles, payment tracking, enrollment status
- 🎯 **Leads Management** — lead capture, approval flow
- 📝 **Blog Management** — rich blog editor, publish/draft control
- 🖼️ **Media Library** — upload and manage assets
- 🏠 **Homepage CMS** — manage banners, batches, about content
- ⚙️ **Settings** — roles, branding, profile

---

## 🛠 Build for Production

```sh
npm run build
```

Output will be in the `dist/` folder.

---

## 📄 License

© 2026 Swhizz Tech. All rights reserved.
