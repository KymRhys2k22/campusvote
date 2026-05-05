import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  User,
  Hash,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Divider from "../components/Divider";
import ProgressButtonBar from "../components/ProgressButtonBar";
import gsap from "gsap";
import { supabase } from "../lib/supabase";

function StudentLoginInfo() {
  const { login } = useAuth();
  const [studentNumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isElectionOpen, setIsElectionOpen] = useState(true);
  const [fetchingToggle, setFetchingToggle] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [pendingStudent, setPendingStudent] = useState(null);
  const progressButtonBarRef = useRef(null);
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const dataSectionRef = useRef(null);
  const buttonRef = useRef(null);

  const organizationLogo = [
    {
      acronym: "SHS_CC",
      OrganizationFullName: "Senior High School Coordinating Council",
    },
    {
      acronym: "SHS_RAC",
      OrganizationFullName: "SHS Recreation and Athletics Club",
    },
    { acronym: "JES", OrganizationFullName: "Junior Entrepreneurs Society" },
    { acronym: "STEM_SC", OrganizationFullName: "STEM Student Committee" },
    { acronym: "PARSOC", OrganizationFullName: "Parliamentary Society" },
    {
      acronym: "SAMFIL",
      OrganizationFullName: "Samahan ng mga Mag-aaral sa Filipino",
    },
    { acronym: "3T", OrganizationFullName: "Tamaraw Tech Troop" },
    { acronym: "ARTAMS", OrganizationFullName: "Artistic Tamaraws" },
    { acronym: "YFC", OrganizationFullName: "Youth for Christ" },
    { acronym: "ENC", OrganizationFullName: "Every Nation Campus" },
    { acronym: "TGH", OrganizationFullName: "The Green Herald" },
  ];

  useLayoutEffect(() => {
    if (fetchingToggle || !isElectionOpen) return;

    const ctx = gsap.context(() => {
      if (!headerRef.current || !formRef.current || !buttonRef.current) return;

      // Header Animation
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      // Form Elements Animation
      const formElements = formRef.current.querySelectorAll(".animate-field");
      if (formElements.length > 0) {
        gsap.from(formElements, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3,
        });
      }

      // Button Animation
      gsap.fromTo(
        buttonRef.current,
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.5,
          clearProps: "all",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [fetchingToggle, isElectionOpen]);

  useEffect(() => {
    const fetchToggleStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("toggle")
          .select("open")
          .eq("id", 1)
          .single();
        if (error) throw error;
        setIsElectionOpen(data.open);
      } catch (err) {
        console.error("Failed to fetch election status:", err);
      } finally {
        setFetchingToggle(false);
      }
    };
    fetchToggleStatus();
  }, []);

  useLayoutEffect(() => {
    if (studentData) {
      gsap.from(dataSectionRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(progressButtonBarRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out",
      });
    }
  }, [studentData]);

  useEffect(() => {
    if (studentData) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
      //document.body.style.overflowY = "hidden";
      gsap.to(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.5,
        ease: "none",
      });
    }
  }, [studentData]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStudentData(null);

    try {
      const response = await fetch(
        `https://opensheet.elk.sh/${import.meta.env.VITE_GOOGLE_SHEET}/students`,
      );
      if (!response.ok) throw new Error("Failed to fetch student data");

      const students = await response.json();
      const student = students.find(
        (s) =>
          s.student_number === studentNumber.trim() &&
          s.email_address.toLowerCase() === email.trim().toLowerCase(),
      );

      if (student) {
        // Check if student has already voted
        const { data: existingVote, error: checkError } = await supabase
          .from("voted")
          .select("id")
          .eq("student_number", student.student_number)
          .maybeSingle();

        if (checkError) {
          console.error("Error checking vote status:", checkError);
          setError("Failed to verify voting status. Please try again.");
          setLoading(false);
          return;
        }

        if (existingVote) {
          setError("You have already voted.");
          setLoading(false);
          return;
        }

        setPendingStudent(student);
        setShowPrivacyModal(true);
      } else {
        setError("Student not found. Please check your credentials.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(
        "Unable to connect to the verification server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAgreePrivacy = async () => {
    if (!pendingStudent) return;
    setLoading(true);
    try {
      // Insert into voted table as requested
      const { error: insertError } = await supabase.from("voted").insert({
        student_number: pendingStudent.student_number,
        email_address: pendingStudent.email_address,
        data_privacy: "agree",
      });

      if (insertError) {
        console.error("Error inserting to voted table:", insertError);
        if (insertError.code === "23505") {
          // unique constraint violation
          setError("You have already voted.");
          setShowPrivacyModal(false);
          return;
        }
        setError(
          `${insertError.message} (${insertError.details || "No details"})`,
        );
        return;
      }

      setStudentData(pendingStudent);
      login(pendingStudent);
      setShowPrivacyModal(false);
    } catch (err) {
      console.error("Privacy agreement error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="font-display text-slate-900 min-h-screen flex flex-col items-center justify-center p-4">
      {!isElectionOpen && (
        <div className="w-full relative overflow-hidden mb-12 py-4">
          <div className="absolute inset-y-0 left-0 w-20 z-10 bg-linear-to-r from-background-light to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-20 z-10 bg-linear-to-l from-background-light to-transparent"></div>
          <div className="flex animate-marquee gap-12 items-center">
            {[...organizationLogo, ...organizationLogo].map((logo, index) => (
              <div key={index} className="relative group">
                <img
                  src={`/${logo.acronym}.webp`}
                  alt="Logo"
                  className="group-hover:scale-110 transition-all duration-300 ease-in-out group-hover:z-30 border-border w-24 h-24 md:w-36 md:h-36 object-contain shrink-0  group-hover:grayscale-0 cursor-pointer"
                />
                <p className="hidden group-hover:absolute group-hover:top-5 group-hover:right-3 group-hover:left-0 group-hover:bottom-2 group-hover:flex group-hover:items-center group-hover:justify-center group-hover:bg-black/60 group-hover:text-white transition-all duration-300 ease-in-out text-center mt-2">
                  {logo.OrganizationFullName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {fetchingToggle ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 size={48} className="animate-spin text-primary" />
        </div>
      ) : !isElectionOpen ? (
        <div className="text-center p-8 bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-500 max-w-lg">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 text-red-500 mb-6 border border-red-500/20">
            <AlertCircle size={48} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-4">
            Election is <span className="text-red-500">Closed</span>
          </h1>
          <p className="text-slate-500 font-medium">
            The voting period has ended or is currently paused. Please wait for
            further announcements from the election committee.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden p-6 md:p-12 transition-all duration-500">
          {/* Left Column: Branding (Visible on Desktop) */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-2 ring-1 ring-primary/20">
              <img src="/student.svg" alt="Logo" className="w-20 h-20" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tight text-slate-800 leading-none">
                Student <br />
                <span className="text-primary underline decoration-accent/30 decoration-8 underline-offset-4">
                  Identity
                </span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
                Welcome to the digital election portal. Please verify your
                credentials to cast your ballot securely.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 p-5 rounded-2xl border border-white/40 shadow-sm">
                <CheckCircle2 className="text-emerald-500 mb-2" size={24} />
                <h4 className="text-sm font-bold">Secure</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Encrypted Transmission
                </p>
              </div>
              <div className="bg-white/60 p-5 rounded-2xl border border-white/40 shadow-sm">
                <AlertCircle className="text-accent mb-2" size={24} />
                <h4 className="text-sm font-bold">One Vote</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Single Session Policy
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Login Form */}
          <div className="flex flex-col w-full max-w-md mx-auto">
            {/* Header (Mobile View) */}
            <header ref={headerRef} className="lg:hidden text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6 shadow-sm border border-primary/5">
                <img src="/student.svg" alt="Logo" className="w-20 h-20" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Student Login
              </h1>
              <p className="text-slate-500 font-medium">
                Verify your identity to proceed with the election.
              </p>
            </header>

            <main className="space-y-8">
              <form ref={formRef} onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-4">
                  {/* Student Number Input */}
                  <div className="animate-field">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                      Student Number
                    </label>
                    <div className="relative group">
                      <Hash
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                      />
                      <input
                        type="number"
                        required
                        placeholder="e.g. 20000000015"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                        className="placeholder:text-slate-400 w-full bg-white border-none rounded-xl py-3.5 pl-12 pr-4 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="animate-field">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block px-1">
                      Institutional Email
                    </label>
                    <div className="relative group">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                      />
                      <input
                        type="email"
                        required
                        placeholder="e.g. student@feualabang.edu.ph"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="placeholder:text-slate-400 w-full bg-white border-none rounded-xl py-3.5 pl-12 pr-4 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={loading || !!studentData}
                  className="w-full bg-accent text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]">
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : studentData ? (
                    <>
                      <CheckCircle2 size={20} />
                      Verified
                    </>
                  ) : (
                    "Verify Credentials"
                  )}
                </button>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                    <AlertCircle size={18} />
                    <p>{error}</p>
                  </div>
                )}
              </form>

              {studentData && (
                <div
                  ref={dataSectionRef}
                  className="mt-8 space-y-6 p-6 bg-primary/5 border border-primary/10 rounded-4xl animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-3 mb-2 px-1">
                    <CheckCircle2 size={24} className="text-emerald-500" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">
                      Student Record Found
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1.5 block px-1">
                        Full Name
                      </label>
                      <div className="px-5 py-3.5 bg-white rounded-xl text-slate-800 font-semibold ring-1 ring-primary/10 shadow-sm">
                        {studentData.name}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1.5 block px-1">
                        Academic Section
                      </label>
                      <div className="px-5 py-3.5 bg-white rounded-xl text-slate-800 font-semibold ring-1 ring-primary/10 shadow-sm">
                        {studentData.section}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {isElectionOpen && !fetchingToggle && (
        <ProgressButtonBar
          navigateTo={
            studentData ? `/ballot/${studentData.student_number}` : ""
          }
          current={studentData ? 1 : 0}
          total={3}
          ref={progressButtonBarRef}
          text={"Start Voting Session"}
          disabled={!studentData}
        />
      )}

      {/* Data Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => !loading && setShowPrivacyModal(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 leading-none">
                    Data Privacy Policy
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
                    Review and Consent
                  </p>
                </div>
              </div>
              <button
                onClick={() => !loading && setShowPrivacyModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-2 md:p-4 bg-slate-50/50">
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <img
                  src="/data_privacy.png"
                  alt="Data Privacy Policy"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex flex-col sm:flex-row gap-3">
              <button
                disabled={loading}
                onClick={handleAgreePrivacy}
                className="flex-1 px-6 py-3.5 rounded-xl bg-accent text-slate-900 font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    I Agree and Consent
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentLoginInfo;
