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
      className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Header */}
      <header
        ref={headerRef}
        className=" rounded-b-4xl md:rounded-b-full backdrop-blur-sm bg-white/80 dark:bg-background-dark/80 sticky top-0 z-40 ios-blur border-b border-primary/10">
        <div className="px-5 py-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <User size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Student Login
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Verify your identity to proceed with the election.
          </p>
        </div>
      </header>

      <main className="grow mt-12 mb-24  px-6 py-8 max-w-md mx-auto w-full">
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
                  className="placeholder:text-slate-400 w-full bg-white dark:bg-slate-800/50 border-none rounded-xl py-3.5 pl-12 pr-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all outline-none"
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
                  className="placeholder:text-slate-400 w-full bg-white dark:bg-slate-800/50 border-none rounded-xl py-3.5 pl-12 pr-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all outline-none"
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

        {/* Auto filled Section */}
        {studentData && (
          <div
            ref={dataSectionRef}
            className="mt-12 mb-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Divider />

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block px-1">
                  Full Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={studentData.name}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block px-1">
                  Section
                </label>
                <input
                  type="text"
                  readOnly
                  value={studentData.section}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Bar */}

      <ProgressButtonBar
        navigateTo={studentData ? `/ballot/${studentData.student_number}` : ""}
        progress={1}
        disabled={!studentData}
        ref={progressButtonBarRef}
        text={"Start Voting Session"}
      />
    </div>
  );
}

export default StudentLoginInfo;
