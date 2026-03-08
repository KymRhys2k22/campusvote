import { useNavigate } from "react-router";
import { Check, Copy, Facebook, Share2, ExternalLink } from "lucide-react";

export default function VotingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="font-display bg-background-light text-slate-900 min-h-screen flex flex-col">
      <div className="h-12 w-full"></div>

      <main className="flex-1 flex flex-col px-6 pb-12 items-center justify-center max-w-md mx-auto w-full">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl scale-150"></div>
          <div className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-accent">
            <Check size={56} className="text-accent" />
          </div>
        </div>

        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Your Vote has Been Cast!
          </h1>
          <p className="text-slate-500 px-4">
            Thank you for participating in the 2024 Student Council Elections.
            Your voice shapes our future.
          </p>
        </div>

        <div className="w-full bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Submission Time
              </span>
              <span className="text-sm font-semibold text-slate-900">
                Oct 24, 14:32 PM
              </span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Digital Receipt
              </span>
              <div className="flex items-center justify-between bg-background-light p-3 rounded-lg border border-slate-100">
                <code className="text-primary font-bold tracking-widest uppercase">
                  SC-29384-X9L
                </code>
                <button className="text-primary flex items-center justify-center p-1 hover:bg-primary/10 rounded-full transition-colors">
                  <Copy size={20} />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-1 italic">
                Keep this receipt for your records of participation.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full text-center space-y-4 mb-8">
          <p className="text-sm font-semibold text-slate-600">
            Spread the word!
          </p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity">
              <Facebook size={20} />
            </button>
            <button className="w-12 h-12 rounded-full bg-sky-400 flex items-center justify-center text-white hover:opacity-90 transition-opacity">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </main>

      <footer className="p-6 pb-10 bg-white border-t border-slate-100 ios-blur bg-opacity-80">
        <div className="max-w-md mx-auto space-y-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-accent text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/30 transition-all active:scale-[0.98]">
            Back to Home
          </button>
          <button
            onClick={() => navigate("/results")}
            className="w-full bg-transparent text-slate-500 font-medium py-2 rounded-xl flex items-center justify-center transition-all active:opacity-60">
            View Election Results
            <ExternalLink size={14} className="ml-1" />
          </button>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="w-32 h-1.5 bg-slate-300 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
}
