# 🗳️ CampusVote

**CampusVote** is a modern, secure **voting system** built with **ReactJS** and **Supabase**, designed to streamline the **campus vote** process for university organizations. It provides an intuitive, premium interface for **student** voters to browse **candidates**, review platforms, and cast their ballots with confidence.

---

## 🚀 Tech Stack

- **Frontend:** [ReactJS](https://react.dev/) (Vite)
- **Backend/Database:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [GSAP](https://greensock.com/gsap/)
- **Student Data:** [OpenSheet API](https://opensheet.elk.sh/)

## ✨ Key Features

- **🗳️ Infinite Ballot:** A smooth, interactive voting experience with real-time progress tracking.
- **👤 Candidate Showcases:** Detailed platforms and profiles for all candidates, grouped by position.
- **🔐 Secure Authentication:** Multi-layered verification using student credentials and email.
- **📊 Live Results:** Dynamic visualization of election results as they come in.
- **📱 Mobile-First Design:** Fully responsive and optimized for a premium mobile experience.
- **🛠️ Admin Dashboard:** Management tools for candidates and election configuration.

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Cards, Buttons, Guards)
├── pages/          # Full page layouts (Ballot, Results, Login, Admin)
├── lib/            # External service configurations (Supabase client)
├── context/        # React Context for global state management
└── assets/         # Static assets and design tokens
```

## 🛠️ Getting Started

To get this project running locally:

1. **Clone and Install:**

   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file with your Supabase and Gemini credentials.

3. **Launch Dev Server:**

   ```bash
   npm run dev
   ```

---
