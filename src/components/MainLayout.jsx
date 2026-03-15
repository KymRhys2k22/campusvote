import React from "react";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 relative overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] aspect-square bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] aspect-square bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Optimized Container for all screen sizes */}
      <div className="relative z-10 w-full mx-auto transition-all duration-500 ease-in-out md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
        {children}
      </div>
    </div>
  );
}
