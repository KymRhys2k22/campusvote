import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Trophy,
  TrendingUp,
  UserCheck,
  BarChart3,
  Megaphone,
  User,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function ElectionResults() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Student Council");

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("vote_count", { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();

    const channel = supabase
      .channel("live_results")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "candidates",
        },
        (payload) => {
          console.log("Results Realtime Event:", payload);
          if (payload.new) {
            setCandidates((prev) => {
              const updated = prev.map((c) =>
                String(c.id) === String(payload.new.id)
                  ? { ...c, ...payload.new }
                  : c,
              );
              // Re-sort on every update to keep the leaderboard live
              return [...updated].sort(
                (a, b) => (b.vote_count || 0) - (a.vote_count || 0),
              );
            });
          }
        },
      )
      .subscribe((status) => {
        console.log("Results Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalVotes = candidates.reduce(
    (acc, c) => acc + (c.vote_count || 0),
    0,
  );

  // Filter candidates based on some logic (using organization or just splitting them for demo)
  // For now, let's assume "Student Council" is the main list
  const filteredCandidates = candidates.filter(
    (c) => (activeTab === "Student Council" ? true : false), // Add party logic here if needed
  );

  const leader = filteredCandidates[0];

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="h-12 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live Results
          </span>
        </div>
        <div className="text-xs font-medium text-slate-400">
          {isLoading ? "Synchronizing..." : "Live Connection Active"}
        </div>
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
                <p className="text-2xl font-bold tracking-tighter tabular-nums">
                  {totalVotes.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-[10px] bg-green-400/20 px-1.5 py-0.5 rounded text-green-100">
                    Live Updates
                  </span>
                </div>
              </div>
              <div className="pl-2">
                <p className="text-xs font-medium text-white/70 uppercase mb-1">
                  Status
                </p>
                <p className="text-lg font-bold tracking-tight">Polls Open</p>
                <p className="text-[10px] text-white/50 mt-2 uppercase tracking-widest leading-tight">
                  Closing at 8:00 PM
                </p>
              </div>
            </div>
          </div>
        </section>

        <nav className="px-4 mb-6">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("Student Council")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "Student Council" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400"}`}>
              Student Council
            </button>
            <button
              onClick={() => setActiveTab("Other")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "Other" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400"}`}>
              Recreation
            </button>
          </div>
        </nav>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="text-primary animate-spin" />
            <p className="text-slate-400 text-sm font-medium animate-pulse">
              Fetching latest tallies...
            </p>
          </div>
        ) : filteredCandidates.length > 0 ? (
          <section className="px-4 space-y-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Live Rankings
              </h2>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {filteredCandidates.length} Candidates
              </span>
            </div>

            {/* Leader Card */}
            {leader && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-primary/30 shadow-sm relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-white text-[10px] font-black px-6 py-1.5 rotate-45 translate-x-5 -translate-y-1 uppercase tracking-tighter">
                    Leader
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <img
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-primary shadow-sm"
                      src={
                        leader.image_url || "https://via.placeholder.com/150"
                      }
                      alt={leader.full_name}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full p-1.5 shadow-md">
                      <Trophy size={14} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl leading-none mb-1">
                      {leader.full_name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {leader.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary leading-none">
                      {(leader.vote_count || 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      {totalVotes > 0
                        ? Math.round((leader.vote_count / totalVotes) * 100)
                        : 0}
                      % Support
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Vote Progression</span>
                    <span>{leader.vote_count} Total</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${totalVotes > 0 ? (leader.vote_count / totalVotes) * 100 : 0}%`,
                      }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Remaining Candidates */}
            <div className="space-y-3 pt-2">
              {filteredCandidates.slice(1).map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="bg-white dark:bg-slate-900/50 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative">
                      <img
                        className="w-12 h-12 rounded-xl object-cover"
                        src={
                          candidate.image_url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={candidate.full_name}
                      />
                      <div className="absolute -top-1.5 -left-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black border border-white dark:border-slate-700 shadow-sm">
                        {index + 2}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                        {candidate.full_name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {candidate.position}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200 leading-tight">
                        {(candidate.vote_count || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {totalVotes > 0
                          ? Math.round(
                              (candidate.vote_count / totalVotes) * 100,
                            )
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/30 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${totalVotes > 0 ? (candidate.vote_count / totalVotes) * 100 : 0}%`,
                      }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="px-6 py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
              <TrendingUp size={40} />
            </div>
            <h3 className="text-lg font-bold mb-2">No Candidates Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              As soon as candidates are added and votes start coming in, you'll
              see live tallies here.
            </p>
          </div>
        )}

        <section className="mt-8 px-4">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 flex items-center gap-4 border border-primary/10">
            <div className="bg-primary/20 p-2.5 rounded-xl text-primary">
              <TrendingUp size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold">Voter Engagement</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Live rankings are updated every time a new ballot is cast. Stay
                tuned for real-time changes!
              </p>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-8 pt-2 px-6 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
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
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <Megaphone size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              News
            </span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
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
