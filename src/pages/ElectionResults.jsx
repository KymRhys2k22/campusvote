import { useNavigate } from "react-router";
import {
  Trophy,
  TrendingUp,
  UserCheck,
  BarChart3,
  Megaphone,
  User,
} from "lucide-react";

export default function ElectionResults() {
  const navigate = useNavigate();

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="h-12 w-full bg-white/80 dark:bg-background-dark/80 ios-blur sticky top-0 z-50 flex items-center justify-between px-6 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live Results
          </span>
        </div>
        <div className="text-xs font-medium text-slate-400">Updated 1m ago</div>
      </div>

      <main className="max-w-md mx-auto pb-24">
        <header className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Election Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            2024 General Student Elections
          </p>
        </header>

        <section className="px-4 mb-6">
          <div className="bg-primary rounded-xl p-5 shadow-lg shadow-primary/20 text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="border-r border-white/20">
                <p className="text-xs font-medium text-white/70 uppercase mb-1">
                  Total Votes Cast
                </p>
                <p className="text-2xl font-bold tracking-tighter">4,285</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-[10px] bg-green-400/20 px-1.5 py-0.5 rounded text-green-100">
                    +12%
                  </span>
                </div>
              </div>
              <div className="pl-2">
                <p className="text-xs font-medium text-white/70 uppercase mb-1">
                  Time Remaining
                </p>
                <p className="text-2xl font-bold tracking-tighter tabular-nums">
                  02:14:05
                </p>
                <p className="text-[10px] text-white/50 mt-2 uppercase tracking-widest">
                  Polls close at 8PM
                </p>
              </div>
            </div>
          </div>
        </section>

        <nav className="px-4 mb-6">
          <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-lg flex items-center">
            <button className="flex-1 py-2 text-sm font-semibold rounded-md bg-white dark:bg-slate-700 shadow-sm transition-all text-primary">
              Student Council
            </button>
            <button className="flex-1 py-2 text-sm font-semibold rounded-md text-slate-500 dark:text-slate-400 transition-all">
              Recreation Group
            </button>
          </div>
        </nav>

        <section className="px-4 space-y-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Candidate Ranking
            </h2>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              34 candidates total
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border-2 border-primary/30 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <div className="bg-primary text-white text-[10px] font-black px-4 py-1 rotate-45 translate-x-3 -translate-y-0.5 uppercase tracking-tighter">
                Leader
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary shadow-sm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrQkQe5Q-yW7GdqMHxD3z4daPAz4jPWpcqdQPuwt7WgyuLqGTG-Sy5cCLzFniBBRfa1u_snWL0nDni8S192uqTU-SB2rOrDLdBsnzEqDAKggmgeRLF-EYwZ10zi2bnOPo4eVtbYDOYewHFbS1-q-ioYfC_v2t-SnfrddrsvniHsQV-tvPDCzHJbpalBRL8O0qk-ztZsJc19uFBD_F8hH7KyDVdWTBNKkv_7IsR0af4b3W9PVR5beMUhOU8DH0TpGdpJGPjio1BSh9A"
                  alt="Jordan Smith"
                />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full p-1 shadow-md">
                  <Trophy size={14} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">
                  Jordan Smith
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Presidential Candidate
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xl font-black text-primary leading-tight">
                  1,800
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Votes (42%)
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>Progress</span>
                <span>Goal: 2,500</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "42%" }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  className="w-12 h-12 rounded-full object-cover grayscale-[20%]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNEI2KjdKLOCcZK8h3Xl80h4tUeQ3ghD27Fd6hh1zbS64pn1l5k7R4HlspLyERCHyzVX7enhQu3QY9Vy0LVOSRsaTzceshuHHtumqIysEmJq_ps5BCX63zql_lOIkwG36sLbwOJugFdxYwBGxunxodsZlcY5lGXfV-0pNmC3v42ICrqQH85wfHXz0j6eGYGkuwe_Os2tUxRNeG4HjuL3uLHg4sHBvHzFcC785d64grjI-P6eNsq_t-tXeRfZUIpRCTrzhDq-leX_wR"
                  alt="Elena Rodriguez"
                />
                <div className="absolute -top-1 -left-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-white dark:border-slate-900">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">
                  Elena Rodriguez
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Presidential Candidate
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200 leading-tight">
                  1,245
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Votes (29%)
                </p>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/40 rounded-full"
                style={{ width: "29%" }}></div>
            </div>
          </div>
        </section>

        <section className="mt-8 px-4">
          <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <TrendingUp size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold">Voter Turnout Insights</h4>
              <p className="text-xs text-slate-500">
                Peak voting activity detected in East Campus at 12:30 PM today.
              </p>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-background-dark/80 ios-blur border-t border-slate-200 dark:border-slate-800 pb-8 pt-2 px-6">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-1 text-slate-400">
            <UserCheck size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Vote
            </span>
          </button>
          <button className="flex flex-col items-center gap-1 text-primary">
            <BarChart3 size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Results
            </span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <Megaphone size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              News
            </span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <User size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Profile
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
