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
  Edit,
  Trash2,
  Check,
} from "lucide-react";
import { supabase } from "../lib/supabase"; // Our Supabase client for database operations
import gsap from "gsap";
import { Flip } from "gsap/all"; // GSAP Flip plugin for smooth layout transitions
import VerticalCandidateCardList from "../components/VerticalCandidateCardList";

// Register the Flip plugin with GSAP to enable its features
gsap.registerPlugin(Flip);

const organizationTitles = [
  "President",
  "Vice President",
  "Secretary",
  "Assistant Secretary",
  "Treasurer",
  "Chairman",
  "Chairwoman",
  "Vice Chairman",
  "Vice Chairwoman",
  "Editor-in-Chief",
  "Associate Editor",
  "Managing Editor",
  "President for Internal",
  "Vice President for Internal",
  "Vice President for External",
  "Public Relations Officer",
  "Auditor",
  "Protocol Officer",
  "Public Information Officer",
  "Grade 12 Representative",
  "Pangulo",
  "Pangalawang Pangulo",
  "Kalihim",
  "Kawani ng Ugnayang Pampubliko",
];

const studentOrganizations = [
  {
    acronym: "SHS CC",
    OrganizationFullName: "Senior High School Coordinating Council",
  },
  {
    acronym: "SHS_RAC",
    OrganizationFullName: "SHS Recreation and Athletics Club",
  },
  { acronym: "JES", OrganizationFullName: "Junior Entrepreneurs Society" },
  { acronym: "STEM SC", OrganizationFullName: "STEM Student Committee" },
  { acronym: "PARSOC", OrganizationFullName: "Parliamentary Society" },
  {
    acronym: "SAMFIL",
    OrganizationFullName: "Samahan ng mga Mag-aaral sa Filipino",
  },
  { acronym: "3T", OrganizationFullName: "Tamaraw Tech Troop" },
  { acronym: "ARTAMS", OrganizationFullName: "Artistic Tamaraws" },
  { acronym: "FEUSED", OrganizationFullName: "FEU Southern Extensive Dancers" },
  { acronym: "TAMS", OrganizationFullName: "Tamaraws Musical Society" },
  { acronym: "TNT", OrganizationFullName: "Teatrong Tamaraw" },
  { acronym: "YFC", OrganizationFullName: "Youth for Christ" },
  { acronym: "ENC", OrganizationFullName: "Every Nation Campus" },
  { acronym: "TGH", OrganizationFullName: "The Green Herald" },
];

/**
 * Comelec Component
 * This is the management portal for the Election Commission (COMELEC).
 * It handles admin authentication, candidate management (add/view),
 * and provides real-time election statistics.
 */
