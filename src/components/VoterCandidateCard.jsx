import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  Info,
  User,
  Shield,
  X,
  Megaphone,
  Quote,
  BarChart3,
  Briefcase,
} from "lucide-react";

export default function CandidateCard({ candidate, selected }) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  // Use a fallback image if image_url is not provided
  const hasImage = !!candidate.image_url;

  return (
    <>
      <div
        className={`relative h-[480px] w-[280px] sm:w-[320px] rounded-[2.5rem] overflow-hidden group shadow-2xl transition-all duration-300 candidate-card shrink-0 cursor-pointer ${
          selected
            ? "border-8 border-accent shadow-accent/20 scale-[0.98]"
            : "shadow-slate-900/10 "
        }`}>
        {/* Background Image/Fallback */}
        <div className="absolute inset-0">
          {hasImage ? (
            <img
              src={candidate.image_url}
              alt={candidate.full_name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <User size={120} className="text-primary/10" />
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Selection Checkmark */}
        {selected && (
          <div className="absolute top-6 right-6 z-20 animate-in zoom-in duration-300">
            <div className="w-10 h-10 bg-accent text-slate-900 rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle2 size={24} />
            </div>
          </div>
        )}

        {/* Organization/Partylist Badge (Top Left) */}
        {(candidate.organization || candidate.partylist) && (
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            {candidate.partylist && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                <Shield size={10} />
                {candidate.partylist}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-shadow-lg text-2xl font-bold text-white mb-1.5 drop-shadow-sm tracking-tight">
            {candidate.full_name}
          </h3>
          <p className="text-xs text-shadow-lg font-black text-white/80 uppercase tracking-[0.25em] mb-8">
            "
            {candidate.quotes && candidate.quotes.length > 40
              ? `${candidate.quotes.substring(0, 40)}...`
              : candidate.quotes || "Leadership through action."}
          </p>

          {/* Buttons Row */}
          <div className="flex items-center gap-3 w-full">
            {/* Details Button */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="flex-1 py-2 max-w-[110px] bg-white/10 backdrop-blur-md border-2 border-white/40 text-white  rounded-full font-black text-sm  tracking-widest flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
              Info
              <div className="border border-white/60 p-0.5 rounded-full">
                <Info size={16} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {showDetailModal &&
        createPortal(
          <div className="fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-300">
            <div
              className="absolute inset-0"
              onClick={() => setShowDetailModal(false)}
            />
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
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
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                            Organization
                          </p>
                          <p className="font-bold">
                            {candidate.organization || "Independent"}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                            Partylist
                          </p>
                          <p className="font-bold">
                            {candidate.partylist || "N/A"}
                          </p>
                        </div>
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
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-200 italic leading-relaxed pt-2">
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
                        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {candidate.platform}
                          </p>
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-8 border-t border-slate-100 dark:border-slate-800 shrink-0">
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
