import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import gsap from "gsap";
import { X, BadgeCheck, Utensils, BookOpen, Leaf, Vote } from "lucide-react";

export default function CandidatePlatform() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { y: "100%" },
      { y: "0%", duration: 0.5, ease: "power3.out" },
    );
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      y: "100%",
      duration: 0.4,
      ease: "power3.in",
      onComplete: () => navigate(-1),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end">
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] w-full max-h-[90%] overflow-y-auto">
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-4 mb-6"></div>

        <div className="px-8 pb-10 relative">
          <button
            onClick={handleClose}
            className="absolute top-0 right-8 w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <X size={18} className="text-slate-500" />
          </button>

          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-primary/20 shadow-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCqL9rDVLhBcsndekd2KOMxzPvaRO16L0_w21qBWFtyPycunX5nF46CFgk7ZqTJP7xYpePukW0KG2B3KxNI31IEgCxh9d4Ukw1uvGtEVtDqeG9r1-jVhsZTvCgBDdk8lgtLbbBECMz6DGqoJjWtFG_rDgabz7Zlbd6mDQ0viL8DaaQF_Zz6aw7wkRbQ04Y05DE6soRd7ulkzIuP2sgY645jADPIIrMLv8FF4NdzQ6drYoveQnJ-buEhpJxrncUEPKaO_-W1lXOw8W1"
                alt="Candidate"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-xl shadow-md">
                <BadgeCheck size={14} />
              </div>
            </div>
            <h2 className="text-2xl font-bold mt-4 text-slate-800 dark:text-white">
              Maya Chen
            </h2>
            <span className="text-primary font-semibold text-sm">
              Presidential Candidate
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Core Platform
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Utensils size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">
                      Better Cafeteria Food
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Partnering with local organic farms to provide healthier,
                      varied options daily.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <BookOpen size={20} className="text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">
                      Extended Library Hours
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      24/7 access to study zones during finals and midterms with
                      safe-escort services.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Leaf size={20} className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">
                      Green Campus Initiative
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Eliminating single-use plastics and adding 50+ new solar
                      charging stations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                About Maya
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                "As your current Vice President, I've spent the last year
                listening to your concerns. My goal is to build a campus that
                prioritizes student wellness and sustainable growth."
              </p>
            </div>
          </div>

          <div className="mt-10">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-transform active:scale-95">
              <Vote size={20} />
              Confirm Vote for Maya
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-4 px-6 italic">
              By clicking, you acknowledge this is a one-time final submission
              for the Presidential category.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