export default function Comelec() {
  // --- AUTHENTICATION STATE ---
  // We use sessionStorage to persist the login state during the current browser session.
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("comelec_session") === "active";
  });

  // --- CONFIGURATION ---
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  // --- LOGIN FORM STATE ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Controls the login button's loading spinner

  // --- ELECTION DATA STATE ---
  const [candidates, setCandidates] = useState([]); // Array of all candidates from the database
  const [partylists, setPartylists] = useState([]); // Array of all available partylists
  const [isFetchingCandidates, setIsFetchingCandidates] = useState(false); // Loading state for data fetching
  const [selectedOrgs, setSelectedOrgs] = useState([]); // Filter state for selected organizations
  //-- COMELEC USER --
  const [comelecUser, setComelecUser] = useState(() => {
    return sessionStorage.getItem("comelec_user");
  });
  // --- CANDIDATE MANAGEMENT STATE ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [newCandidate, setNewCandidate] = useState({
    full_name: "",
    position: "President",
    quotes: "",
    image_url: "",
    organization: "",
    acronym: "",
    partylist: "",
    platform: "",
  });

  // --- MANAGEMENT STATE ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- REFS FOR ANIMATIONS & INTERACTIONS ---
  const loginContainerRef = useRef(null);
  const headerRef = useRef(null);
  const statsContainerRef = useRef(null);
  const overviewHeaderRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const modalContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollContainerRefs = useRef({});
  const chipsContainerRef = useRef(null);
  const flipStateRef = useRef(null); // Stores the state of elements before a FLIP animation

  // CONSTANTS
  const POSITIONS = organizationTitles;

  // --- DERIVED DATA ---
  // We extract unique organizations from the candidates array.
  // If a candidate has no organization, we label them as "Independent".
  const organizations = [
    ...new Set(candidates.map((c) => c.organization || "Independent")),
  ];

  // Calculate the sum of all votes cast across all candidates.
  const totalVotes = candidates.reduce(
    (acc, c) => acc + (c.vote_count || 0),
    0,
  );

  // 2. Sync logic
  useEffect(() => {
    // -- Function to sync state with storage --
    const handleStorageChange = () => {
      setComelecUser(sessionStorage.getItem("comelec_user"));
    };

    // Listen for changes (useful if using multiple tabs)
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /**
   * handleChipScroll
   * Smoothly scrolls the organization filter chips horizontally.
   */
  const handleChipScroll = (direction) => {
    if (chipsContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      chipsContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  /**
   * fetchCandidates
   * Retrieves all candidate records from the Supabase "candidates" table.
   * We order them by position to maintain a consistent UI layout.
   */
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

  /**
   * fetchPartylists
   * Retrieves all available partylists from the "partylist" table.
   */
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

  // --- ENTRANCE ANIMATIONS (GSAP) ---
  // This effect runs when the login state changes.
  useGSAP(() => {
    if (!isLoggedIn) {
      // Login Entrance: Animate header, card, and footer elements into view.
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
      // Dashboard Entrance: Animate the header, stat cards, and overview section.
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

  // --- CANDIDATE CARD & FLIP ANIMATIONS ---
  // This effect handles the smooth transitions of candidate cards,
  // especially when they change positions due to real-time vote updates.
  useGSAP(
    () => {
      if (isLoggedIn && candidates.length > 0) {
        // Entrance animation for NEWLY rendered candidate cards.
        gsap.fromTo(
          ".candidate-card:not([data-animated='true'])",
          {
            opacity: 0,
            y: 20,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: { amount: 0.5 },
            ease: "back.out(1.2)",
            overwrite: true,
            onStart: function () {
              this.targets().forEach((el) =>
                el.setAttribute("data-animated", "true"),
              );
            },
          },
        );
      }

      // FLIP Animation: If we have a stored state, animate the transition from that state.
      // This makes the cards "slide" to their new ranking smoothly.
      if (flipStateRef.current) {
        Flip.from(flipStateRef.current, {
          duration: 0.8,
          ease: "power2.out",
          zIndex: 10,
        });
        flipStateRef.current = null;
      }
    },
    {
      dependencies: [candidates, isLoggedIn, selectedOrgs],
      scope: cardsContainerRef,
    },
  );

  // --- MODAL ANIMATIONS ---
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

  useGSAP(() => {
    if (showEditModal) {
      gsap.fromTo(
        ".modal-backdrop",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
      gsap.fromTo(
        ".edit-modal-content",
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
      );
    }
  }, [showEditModal]);

  useGSAP(() => {
    if (showDeleteConfirm) {
      gsap.fromTo(
        ".confirm-backdrop",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
      gsap.fromTo(
        ".confirm-content",
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    }
  }, [showDeleteConfirm]);

  // --- SESSION MANAGEMENT ---
  // On first load, check if there's an active session in local storage.
  useEffect(() => {
    const session = sessionStorage.getItem("comelec_session");
    if (session === "active") {
      setIsLoggedIn(true);
    }
  }, []);

  // --- INITIAL DATA FETCH ---
  // Once logged in, fetch the necessary data from Supabase.
  useEffect(() => {
    if (isLoggedIn) {
      fetchCandidates();
      fetchPartylists();
    }
  }, [isLoggedIn]);

  // --- REAL-TIME UPDATES (SUPABASE) ---
  // This effect sets up a subscription to listen for ANY changes in the "candidates" table.
  useEffect(() => {
    if (!isLoggedIn) return;

    const channel = supabase
      .channel("live_results")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for INSERT, UPDATE, DELETE
          schema: "public",
          table: "candidates",
        },
        (payload) => {
          console.log("Realtime Payload Received:", payload);
          if (payload.new) {
            // Before updating state, capture the current position of cards for FLIP animation.
            const flipItems = document.querySelectorAll(".candidate-flip-item");
            if (flipItems.length > 0) {
              flipStateRef.current = Flip.getState(flipItems);
            }

            // Update the local state with the new data from Supabase.
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

    // Cleanup: Remove the subscription when the component unmounts or user logs out.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn]);

  /**
   * handleLogin
   * Authenticates the user based on environment variables.
   * On success, sets the session cookie and updates the login state.
   */
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Parse multi-account configuration from .env
    let comelecAccounts = [];
    try {
      comelecAccounts = JSON.parse(
        import.meta.env.VITE_COMELEC_ACCOUNTS || "[]",
      );
    } catch (err) {
      console.error("Error parsing comelec accounts from env:", err);
    }

    setTimeout(() => {
      const matchedAccount = comelecAccounts.find(
        (acc) => acc.u === username && acc.p === password,
      );

      if (matchedAccount) {
        setIsLoggedIn(true);
        sessionStorage.setItem("comelec_session", "active");
        sessionStorage.setItem("comelec_user", username);
      } else {
        setError("Invalid Comelec credentials. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  /**
   * handleImageUpload
   * Uploads a selected file to Cloudinary.
   * It uses FormData to send the file and upload preset to the Cloudinary API.
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Requirement: Enter name first to help name the file in Cloudinary.
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

    // Sanitize the candidate name for use as the Cloudinary Public ID.
    const sanitizedName = newCandidate.full_name
      ? newCandidate.full_name.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : file.name.split(".")[0];
    formData.append("public_id", `${sanitizedName}`);

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
      // Store the resulting URL in the candidate state.
      setNewCandidate((prev) => ({ ...prev, image_url: data.secure_url }));
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /**
   * handleLogout
   * Clears the session and resets the local state.
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("comelec_session");
    setCandidates([]);
  };

  /**
   * handleAddCandidate
   * Inserts the new candidate data into the Supabase 'candidates' table.
   */
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
      acronym: newCandidate.acronym,
      partylist: newCandidate.partylist,
      platform: newCandidate.platform,
      vote_count: 0, // Initialize with 0 votes
    };

    console.log("Attempting to insert candidate:", candidateData);

    try {
      const { data, error: insertError } = await supabase
        .from("candidates")
        .insert([candidateData]);

      if (insertError) throw insertError;

      console.log("Candidate Added Successfully:", data);
      setShowAddModal(false);
      // Reset form fields
      setNewCandidate({
        full_name: "",
        position: "President",
        quotes: "",
        image_url: "",
        organization: "",
        acronym: "",
        partylist: "",
        platform: "",
      });
      fetchCandidates(); // Refresh list to show the new candidate
    } catch (err) {
      console.error("Error adding candidate:", err);
      setError(
        err.message || "Failed to add candidate. Please check your connection.",
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("candidates")
        .update({
          full_name: editingCandidate.full_name,
          position: editingCandidate.position,
          organization: editingCandidate.organization,
          acronym: editingCandidate.acronym,
          partylist: editingCandidate.partylist,
          platform: editingCandidate.platform,
          quotes: editingCandidate.quotes,
          image_url: editingCandidate.image_url,
        })
        .eq("id", editingCandidate.id);

      if (updateError) throw updateError;

      setShowEditModal(false);
      setEditingCandidate(null);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update candidate.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCandidate = async () => {
    if (!candidateToDelete) return;
    setIsProcessing(true);
    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("candidates")
        .delete()
        .eq("id", candidateToDelete.id);

      if (deleteError) throw deleteError;

      setShowDeleteConfirm(false);
      setCandidateToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete candidate.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const sanitizedName = editingCandidate.full_name
      ? editingCandidate.full_name.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : `update_${Date.now()}`;
    formData.append("public_id", `${sanitizedName}`);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setEditingCandidate((prev) => ({ ...prev, image_url: data.secure_url }));
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // --- RENDER PHASE ---

  // If the user is NOT logged in, we render the Login Screen.
  if (!isLoggedIn) {
    return (
      <div
        ref={loginContainerRef}
        className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 login-header">
            <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-primary/10 text-primary mb-6 shadow-sm border border-primary/5">
              <img
                src="https://www.svgrepo.com/show/217141/admin.svg"
                alt=""
                className="w-60 h-60"
              />
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

  // If the user IS logged in, we render the Dashboard.
  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col relative overflow-x-hidden">
      {/* HEADER SECTION: Includes logout button and branding */}
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
        {/* STATISTICS CARDS: Displaying real-time election numbers */}
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
          {/* ELECTION OVERVIEW HEADER & DATA REFRESH */}
          <div
            ref={overviewHeaderRef}
            className="flex items-center justify-between overview-header">
            <h2 className="font-bold text-xl tracking-tight">
              Election Overview
            </h2>
            <div className="flex items-center rounded-full bg-white p-2 ring-1 ring-primary/10">
              <button
                onClick={fetchCandidates}
                className={` text-slate-400 hover:text-primary transition-colors ${isFetchingCandidates && "animate-spin"}`}
                title="Refresh Data">
                <RefreshCw size={20} className="" />
              </button>
            </div>
          </div>

          {/* DASHBOARD CONTENT: Filters and Candidate Lists */}
          {candidates.length > 0 && (
            <div className="relative group/chips flex items-center">
              <button
                onClick={() => handleChipScroll("left")}
                className="absolute left-0 z-10 p-1.5 -ml-4 bg-white border border-slate-200 text-slate-500 rounded-full shadow-md opacity-0 group-hover/chips:opacity-100 transition-opacity hover:text-primary hover:border-primary/50 hidden md:block">
                <ChevronLeft size={16} />
              </button>

              <div
                ref={chipsContainerRef}
                className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar w-full scroll-smooth mask-edges px-1">
                <button
                  onClick={() => setSelectedOrgs([])}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                    selectedOrgs.length === 0
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
                  }`}>
                  All Organizations
                </button>
                {organizations.map((org) => {
                  const isActive = selectedOrgs.includes(org);
                  return (
                    <button
                      key={org}
                      onClick={() => {
                        setSelectedOrgs((prev) =>
                          prev.includes(org)
                            ? prev.filter((o) => o !== org)
                            : [...prev, org],
                        );
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
                      }`}>
                      {org.length > 8 ? `${org.slice(0, 9)}...` : org}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handleChipScroll("right")}
                className="absolute right-0 z-10 p-1.5 -mr-4 bg-white border border-slate-200 text-slate-500 rounded-full shadow-md opacity-0 group-hover/chips:opacity-100 transition-opacity hover:text-primary hover:border-primary/50 hidden md:block">
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {isFetchingCandidates && candidates.length === 0 ? (
            <div className="flex items-center pt-24 justify-center h-full w-full">
              <RefreshCw size={40} className="text-primary animate-spin" />
            </div>
          ) : candidates.length > 0 ? (
            <div ref={cardsContainerRef} className="space-y-12">
              {/* GROUPING LOGIC: We map over organizations, then filter candidates for each. */}
              {(selectedOrgs.length === 0 ? organizations : selectedOrgs).map(
                (org) => {
                  const orgCandidates = candidates.filter(
                    (c) => (c.organization || "Independent") === org,
                  );

                  if (orgCandidates.length === 0) return null;

                  return (
                    <div
                      key={org}
                      className="space-y-10  bg-slate-50 ring-2 shadow-md ring-slate-200 pt-4 md:px-4 px-0 rounded-3xl pb-12 last:border-0">
                      <div className="flex items-center gap-4 relative overflow-hidden">
                        <h2 className="md:text-3xl ml-2 md:ml-0 text-xl  font-black text-slate-800 uppercase tracking-tighter">
                          {org}
                        </h2>
                        <span className="text-center md:px-3 px-2  py-1 bg-primary/10 mr-2 md:mr-0 text-primary text-xs font-black rounded-lg">
                          {orgCandidates.length} Candidates
                        </span>
                      </div>
                      <div className="space-y-12 pl-2">
                        {/* SUB-GROUPING: Within each organization, group candidates by POSITION */}
                        {POSITIONS.map((position) => {
                          const candidatesInPosition = orgCandidates
                            .filter((c) => c.position === position)
                            .sort(
                              (a, b) =>
                                (b.vote_count || 0) - (a.vote_count || 0),
                            );

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

                              <div className="px-2 space-y-4 pt-3">
                                {candidatesInPosition.map((candidate) => (
                                  <div
                                    key={candidate.id}
                                    data-flip-id={`flip-vert-${candidate.id}`}
                                    className="candidate-flip-item relative w-full block">
                                    <VerticalCandidateCardList
                                      candidate={candidate}
                                      onEdit={(c) => {
                                        setEditingCandidate({ ...c });
                                        setShowEditModal(true);
                                      }}
                                      onDelete={(c) => {
                                        setCandidateToDelete(c);
                                        setShowDeleteConfirm(true);
                                        fetchCandidates();
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                },
              )}
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

      {/* Floating Action Button (FAB): Triggers the modal to add a new candidate */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-accent/80 text-slate-900 rounded-2xl shadow-2xl shadow-accent/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50 group">
        <Plus
          size={32}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      {/* Add Candidate Modal */}
      {/* Add Candidate Modal: A multi-step form (Upload -> Details -> Submit) */}
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
                      placeholder="e.g. Dela Cruz, Juan"
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
                      <option disabled value="">
                        Select Position
                      </option>
                      {organizationTitles.map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
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
                    <select
                      value={newCandidate.organization}
                      onChange={(e) => {
                        const orgName = e.target.value;
                        const orgObj = studentOrganizations.find(
                          (o) => o.OrganizationFullName === orgName,
                        );
                        setNewCandidate((prev) => ({
                          ...prev,
                          organization: orgName,
                          acronym: orgObj ? orgObj.acronym : "IND",
                        }));
                      }}
                      className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none appearance-none">
                      <option disabled value="">
                        Select Organization
                      </option>
                      {studentOrganizations.map((org) => (
                        <option
                          key={org.acronym}
                          value={org.OrganizationFullName}>
                          {org.OrganizationFullName}
                        </option>
                      ))}
                      <option value="Independent">Independent</option>
                    </select>
                  </div>
                </div>

                {/* Acronym Display */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                    Organization Acronym
                  </label>
                  <div className="relative group">
                    <Shield
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-50"
                    />
                    <input
                      type="text"
                      disabled
                      value={newCandidate.acronym}
                      placeholder="Automatically filled..."
                      className="w-full bg-slate-100 border-none rounded-xl py-3.5 pl-12 pr-4 ring-1 ring-slate-200 text-slate-500 font-bold outline-none cursor-not-allowed"
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

      {/* ── Candidate Management Modals ───────────────────────────── */}

      {/* 1. Edit Candidate Modal */}
      {showEditModal && editingCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm modal-backdrop"
            onClick={() => !isProcessing && setShowEditModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-primary/10 overflow-hidden edit-modal-content flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-primary/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                  Edit <span className="text-primary">Candidate</span>
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Modify identity and platform
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateCandidate}
              className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              {/* Photo Upload Area */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-4xl bg-slate-50 border-2 border-dashed border-primary/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/40">
                    {editingCandidate.image_url ? (
                      <img
                        src={editingCandidate.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera size={32} className="text-slate-300" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                        <RefreshCw
                          size={24}
                          className="text-primary animate-spin"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                    className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                    <Upload size={16} />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">
                    Candidate Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      required
                      type="text"
                      value={editingCandidate.full_name}
                      onChange={(e) =>
                        setEditingCandidate({
                          ...editingCandidate,
                          full_name: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Grid for Position & Org */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">
                      Position
                    </label>
                    <div className="relative">
                      <LayoutDashboard
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <select
                        value={editingCandidate.position}
                        onChange={(e) =>
                          setEditingCandidate({
                            ...editingCandidate,
                            position: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
                        {POSITIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">
                      Organization
                    </label>
                    <div className="relative">
                      <Shield
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <select
                        value={editingCandidate.organization}
                        onChange={(e) => {
                          const orgName = e.target.value;
                          const orgObj = studentOrganizations.find(
                            (o) => o.OrganizationFullName === orgName,
                          );
                          setEditingCandidate({
                            ...editingCandidate,
                            organization: orgName,
                            acronym: orgObj ? orgObj.acronym : "IND",
                          });
                        }}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
                        {studentOrganizations.map((o) => (
                          <option
                            key={o.acronym}
                            value={o.OrganizationFullName}>
                            {o.OrganizationFullName}
                          </option>
                        ))}
                        <option value="Independent">Independent</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">
                      Organization Acronym
                    </label>
                    <div className="relative">
                      <Shield
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-50"
                      />
                      <input
                        type="text"
                        disabled
                        value={editingCandidate.acronym}
                        className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 ring-1 ring-slate-200 text-slate-500 font-bold outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Partylist */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">
                    Partylist
                  </label>
                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      value={editingCandidate.partylist}
                      onChange={(e) =>
                        setEditingCandidate({
                          ...editingCandidate,
                          partylist: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none">
                      <option disabled value="">
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
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">
                    Platform Summary
                  </label>
                  <div className="relative">
                    <Megaphone
                      size={18}
                      className="absolute left-4 top-4 text-slate-400"
                    />
                    <textarea
                      rows={3}
                      value={editingCandidate.platform}
                      onChange={(e) =>
                        setEditingCandidate({
                          ...editingCandidate,
                          platform: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Quotes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">
                    Official Quote
                  </label>
                  <div className="relative">
                    <Quote
                      size={18}
                      className="absolute left-4 top-4 text-slate-400"
                    />
                    <textarea
                      rows={3}
                      value={editingCandidate.quotes}
                      onChange={(e) =>
                        setEditingCandidate({
                          ...editingCandidate,
                          quotes: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4 pb-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || uploading}
                  className="flex-[2] px-6 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {isProcessing ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Check size={18} /> Update Details
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Delete Confirmation Modal */}
      {showDeleteConfirm && candidateToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md confirm-backdrop"
            onClick={() => !isProcessing && setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl border border-red-100 overflow-hidden confirm-content p-8 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-3">
              Delete <span className="text-red-500">Candidate?</span>
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Are you sure you want to remove{" "}
              <span className="font-bold text-slate-800">
                {candidateToDelete.full_name}
              </span>
              ? This action cannot be undone and will remove all their data from
              the election.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteCandidate}
                disabled={isProcessing}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                {isProcessing ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  "Confirm Deletion"
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isProcessing}
                className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">
                Keep Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
