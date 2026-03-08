import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Info,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import VoterCandidateCard from "../components/VoterCandidateCard";
import ProgressButtonBar from "../components/ProgressButtonBar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ElectionBallot() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState({}); // { orgName: { position: candidateId } }
  const [activeOrg, setActiveOrg] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [viewMode, setViewMode] = useState("hub"); // 'hub' or 'voting'
  const contentRef = useRef(null);
  const scrollContainerRefs = useRef({});
  const orgNavRef = useRef(null);
  const progressButtonRef = useRef(null);

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

      const uniqueOrgs = [
        ...new Set(data.map((c) => c.organization || "Independent")),
      ];
      setOrganizations(uniqueOrgs);
      // No longer auto-setting activeOrg to first one, we use the Hub
    } catch (err) {
      console.error("Error fetching candidates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Function to get grouped candidates for a specific organization
  const getGroupedCandidatesForOrg = (org) => {
    return POSITIONS.reduce((acc, pos) => {
      acc[pos] = candidates.filter(
        (c) => (c.organization || "Independent") === org && c.position === pos,
      );
      return acc;
    }, {});
  };

  const handleScroll = (org, position, direction) => {
    const container = scrollContainerRefs.current[`${org}-${position}`];
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleOrgScroll = (direction) => {
    if (orgNavRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      orgNavRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSelect = (candidate) => {
    const orgKey = candidate.organization || "Independent";
    setSelectedCandidates((prev) => ({
      ...prev,
      [orgKey]: {
        ...(prev[orgKey] || {}),
        [candidate.position]: candidate.id,
      },
    }));
  };

  const currentOrgSelections = selectedCandidates[activeOrg] || {};
  const currentOrgTotalSelected = Object.keys(currentOrgSelections).length;
  const currentOrgTotalPositions = activeOrg
    ? POSITIONS.filter((pos) =>
        candidates.some(
          (c) =>
            (c.organization || "Independent") === activeOrg &&
            c.position === pos,
        ),
      ).length
    : 0;
  const currentOrgProgressPercent =
    currentOrgTotalPositions > 0
      ? (currentOrgTotalSelected / currentOrgTotalPositions) * 100
      : 0;

  // Global progress
  const getOrgProgress = (org) => {
    const selections = selectedCandidates[org] || {};
    const totalSelected = Object.keys(selections).length;
    const totalPositions = POSITIONS.filter((pos) =>
      candidates.some(
        (c) => (c.organization || "Independent") === org && c.position === pos,
      ),
    ).length;
    return { totalSelected, totalPositions };
  };

  const globalStats = organizations.reduce(
    (acc, org) => {
      const { totalSelected, totalPositions } = getOrgProgress(org);
      acc.totalSelected += totalSelected;
      acc.totalPositions += totalPositions;
      return acc;
    },
    { totalSelected: 0, totalPositions: 0 },
  );

  const globalProgressPercent =
    globalStats.totalPositions > 0
      ? (globalStats.totalSelected / globalStats.totalPositions) * 100
      : 0;

  const handleEnterOrg = (org) => {
    setActiveOrg(org);
    setViewMode("voting");
  };

  useGSAP(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    );
  }, [activeOrg, viewMode]);

  useGSAP(() => {
    if (globalProgressPercent === 100) {
      gsap.to(progressButtonRef.current, {
        yPercent: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(progressButtonRef.current, {
        yPercent: 120, // ensure it's fully hidden
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [globalProgressPercent]);

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col">
      <header className=" bg-white/80 sticky top-0 z-40 border-b border-primary/10 ios-blur">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold tracking-tight">
              Election Ballot
            </h1>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
            <GraduationCap size={16} />
            <span>University Student Council 2026</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div
              style={{ width: `${globalProgressPercent}%` }}
              className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Overall Progress: {globalStats.totalSelected} /{" "}
              {globalStats.totalPositions} Votes
            </span>
            {viewMode === "voting" && (
              <button
                onClick={() => setViewMode("hub")}
                className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                <ChevronLeft size={14} />
                Back to Organizations
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="grow px-4 py-6">
        {viewMode === "voting" && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-8">
            <div className="flex gap-3">
              <Info size={20} className="text-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                  Now Voting For:
                </p>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  {activeOrg}
                </h2>
                <p className="text-sm leading-relaxed text-slate-700 mt-2">
                  Please select{" "}
                  <span className="font-bold text-primary">one (1)</span>{" "}
                  candidate for each position below.
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center pt-24">
            <RefreshCw size={40} className="text-primary animate-spin" />
          </div>
        ) : viewMode === "hub" ? (
          <div ref={contentRef} className="pb-24 grid gap-4">
            <div className="mb-4">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                Select Organization
              </h2>
              <p className="text-slate-500 text-sm">
                Choose an organization to start voting for its candidates.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizations.map((org) => {
                const { totalSelected, totalPositions } = getOrgProgress(org);
                const isComplete = totalSelected === totalPositions;
                return (
                  <button
                    key={org}
                    onClick={() => handleEnterOrg(org)}
                    className={`p-6 rounded-3xl border text-left transition-all ${
                      isComplete
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-slate-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                    }`}>
                    <div className="flex flex-col h-full justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2.5 py-0.5 text-[10px] font-black rounded-lg uppercase tracking-wider ${
                              isComplete
                                ? "bg-green-500 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}>
                            {isComplete ? "Complete" : "In Progress"}
                          </span>
                          {isComplete && (
                            <CheckCircle size={16} className="text-green-500" />
                          )}
                        </div>
                        <h3 className="text-xl font-black text-slate-800 leading-tight uppercase">
                          {org}
                        </h3>
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-slate-500">
                            {totalSelected} of {totalPositions} Voted
                          </span>
                          <span className="text-xs font-black text-primary">
                            {Math.round((totalSelected / totalPositions) * 100)}
                            %
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{
                              width: `${(totalSelected / totalPositions) * 100}%`,
                            }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              isComplete ? "bg-green-500" : "bg-primary"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : organizations.length > 0 ? (
          <div ref={contentRef} className="pb-24">
            {organizations
              .filter((org) => org === activeOrg)
              .map((org) => {
                const groupedForOrg = getGroupedCandidatesForOrg(org);
                return (
                  <div key={org} className="space-y-12">
                    {POSITIONS.map((position) => {
                      const candidatesInPosition =
                        groupedForOrg[position] || [];
                      if (candidatesInPosition.length === 0) return null;

                      return (
                        <div
                          key={position}
                          className="overflow-visible space-y-4">
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
                            <div className="hidden md:flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleScroll(org, position, "left")
                                }
                                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm">
                                <ChevronLeft size={20} />
                              </button>
                              <button
                                onClick={() =>
                                  handleScroll(org, position, "right")
                                }
                                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm">
                                <ChevronRight size={20} />
                              </button>
                            </div>
                          </div>

                          <div
                            ref={(el) =>
                              (scrollContainerRefs.current[
                                `${org}-${position}`
                              ] = el)
                            }
                            className="flex gap-6 overflow-x-auto pb-6 px-2 scroll-smooth no-scrollbar snap-x snap-mandatory">
                            {candidatesInPosition.map((candidate) => (
                              <div
                                key={candidate.id}
                                className="snap-start shrink-0"
                                onClick={() => handleSelect(candidate)}>
                                <VoterCandidateCard
                                  candidate={candidate}
                                  selected={
                                    currentOrgSelections[candidate.position] ===
                                    candidate.id
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
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
        ref={progressButtonRef}
        text={"Proceed to Review"}
        navigateTo={"/review"}
        state={{ selectedCandidates }}
        current={globalStats.totalSelected}
        total={globalStats.totalPositions}
        disabled={globalStats.totalSelected < globalStats.totalPositions}
      />
    </div>
  );
}
