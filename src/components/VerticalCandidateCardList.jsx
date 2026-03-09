import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  User,
  Shield,
  Info,
  Quote,
  BarChart3,
  X,
  Megaphone,
} from "lucide-react";

export default function VerticalCandidateCardList({ candidate }) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const hasImage = !!candidate.image_url;

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/50 hover:border-primary/20 hover:shadow-md transition-all flex items-center gap-5 candidate-card">
        {/* Profile Image (Left) */}
        <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24">
          {hasImage ? (
            <img
              src={candidate.image_url}
              alt={candidate.full_name}
              className="w-full h-full rounded-2xl object-cover border-2 border-primary/10"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-200/50">
              <User size={32} className="text-slate-400" />
            </div>
          )}
        </div>

        {/* Details (Middle) */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
              {candidate.full_name}
            </h3>
            {candidate.partylist && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest shrink-0">
                <Shield size={10} />
                {candidate.partylist}
              </span>
            )}
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 truncate">
            {candidate.position}{" "}
            {candidate.organization ? `• ${candidate.organization}` : ""}
          </p>

          <p className="text-sm text-slate-500 italic max-w-xl truncate">
            "{candidate.quotes || "Leadership through action."}"
          </p>
        </div>

        {/* Action & Stats (Right) */}
        <div className="shrink-0 flex flex-col items-end justify-center gap-3 border-l border-slate-100 pl-4 sm:pl-6">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-accent/60 tracking-widest">
              Votes Received
            </p>
            <p className="text-2xl font-black text-accent leading-none mt-1">
              {candidate.vote_count || 0}
            </p>
          </div>

          <button
            onClick={() => setShowDetailModal(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-primary hover:text-white text-slate-600 rounded-full font-bold text-xs uppercase tracking-widest transition-colors mt-1">
            <Info size={14} />
            Info
          </button>
        </div>
      </div>

      {showDetailModal &&
        createPortal(
          <div className="fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-300">
            <div
              className="absolute inset-0"
              onClick={() => setShowDetailModal(false)}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
              {/* Header / Hero */}
              <div className="relative h-64 shrink-0">
                {hasImage ? (
                  <img
                    src={candidate.image_url}
                    alt={candidate.full_name}
                    className="w-full h-full object-cover object-center md:object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/30 to-primary/5 flex items-center justify-center">
                    <User size={80} className="text-primary/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="absolute top-6 right-6 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors z-20">
                  <X size={24} />
                </button>

                <div className="absolute bottom-6 left-8 right-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-wider mb-3 shadow-lg">
                    {candidate.position}
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tight">
                    {candidate.full_name}
                  </h2>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Information Sections */}
                  <div className="space-y-8">
                    <section>
                      <div className="flex items-center gap-2 mb-3 text-primary">
                        <Shield size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest">
                          Affiliation
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                            Organization
                          </p>
                          <p className="font-bold">
                            {candidate.organization || "Independent"}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                            Partylist
                          </p>
                          <p className="font-bold">
                            {candidate.partylist || "N/A"}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center gap-2 mb-3 text-amber-500">
                        <BarChart3 size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest">
                          Stats
                        </h4>
                      </div>
                      <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                        <p className="text-[10px] uppercase font-bold text-amber-600/60 mb-1">
                          Current Votes
                        </p>
                        <p className="text-3xl font-black text-amber-600">
                          {candidate.vote_count || 0}
                        </p>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <section>
                      <div className="flex items-center gap-2 mb-3 text-primary">
                        <Quote size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest">
                          Motto & Vision
                        </h4>
                      </div>
                      <div className="p-6 bg-primary/5 rounded-4xl border border-primary/10 relative">
                        <Quote
                          size={40}
                          className="absolute -top-4 -left-4 text-primary/10 rotate-180"
                        />
                        <p className="text-lg font-bold text-slate-700 italic leading-relaxed pt-2">
                          "
                          {candidate.quotes ||
                            "Always ready to serve for the betterment of the student body."}
                          "
                        </p>
                      </div>
                    </section>

                    {candidate.platform && (
                      <section>
                        <div className="flex items-center gap-2 mb-3 text-primary">
                          <Megaphone size={18} />
                          <h4 className="text-xs font-black uppercase tracking-widest">
                            Platforms
                          </h4>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {candidate.platform}
                          </p>
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-8 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all uppercase tracking-widest text-sm active:scale-[0.98]">
                  Close Details
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
