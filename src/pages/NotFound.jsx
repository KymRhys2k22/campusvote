import React, { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";
import gsap from "gsap";

export default function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Subtle float animation for the icon
      gsap.to(".float-icon", {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background-light flex flex-col items-center justify-center p-6 text-center font-display overflow-hidden">
      <div
        ref={contentRef}
        className="max-w-md w-full py-12 px-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[3rem] shadow-2xl relative z-10">
        <div className="float-icon mb-8 inline-flex p-6 bg-accent/10 rounded-full border border-accent/20">
          <AlertTriangle size={64} className="text-accent" />
        </div>

        <h1 className="text-7xl font-black text-primary mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-500 mb-10 leading-relaxed text-balance">
          It seems you've wandered off the grid. The page you are looking for
          doesn't exist or has been moved.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 group active:scale-[0.98]">
            <Home
              size={18}
              className="group-hover:-translate-y-0.5 transition-transform"
            />
            Back to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-transparent border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]">
            <ArrowLeft size={18} />
            Go Previous
          </button>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
