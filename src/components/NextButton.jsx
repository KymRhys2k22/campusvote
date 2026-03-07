import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

const NextButton = React.forwardRef(({ text, navigation, disabled }, ref) => {
  const navigate = useNavigate();
  return (
    <div
      ref={ref}
      className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 ios-blur border-t border-slate-200 dark:border-slate-800 p-4 pb-8 z-50">
      <div className=" mx-auto">
        <button
          onClick={() => navigate(navigation)}
          disabled={disabled}
          className="w-full bg-accent text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/30 disabled:opacity-30 disabled:shadow-none transition-all active:scale-[0.98]">
          {text}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
});

export default NextButton;
