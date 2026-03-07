import { useNavigate } from "react-router";
import { ChevronLeft, Ban, CheckCircle, Send } from "lucide-react";

export default function ReviewBallot() {
  const navigate = useNavigate();

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary font-medium">
          <ChevronLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-bold">Review Ballot</h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 px-4 py-8 md:py-12 max-w-xl md:max-w-4xl mx-auto w-full transition-all duration-300">
        <div className="mb-10 md:mb-14 text-center">
          <p className="text-xs md:text-sm font-semibold text-primary uppercase tracking-widest mb-2 opacity-80">
            Step 3 of 3
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
            Final Review
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            Please double-check your selections before submitting. You cannot
            change your vote after submission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
            <div className="relative">
              <img
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover bg-primary/10 ring-2 ring-primary/5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCqL9rDVLhBcsndekd2KOMxzPvaRO16L0_w21qBWFtyPycunX5nF46CFgk7ZqTJP7xYpePukW0KG2B3KxNI31IEgCxh9d4Ukw1uvGtEVtDqeG9r1-jVhsZTvCgBDdk8lgtLbbBECMz6DGqoJjWtFG_rDgabz7Zlbd6mDQ0viL8DaaQF_Zz6aw7wkRbQ04Y05DE6soRd7ulkzIuP2sgY645jADPIIrMLv8FF4NdzQ6drYoveQnJ-buEhpJxrncUEPKaO_-W1lXOw8W1"
                alt="Maya Chen"
              />
              <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                <CheckCircle size={14} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest mb-1">
                Student Council
              </p>
              <p className="text-lg md:text-xl font-bold">Maya Chen</p>
              <p className="text-xs text-slate-400 font-medium">
                Presidential Candidate
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-600">
              <Ban size={32} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Recreation Group
              </p>
              <p className="text-lg md:text-xl font-bold italic text-slate-500 dark:text-slate-400">
                Abstain
              </p>
              <p className="text-xs text-slate-400 font-medium">
                No candidate selected
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12 max-w-2xl mx-auto">
          <label className="relative flex items-start group cursor-pointer p-4 md:p-6 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
            <div className="flex items-center h-6 mt-1">
              <input
                className="h-6 w-6 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary transition-all duration-200 cursor-pointer"
                id="final-confirm"
                name="final-confirm"
                type="checkbox"
              />
            </div>
            <div className="ml-4 text-sm md:text-base leading-relaxed">
              <span className="font-bold text-slate-800 dark:text-slate-100">
                I understand that my vote is final.
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-2 font-medium">
                By checking this box, you confirm that your selections are
                accurate and you are ready to transmit your digital ballot.
              </p>
            </div>
          </label>
        </div>
      </main>

      <footer className="mt-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-primary/10 px-4 py-8 md:py-10">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate("/success")}
            className="w-full bg-accent hover:bg-accent/90 text-slate-900 font-bold py-4.5 rounded-2xl shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
            <span className="text-lg">Submit My Vote</span>
            <Send size={20} />
          </button>
          <p className="text-center text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-400 mt-6 font-bold opacity-70">
            Secured by Student Council Voting System
          </p>
        </div>
      </footer>
    </div>
  );
}
