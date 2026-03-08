import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

const ProgressButtonBar = React.forwardRef(
  ({ navigateTo, progress, disabled, text, state }, ref) => {
    const navigate = useNavigate();
    return (
      <div
        ref={ref}
        className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t border-slate-200 p-4 pb-8 z-50 md:rounded-t-full rounded-t-2xl ">
        <div className=" mx-auto max-w-sm flex">
          <button
            onClick={() => navigate(navigateTo, { state })}
            disabled={disabled}
            className="disabled:opacity-30 disabled:shadow-none transition-all active:scale-[0.98] flex-2 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
            {text}
            <ArrowRight size={20} />
          </button>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-accent ${progress === 1 ? "w-1/4" : progress === 2 ? "w-1/2" : progress === 3 ? "w-full" : "w-0"} rounded-full`}></div>
          </div>
        </div>
        <p className="text-[10px]  text-center text-accent mt-2 font-medium uppercase tracking-widest">
          Progress: {progress} of 3 Positions
        </p>
      </div>
    );
  },
);

export default ProgressButtonBar;
