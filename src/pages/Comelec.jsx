import { useState, useEffect, useRef, Activity } from "react";
import { useGSAP } from "@gsap/react";
import {
  GraduationCap,
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  LayoutDashboard,
  Settings,
  BarChart3,
  LogOut,
  Plus,
  X,
  Quote,
  User2,
  RefreshCw,
  Upload,
  Camera,
  Shield,
  Music,
  Megaphone,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import gsap from "gsap";
import CandidateCard from "../components/CandidateCard";

export default function Comelec() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("comelec_session") === "active";
  });
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isFetchingCandidates, setIsFetchingCandidates] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [uploading, setUploading] = useState(false);

  // FAB & Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    full_name: "",
    position: "President",
    quotes: "",
    image_url: "",
    organization: "",
    partylist: "",
    platform: "",
  });
  const [partylists, setPartylists] = useState([]);

  // Refs for Animations
  const loginContainerRef = useRef(null);
  const headerRef = useRef(null);
  const statsContainerRef = useRef(null);
  const overviewHeaderRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const modalContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollContainerRefs = useRef({});

  const POSITIONS = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Auditor",
    "PRO",
    "Representative",
  ];

  const groupedCandidates = POSITIONS.reduce((acc, pos) => {
    acc[pos] = candidates
      .filter((c) => c.position === pos)
      .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    return acc;
  }, {});

  const handleScroll = (position, direction) => {
    const container = scrollContainerRefs.current[position];
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const totalVotes = candidates.reduce(
    (acc, c) => acc + (c.vote_count || 0),
    0,
  );

  const fetchCandidates = async () => {
    setIsFetchingCandidates(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("candidates")
        .select("*")
        .order("position", { ascending: true });

      if (fetchError) throw fetchError;
      setCandidates(data || []);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    } finally {
      setIsFetchingCandidates(false);
    }
  };

  const fetchPartylists = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("partylist")
        .select("*")
        .order("name", { ascending: true });

      if (fetchError) throw fetchError;
      setPartylists(data || []);
    } catch (err) {
      console.error("Error fetching partylists:", err);
    }
  };

  useGSAP(() => {
    if (!isLoggedIn) {
      // Login Entrance
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
        )
        .from(
          ".login-footer",
          {
            opacity: 0,
            duration: 1,
          },
          "-=0.4",
        );
    } else {
      // Dashboard Entrance
      const tl = gsap.timeline();
      tl.from(".dashboard-header", {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
      })
        .from(
          ".stat-card",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .from(
          ".overview-header",
          {
            x: -40,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.5",
        );
    }
  }, [isLoggedIn]);

  useGSAP(
    () => {
      if (isLoggedIn && candidates.length > 0) {
        gsap.from(".candidate-card:not([data-animated='true'])", {
          opacity: 0,
          y: 20,
          scale: 0.98,
          duration: 1,
          stagger: 0.2,
          ease: "elastic.out(1, 0.3)",
          overwrite: true,
          onStart: function () {
            this.targets().forEach((el) =>
              el.setAttribute("data-animated", "true"),
            );
          },
        });
      }
    },
    { dependencies: [candidates, isLoggedIn], scope: cardsContainerRef },
  );

  useGSAP(() => {
    if (showAddModal) {
      gsap.fromTo(
        ".modal-backdrop",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
      gsap.fromTo(
        ".modal-content",
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
      );
    }
  }, [showAddModal]);

  useEffect(() => {
    const session = sessionStorage.getItem("comelec_session");
    if (session === "active") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCandidates();
      fetchPartylists();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const channel = supabase
      .channel("vote_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "candidates",
        },
        (payload) => {
          console.log("Realtime Payload Received:", payload);
          if (payload.new) {
            setCandidates((prev) =>
              prev.map((candidate) =>
                String(candidate.id) === String(payload.new.id)
                  ? { ...candidate, vote_count: payload.new.vote_count }
                  : candidate,
              ),
            );
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime Subscription Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Placeholder credentials
    setTimeout(() => {
      if (
        username === import.meta.env.VITE_COMELEC_USERNAME &&
        password === import.meta.env.VITE_COMELEC_PASSWORD
      ) {
        setIsLoggedIn(true);
        sessionStorage.setItem("comelec_session", "active");
      } else {
        setError("Invalid username or password. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!newCandidate.full_name) {
      setError(
        "Please enter the candidate's name first to name the image correctly.",
      );
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // Use full_name for public_id if available, otherwise use filename
    const sanitizedName = newCandidate.full_name
      ? newCandidate.full_name.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : file.name.split(".")[0];
    formData.append("public_id", `candidate_${sanitizedName}_${Date.now()}`);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      console.log("Cloudinary Upload Success:", data);
      setNewCandidate((prev) => ({ ...prev, image_url: data.secure_url }));
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("comelec_session");
    setCandidates([]);
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setError("");

    const candidateData = {
      full_name: newCandidate.full_name,
      position: newCandidate.position,
      quotes: newCandidate.quotes,
      image_url: newCandidate.image_url,
      organization: newCandidate.organization,
      partylist: newCandidate.partylist,
      platform: newCandidate.platform,
      vote_count: 0,
    };

    console.log("Attempting to insert candidate:", candidateData);

    try {
      const { data, error: insertError } = await supabase
        .from("candidates")
        .insert([candidateData]);

      if (insertError) throw insertError;

      console.log("Candidate Added Successfully:", data);
      setShowAddModal(false);
      setNewCandidate({
        full_name: "",
        position: "President",
        quotes: "",
        image_url: "",
        organization: "",
        partylist: "",
        platform: "",
      });
      fetchCandidates(); // Refresh list after adding
    } catch (err) {
      console.error("Error adding candidate:", err);
      setError(
        err.message || "Failed to add candidate. Please check your connection.",
      );
    } finally {
      setIsAdding(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        ref={loginContainerRef}
        className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 login-header">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6 shadow-sm border border-primary/5">
              <GraduationCap size={44} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              COMELEC Portal
            </h1>
            <p className="text-slate-500 font-medium">
              Authorized access only for election management.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-xl shadow-slate-200/50 backdrop-blur-sm login-card">
            <form onSubmit={handleLogin} className="space-y-6 login-form">
              <div className="login-animate">
                <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                  Username
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
                    placeholder="Enter your username"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 shadow-inner ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none"
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
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 shadow-inner ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#009900] hover:bg-[#008800] text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 h-14 min-h-14 relative z-50 opacity-100">
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-8 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold opacity-60 login-footer">
            Internal Systems • Student Council Election
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col relative overflow-x-hidden">
      <header
        ref={headerRef}
        className="bg-white/80 sticky top-0 z-40 ios-blur border-b border-primary/10 px-6 py-4 flex items-center justify-between dashboard-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">
              COMELEC Admin
            </h1>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">
              Management Console
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          title="Logout">
          <LogOut size={22} />
        </button>
      </header>

      <main className="grow p-6 max-w-6xl mx-auto w-full">
        <div
          ref={statsContainerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm flex items-center gap-5 stat-card">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1">
                Active Voters
              </p>
              <h3 className="text-2xl font-bold">1,248</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm flex items-center gap-5 stat-card">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1">
                Total Votes
              </p>
              <h3 className="text-2xl font-bold tabular-nums">
                {totalVotes.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm flex items-center gap-5 stat-card">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <User2 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1">
                Total Candidates
              </p>
              <h3 className="text-2xl font-bold">{candidates.length}</h3>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div
            ref={overviewHeaderRef}
            className="flex items-center justify-between overview-header">
            <h2 className="font-bold text-xl tracking-tight">
              Election Overview
            </h2>
            <button
              onClick={fetchCandidates}
              className="p-2 text-slate-400 hover:text-primary transition-colors"
              title="Refresh Data">
              <BarChart3 size={20} className="" />
            </button>
          </div>

          {isFetchingCandidates && candidates.length === 0 ? (
            <div className="flex items-center pt-24 justify-center h-full w-full">
              <RefreshCw size={40} className="text-primary animate-spin" />
            </div>
          ) : candidates.length > 0 ? (
            <div ref={cardsContainerRef} className="space-y-12">
              {POSITIONS.map((position) => {
                const candidatesInPosition = groupedCandidates[position] || [];
                if (candidatesInPosition.length === 0) return null;

                return (
                  <div key={position} className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-primary rounded-full" />
                        <h3 className="text-xl font-black tracking-tight text-slate-800 uppercase">
                          {position}
                        </h3>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg border border-slate-200">
                          {candidatesInPosition.length}{" "}
                          {candidatesInPosition.length === 1
                            ? "Candidate"
                            : "Candidates"}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-hidden px-2 relative">
                      <div className="flex gap-6 animate-marquee w-max">
                        {/* Original Set */}
                        {candidatesInPosition.map((candidate) => (
                          <div
                            key={`${candidate.id}-orig`}
                            className="shrink-0 w-[280px] sm:w-[320px] md:w-auto">
                            <CandidateCard candidate={candidate} />
                          </div>
                        ))}
                        {/* Cloned Set for Seamless Loop */}
                        {candidatesInPosition.map((candidate) => (
                          <div
                            key={`${candidate.id}-clone`}
                            className="shrink-0 w-[280px] sm:w-[320px] md:w-auto">
                            <CandidateCard candidate={candidate} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-primary/10 p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <BarChart3 size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">No candidates found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Use the <Plus size={16} className="inline-block" /> button below
                to add your first candidate to the election.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-accent/80 text-slate-900 rounded-2xl shadow-2xl shadow-accent/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50 group">
        <Plus
          size={32}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      {/* Add Candidate Modal */}
      <Activity mode={showAddModal ? "visible" : "hidden"}>
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0  backdrop-blur-sm modal-backdrop"
            onClick={() => setShowAddModal(false)}
          />
          <div
            ref={modalContainerRef}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-primary/10 overflow-hidden modal-content flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-primary/10 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold tracking-tight">
                Add New Candidate
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleAddCandidate}
              className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-4">
                {/* Image Preview Area */}
                <div className="flex justify-center mb-6">
                  <div className="w-28 h-28 rounded-3xl bg-slate-100 border-2 border-dashed border-primary/20 flex items-center justify-center overflow-hidden transition-all">
                    {newCandidate.image_url ? (
                      <img
                        src={newCandidate.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera size={32} className="text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                    />
                    <input
                      type="text"
                      required
                      value={newCandidate.full_name}
                      onChange={(e) =>
                        setNewCandidate((prev) => ({
                          ...prev,
                          full_name: e.target.value,
                        }))
                      }
                      placeholder="e.g. Maya Chen"
                      className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                    Position
                  </label>
                  <div className="relative group">
                    <LayoutDashboard
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                    />
                    <select
                      value={newCandidate.position}
                      onChange={(e) =>
                        setNewCandidate((prev) => ({
                          ...prev,
                          position: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none appearance-none">
                      <option>President</option>
                      <option>Vice President</option>
                      <option>Secretary</option>
                      <option>Treasurer</option>
                      <option>Auditor</option>
                      <option>PRO</option>
                    </select>
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                    Organization
                  </label>
                  <div className="relative group">
                    <Shield
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                    />
                    <input
                      type="text"
                      value={newCandidate.organization}
                      onChange={(e) =>
                        setNewCandidate((prev) => ({
                          ...prev,
                          organization: e.target.value,
                        }))
                      }
                      placeholder="e.g. Independent"
                      className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Partylist */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                    Partylist
                  </label>
                  <div className="relative group">
                    <Briefcase
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                    />
                    <select
                      value={newCandidate.partylist}
                      onChange={(e) =>
                        setNewCandidate((prev) => ({
                          ...prev,
                          partylist: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none appearance-none">
                      <option disabled selected value="">
                        Select Partylist
                      </option>
                      <option value="Independent">Independent</option>

                      {partylists.map((pl) => (
                        <option key={pl.id} value={pl.name}>
                          {pl.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Platform */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                    Platform of Government
                  </label>
                  <div className="relative group">
                    <Megaphone
                      size={18}
                      className="absolute left-4 top-4 text-slate-400 group-focus-within:text-primary transition-colors"
                    />
                    <textarea
                      rows={3}
                      value={newCandidate.platform}
                      onChange={(e) =>
                        setNewCandidate((prev) => ({
                          ...prev,
                          platform: e.target.value,
                        }))
                      }
                      placeholder="Outline core platforms and goals..."
                      className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Quotes */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                    Quotes
                  </label>
                  <div className="relative group">
                    <Quote
                      size={18}
                      className="absolute left-4 top-4 text-slate-400 group-focus-within:text-primary transition-colors"
                    />
                    <textarea
                      required
                      rows={3}
                      value={newCandidate.quotes}
                      onChange={(e) =>
                        setNewCandidate((prev) => ({
                          ...prev,
                          quotes: e.target.value,
                        }))
                      }
                      placeholder="Enter candidate's quote or platform summary..."
                      className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Image Upload Trigger (Hidden Input + Button) */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary/50 transition-all font-bold text-sm uppercase tracking-wider">
                    {uploading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Upload size={18} />
                    )}
                    {newCandidate.image_url
                      ? "Change Candidate Photo"
                      : "Upload Candidate Photo"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all active:scale-[0.98]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding || uploading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
                  {isAdding || uploading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Add Candidate"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Activity>
    </div>
  );
}
