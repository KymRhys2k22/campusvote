import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  ChevronLeft,
  Ban,
  CheckCircle,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function ReviewBallot() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCandidates } = location.state || { selectedCandidates: {} };

  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState(null);

  const fetchSelectedDetails = async () => {
    const ids = Object.values(selectedCandidates);
    if (ids.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .in("id", ids);

      if (error) throw error;
      setCandidates(data || []);
    } catch (err) {
      console.error("Error fetching selected candidates:", err);
      setError("Failed to load your selections. Please go back and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedDetails();
  }, [selectedCandidates]);

  const submitBallot = async () => {
    if (!isConfirmed) return;
    setIsSubmitting(true);
    setError(null);

    const selectedIds = Object.values(selectedCandidates);

    try {
      const votePromises = selectedIds.map((id) =>
        supabase.rpc("increment_vote", { candidate_id: id }),
      );

      const results = await Promise.all(votePromises);

      const failedVotes = results.filter((res) => res.error);
      if (failedVotes.length > 0) {
        console.error(
          "Failed votes details:",
          failedVotes.map((v) => v.error),
        );
        const errorMsg =
          failedVotes[0].error.message || "Unknown database error";
        const errorDetail = failedVotes[0].error.details || "";
        throw new Error(`Voting Error: ${errorMsg} ${errorDetail}`);
      }

      navigate("/success");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCandidateForPosition = (position) => {
    const candidateId = selectedCandidates[position];
    return candidates.find((c) => c.id === candidateId);
  };

  // Define the positions we expect to see
  const POSITIONS = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Auditor",
    "PRO",
    "Representative",
  ];

  return (
    <div className="font-display bg-background-light text-slate-900 min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-primary/10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary font-medium disabled:opacity-50"
          disabled={isSubmitting}>
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
          <p className="text-slate-500 mt-3 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            Please double-check your selections before submitting. You cannot
            change your vote after submission.
          </p>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 animate-in fade-in zoom-in-95">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={48} className="text-primary animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">
              Loading selections...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
            {POSITIONS.map((position) => {
              const candidate = getCandidateForPosition(position);

              if (!candidate)
                return (
                  <div
                    key={position}
                    className="bg-white p-5 rounded-2xl border border-dashed border-slate-200 flex items-center gap-5 grayscale opacity-60">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <Ban size={32} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {position}
                      </p>
                      <p className="text-lg font-bold italic text-slate-400">
                        Not Selected
                      </p>
                    </div>
                  </div>
                );

              return (
                <div
                  key={position}
                  className="bg-white p-5 rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-all flex items-center gap-5">
                  <div className="relative">
                    <img
                      className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover bg-primary/10 ring-2 ring-primary/5"
                      src={
                        candidate.image_url || "https://via.placeholder.com/150"
                      }
                      alt={candidate.full_name}
                    />
                    <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                      <CheckCircle size={14} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest mb-1">
                      {position}
                    </p>
                    <p className="text-lg md:text-xl font-bold">
                      {candidate.full_name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {candidate.organization || "No Party"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mb-12 max-w-2xl mx-auto">
          <label className="relative flex items-start group cursor-pointer p-6 rounded-3xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
            <div className="flex items-center h-6 mt-1">
              <input
                className="h-6 w-6 rounded-lg border-slate-300 text-primary focus:ring-primary transition-all cursor-pointer"
                id="final-confirm"
                name="final-confirm"
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                disabled={isSubmitting}
              />
            </div>
            <div className="ml-4 text-sm md:text-base leading-relaxed">
              <span className="font-black text-slate-800 uppercase tracking-tight">
                I understand that my vote is final.
              </span>
              <p className="text-slate-500 text-xs md:text-sm mt-3 font-medium leading-relaxed">
                By checking this box, you confirm that your selections are
                accurate and you are ready to transmit your digital ballot. You
                won't be able to edit this later.
              </p>
            </div>
          </label>
        </div>
      </main>

      <footer className="mt-auto bg-white/80 backdrop-blur-md border-t border-primary/10 px-4 py-8 md:py-10">
        <div className="max-w-md mx-auto">
          <button
            onClick={submitBallot}
            disabled={!isConfirmed || isSubmitting || isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-slate-900 font-black py-5 rounded-2xl shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:scale-100">
            {isSubmitting ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span>Transmitting Ballot...</span>
              </>
            ) : (
              <>
                <span className="text-lg uppercase tracking-widest">
                  Submit My Vote
                </span>
                <Send size={20} />
              </>
            )}
          </button>
          <p className="text-center text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-400 mt-6 font-black opacity-70">
            Secured by Campus Comelec
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full bg-accent w-full rounded-full`}></div>
            </div>
          </div>
          <p className="text-[10px]  text-center text-accent mt-2 font-medium uppercase tracking-widest">
            Progress: 3 of 3 Positions
          </p>
        </div>
      </footer>
    </div>
  );
}
