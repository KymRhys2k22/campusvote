import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Trophy,
  TrendingUp,
  UserCheck,
  BarChart3,
  Megaphone,
  User,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  LogIn,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Admin() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  // --- AUTHENTICATION STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("admin_session") === "active";
  });

  // --- LOGIN FORM STATE ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const POSITIONS = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Auditor",
    "PRO",
    "Representative",
  ];

  const loginContainerRef = useRef(null);
  const orgNavRef = useRef(null);

  const handleOrgScroll = (direction) => {
    if (orgNavRef.current) {
      orgNavRef.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("vote_count", { ascending: false });

      if (error) throw error;
      const results = data || [];
      setCandidates(results);

      const uniqueOrgs = [
        ...new Set(results.map((c) => c.organization || "Independent")),
      ];
      setOrganizations(uniqueOrgs);
      if (uniqueOrgs.length > 0 && !activeTab) {
        setActiveTab(uniqueOrgs[0]);
      }
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ENTRANCE ANIMATIONS (useGSAP) ---
  useGSAP(
    () => {
      if (!isLoggedIn) {
        const tl = gsap.timeline();
        tl.from(".login-header > *", {
          y: -20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        })
          .from(
            ".login-card",
            {
              y: 40,
              opacity: 0,
              duration: 1,
              ease: "power4.out",
            },
            "-=0.4",
          )
          .from(
            ".login-animate",
            {
              y: 20,
              opacity: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.6",
          );
      }
    },
    { dependencies: [isLoggedIn], scope: loginContainerRef },
  );

  useEffect(() => {
    if (isLoggedIn) {
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

                // Update organizations if a new one appears (unlikely but safe)
                const uniqueOrgs = [
                  ...new Set(
                    updated.map((c) => c.organization || "Independent"),
                  ),
                ];
                setOrganizations(uniqueOrgs);

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
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    // Use environment variables or fallback to demo credentials
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || "admin";
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

    setTimeout(() => {
      if (username === adminUsername && password === adminPassword) {
        setIsLoggedIn(true);
        sessionStorage.setItem("admin_session", "active");
      } else {
        setLoginError("Invalid admin credentials. Please try again.");
      }
      setIsLoggingIn(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_session");
  };

  if (!isLoggedIn) {
    return (
      <div
        ref={loginContainerRef}
        className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 login-header">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6 shadow-sm border border-primary/5">
              <LayoutDashboard size={44} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Admin Portal
            </h1>
            <p className="text-slate-500 font-medium">
              Access the presidential election dashboard.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-xl shadow-slate-200/50 backdrop-blur-sm login-card">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="login-animate">
                <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                  Admin Username
                </label>
                <div className="relative group">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="placeholder:text-slate-400 w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 shadow-inner ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none"
                  />
                </div>
              </div>

              <div className="login-animate">
                <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="placeholder:text-slate-400 w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 shadow-inner ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="font-medium">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 h-14 transition-all">
                {isLoggingIn ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-8 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold opacity-60">
            Secure Admin Access • FEU Alabang
          </p>
        </div>
      </div>
    );
  }

  const filteredCandidates = candidates.filter(
    (c) => (c.organization || "Independent") === activeTab,
  );

  const totalVotes = candidates.reduce(
    (acc, c) => acc + (c.vote_count || 0),
    0,
  );

  // Group filtered candidates by position
  const groupedByPosition = POSITIONS.reduce((acc, pos) => {
    const candidatesForPos = filteredCandidates.filter(
      (c) => c.position === pos,
    );
    if (candidatesForPos.length > 0) {
      acc[pos] = candidatesForPos.sort(
        (a, b) => (b.vote_count || 0) - (a.vote_count || 0),
      );
    }
    return acc;
  }, {});

  return (
    <div className="font-display bg-background-light text-slate-900 min-h-screen">
      <header className="bg-white/80 sticky top-0 z-50 border-b border-primary/10 ios-blur">
        <div className="px-5 py-4 lg:px-10 lg:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-black tracking-tight text-slate-800 uppercase leading-none">
                Admin{" "}
                <span className="text-primary text-shadow-sm">Portal</span>
              </h1>
              <p className="text-[10px] lg:text-xs uppercase font-bold text-slate-400 tracking-widest mt-1">
                Live Results Console
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/10">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Live Feed
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              title="Logout">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="grow px-4 lg:px-10 py-6 lg:py-10">
        <header className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-800 leading-none">
            Election <br className="md:hidden" />
            <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 lg:text-lg">
            2024 General Student Elections
          </p>
        </header>

        <section className="mb-8 lg:mb-12">
          <div className="bg-primary rounded-3xl lg:rounded-[3rem] p-6 lg:p-10 shadow-2xl shadow-primary/20 text-white relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 relative z-10">
              <div className="md:border-r md:border-white/10 md:pr-12">
                <p className="text-xs lg:text-sm font-black text-white/60 uppercase tracking-[0.2em] mb-3">
                  Total Votes Cast
                </p>
                <div className="flex items-baseline gap-4">
                  <p className="text-5xl lg:text-7xl font-black tracking-tighter tabular-nums text-shadow-lg">
                    {totalVotes.toLocaleString()}
                  </p>
                  <span className="text-xs animate-pulse  font-black px-2 py-1 rounded-lg uppercase tracking-widest text-white/ bg-red-500 border border-white/10">
                    Live
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

        <nav className="mb-8 lg:mb-12">
          <div className="relative group/chips flex items-center">
            {/* Left arrow — desktop only */}
            <button
              onClick={() => handleOrgScroll("left")}
              className="absolute left-0 z-10 p-1.5 -ml-4 bg-white border border-slate-200 text-slate-500 rounded-full shadow-md opacity-0 group-hover/chips:opacity-100 transition-opacity hover:text-primary hover:border-primary/50 hidden md:block">
              <ChevronLeft size={16} />
            </button>

            <div
              ref={orgNavRef}
              className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar w-full scroll-smooth px-1">
              {organizations.map((org) => (
                <button
                  key={org}
                  onClick={() => setActiveTab(org)}
                  className={`shrink-0 px-6 py-3 text-sm lg:text-base font-black uppercase tracking-widest rounded-2xl transition-all border ${
                    activeTab === org
                      ? "bg-white text-primary border-primary/20 shadow-md ring-1 ring-black/5 scale-105"
                      : "bg-slate-100 ring-1 ring-slate-200 text-slate-400 border-transparent hover:bg-slate-200 hover:text-slate-500"
                  }`}>
                  {org.length > 8 ? `${org.slice(0, 9)}...` : org}
                </button>
              ))}
            </div>

            {/* Right arrow — desktop only */}
            <button
              onClick={() => handleOrgScroll("right")}
              className="absolute right-0 z-10 p-1.5 -mr-4 bg-white border border-slate-200 text-slate-500 rounded-full shadow-md opacity-0 group-hover/chips:opacity-100 transition-opacity hover:text-primary hover:border-primary/50 hidden md:block">
              <ChevronRight size={16} />
            </button>
          </div>
        </nav>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <Loader2 size={64} className="text-primary animate-spin" />
            <p className="text-slate-400 text-sm lg:text-base font-black uppercase tracking-[0.3em] animate-pulse">
              Synchronizing Tallies...
            </p>
          </div>
        ) : Object.keys(groupedByPosition).length > 0 ? (
          <div className="space-y-16 lg:space-y-24">
            {POSITIONS.filter((pos) => groupedByPosition[pos]).map((pos) => {
              const posCandidates = groupedByPosition[pos];
              const posLeader = posCandidates[0];
              const posTotalVotes = posCandidates.reduce(
                (acc, c) => acc + (c.vote_count || 0),
                0,
              );

              return (
                <section
                  key={pos}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex items-center justify-between mb-8 lg:mb-10 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-10 bg-primary rounded-full" />
                      <div>
                        <h2 className="text-2xl lg:text-4xl font-black uppercase tracking-tighter text-slate-800">
                          {pos} <span className="text-primary">Results</span>
                        </h2>
                        <p className="text-slate-400 text-[10px] lg:text-xs font-black uppercase tracking-widest mt-1">
                          {posCandidates.length} Candidates •{" "}
                          {posTotalVotes.toLocaleString()} Position Votes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Top Candidate for this Position */}
                  {posLeader && (
                    <div className="bg-white rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-12 border border-primary/10 shadow-2xl shadow-primary/5 relative overflow-hidden transition-all duration-500 hover:shadow-primary/10 mb-8 lg:mb-10 group">
                      <div className="absolute top-12 -right-5">
                        <div className="bg-primary text-white text-[10px] lg:text-xs font-black pr-12 pl-18 py-3 rotate-45 translate-x-8 -translate-y-2 uppercase tracking-[0.2em] shadow-lg">
                          Leading Candidate
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                        <div className="relative shrink-0">
                          <img
                            className="w-32 h-32 lg:w-48 lg:h-48 rounded-4xl object-cover ring-4 ring-primary ring-offset-4 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                            src={
                              posLeader.image_url ||
                              "https://via.placeholder.com/150"
                            }
                            alt={posLeader.full_name}
                          />
                          <div className="absolute -bottom-4 -right-4 bg-accent text-slate-900 rounded-2xl p-4 shadow-2xl border-2 border-white transform rotate-12">
                            <Trophy size={28} />
                          </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-4xl lg:text-6xl font-black text-slate-800 tracking-tighter leading-none mb-6">
                            {posLeader.full_name}
                          </h3>
                          <div className="flex items-center justify-center md:justify-start gap-4">
                            <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center md:items-start">
                              <span className="text-3xl lg:text-4xl font-black text-slate-800 tabular-nums leading-none">
                                {(posLeader.vote_count || 0).toLocaleString()}
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                Tally
                              </span>
                            </div>
                            <div className="px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col items-center md:items-start">
                              <span className="text-xl lg:text-2xl font-black text-primary">
                                {posTotalVotes > 0
                                  ? Math.round(
                                      (posLeader.vote_count / posTotalVotes) *
                                        100,
                                    )
                                  : 0}
                                %
                              </span>
                              <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-1">
                                Share
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other Candidates for this Position */}
                  {posCandidates.length > 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posCandidates.slice(1).map((candidate, index) => (
                        <div
                          key={candidate.id}
                          className="bg-white rounded-4xl p-6 shadow-xl shadow-black/5 border border-slate-100 hover:border-primary/20 hover:shadow-primary/5 transition-all group relative overflow-hidden">
                          <div className="flex items-center gap-5 mb-5">
                            <div className="relative shrink-0">
                              <img
                                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-primary/20 transition-all"
                                src={
                                  candidate.image_url ||
                                  "https://via.placeholder.com/150"
                                }
                                alt={candidate.full_name}
                              />
                              <div className="absolute -top-2 -left-2 bg-slate-100 text-slate-500 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-primary group-hover:text-white transition-colors border border-white">
                                {index + 2}
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-lg font-black text-slate-800 tracking-tight leading-none group-hover:text-primary transition-colors truncate">
                                {candidate.full_name}
                              </h4>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {index + 2}nd Runner up
                              </p>
                            </div>
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-2xl font-black text-slate-800 tabular-nums">
                                {(candidate.vote_count || 0).toLocaleString()}
                              </p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Votes (
                                {posTotalVotes > 0
                                  ? Math.round(
                                      (candidate.vote_count / posTotalVotes) *
                                        100,
                                    )
                                  : 0}
                                %)
                              </p>
                            </div>
                            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                              <div
                                className="h-full bg-primary/40 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${posTotalVotes > 0 ? (candidate.vote_count / posTotalVotes) * 100 : 0}%`,
                                }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
              <TrendingUp size={40} />
            </div>
            <h3 className="text-lg font-bold mb-2">No Candidates Yet</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              As soon as candidates are added and votes start coming in, you'll
              see live tallies here.
            </p>
          </div>
        )}

        <section className="mt-8 px-4">
          <div className="bg-primary/5 rounded-2xl p-5 flex items-center gap-4 border border-primary/10">
            <div className="bg-primary/20 p-2.5 rounded-xl text-primary">
              <TrendingUp size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold">Voter Engagement</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Live rankings are updated every time a new ballot is cast. Stay
                tuned for real-time changes!
              </p>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 pb-8 pt-2 px-6 z-50"></nav>
    </div>
  );
}
