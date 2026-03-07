import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Info,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import VoterCandidateCard from "../components/VoterCandidateCard";
import ProgressButtonBar from "../components/ProgressButtonBar";

export default function ElectionBallot() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState({}); // { position: candidateId }
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

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("full_name", { ascending: true });

      if (error) throw error;
      setCandidates(data || []);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const groupedCandidates = POSITIONS.reduce((acc, pos) => {
    acc[pos] = candidates.filter((c) => c.position === pos);
    return acc;
  }, {});

  const handleScroll = (position, direction) => {
    const container = scrollContainerRefs.current[position];
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSelect = (candidate) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [candidate.position]: candidate.id,
    }));
  };

  const totalSelected = Object.keys(selectedCandidates).length;
  const totalPositions = POSITIONS.filter(
    (pos) => groupedCandidates[pos]?.length > 0,
  ).length;
  const progressPercent =
    totalPositions > 0 ? (totalSelected / totalPositions) * 100 : 0;
  useEffect(() => {
    console.log(progressPercent);
  }, [progressPercent]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="bg-white/80 dark:bg-background-dark/80 sticky top-0 z-40 ios-blur border-b border-primary/10">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold tracking-tight">
              Election Ballot
            </h1>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <GraduationCap size={16} />
            <span>University Student Council 2024</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"></div>
          </div>
        </div>
      </header>

      <main className="grow px-4 py-6">
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-8">
          <div className="flex gap-3">
            <Info size={20} className="text-primary shrink-0" />
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Please select{" "}
              <span className="font-bold text-primary">one (1)</span> candidate
              for all the positions. Tap a card to select.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center pt-24">
            <RefreshCw size={40} className="text-primary animate-spin" />
          </div>
        ) : candidates.length > 0 ? (
          <div className="space-y-12 pb-24">
            {POSITIONS.map((position) => {
              const candidatesInPosition = groupedCandidates[position] || [];
              if (candidatesInPosition.length === 0) return null;

              return (
                <div key={position} className="overflow-visible space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1.5 bg-primary rounded-full" />
                      <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
                        {position}
                      </h3>
                      <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black rounded-lg border border-slate-200 dark:border-slate-700">
                        {candidatesInPosition.length}{" "}
                        {candidatesInPosition.length === 1
                          ? "Candidate"
                          : "Candidates"}
                      </span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <button
                        onClick={() => handleScroll(position, "left")}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm">
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => handleScroll(position, "right")}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  <div
                    ref={(el) => (scrollContainerRefs.current[position] = el)}
                    className="flex gap-6 overflow-x-auto pb-6 px-2 scroll-smooth no-scrollbar snap-x snap-mandatory">
                    {candidatesInPosition.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="snap-start shrink-0"
                        onClick={() => handleSelect(candidate)}>
                        <VoterCandidateCard
                          candidate={candidate}
                          selected={
                            selectedCandidates[position] === candidate.id
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center pt-24">
            <p className="text-slate-500">
              No candidates available for this election.
            </p>
          </div>
        )}
      </main>

      <ProgressButtonBar
        text={"Proceed to Review"}
        navigateTo={"/review"}
        progress={2}
        disabled={totalSelected < totalPositions}
      />
    </div>
  );
}
