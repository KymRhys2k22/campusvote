import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  User,
  Hash,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Divider from "../components/Divider";
import ProgressButtonBar from "../components/ProgressButtonBar";
import gsap from "gsap";

function StudentLoginInfo() {
  const { login } = useAuth();
  const [studentNumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const progressButtonBarRef = useRef(null);
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const dataSectionRef = useRef(null);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      // Form Elements Animation
      const formElements = formRef.current.querySelectorAll(".animate-field");
      gsap.from(formElements, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3,
      });

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
        "https://opensheet.elk.sh/1pbv6_9rWC8ldhlZoUkxyB3KY-6nwaNh0HLFzncsvCBI/students",
      );
      if (!response.ok) throw new Error("Failed to fetch student data");

      const students = await response.json();
      const student = students.find(
        (s) =>
          s.student_number === studentNumber.trim() &&
          s.email_address.toLowerCase() === email.trim().toLowerCase(),
      );

      if (student) {
        setStudentData(student);
        login(student);
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

  return (
    <div
      ref={containerRef}
      className="font-display text-slate-900 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden p-6 md:p-12 transition-all duration-500">
        
        {/* Left Column: Branding (Visible on Desktop) */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-2 ring-1 ring-primary/20">
            <User size={44} />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tight text-slate-800 leading-none">
              Student <br />
              <span className="text-primary underline decoration-accent/30 decoration-8 underline-offset-4">Identity</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
              Welcome to the digital election portal. Please verify your credentials to cast your ballot securely.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 p-5 rounded-2xl border border-white/40 shadow-sm">
              <CheckCircle2 className="text-emerald-500 mb-2" size={24} />
              <h4 className="text-sm font-bold">Secure</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Encrypted Transmission</p>
            </div>
            <div className="bg-white/60 p-5 rounded-2xl border border-white/40 shadow-sm">
              <AlertCircle className="text-accent mb-2" size={24} />
              <h4 className="text-sm font-bold">One Vote</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Single Session Policy</p>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="flex flex-col w-full max-w-md mx-auto">
          {/* Header (Mobile View) */}
          <header
            ref={headerRef}
            className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6 shadow-sm border border-primary/5">
              <User size={40} />
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
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Student Record Found</h3>
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

      <ProgressButtonBar
        navigateTo={studentData ? `/ballot/${studentData.student_number}` : ""}
        current={studentData ? 1 : 0}
        total={3}
        ref={progressButtonBarRef}
        text={"Start Voting Session"}
        disabled={!studentData}
      />
    </div>
  );
}

export default StudentLoginInfo;
