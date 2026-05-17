import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { Button } from "../ui/Button";
import { Spinner, Skeleton } from "../ui/Loaders";
import { aiApi } from "../../services/api";

export default function FlashcardsTab({ docId }) {
  const { flashcards, addFlashcards } = useApp();

  const cards = flashcards.filter((f) => f.docId === docId);

  const [loading, setLoading] = useState(false);

  const [count, setCount] = useState(8);

  const [flipped, setFlipped] = useState(null);

  const [studyIndex, setStudyIndex] = useState(0);

  const [view, setView] = useState("grid");

  // ======================================
  // RESTORE VIEW MODE
  // ======================================

  useEffect(() => {
    const saved = sessionStorage.getItem(`flash-view-${docId}`);

    if (saved) {
      setView(saved);
    }
  }, [docId]);

  useEffect(() => {
    sessionStorage.setItem(`flash-view-${docId}`, view);
  }, [view, docId]);

  // ======================================
  // GENERATE
  // ======================================

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const res = await aiApi.generateFlashcards(docId, count);

      const generated = res.data?.flashcards || [];

      if (!generated.length) {
        throw new Error("No flashcards generated");
      }

      addFlashcards(
        generated.map((c) => ({
          id: c.id || crypto.randomUUID(),

          docId,

          front: c.front || c.question || "Untitled Question",

          back: c.back || c.answer || "No Answer",

          favorited: false,
          reviewed: false,
        }))
      );

      setStudyIndex(0);
      setFlipped(null);
    } catch (err) {
      console.error(err);

      alert(err?.response?.data?.message || "Failed to generate flashcards");
    } finally {
      setLoading(false);
    }
  };

  const currentCard = cards[studyIndex];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold font-sora text-lg">AI Flashcards</h3>

          <p className="text-xs text-slate-500 mt-1">
            {cards.length} cards generated
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          {cards.length > 0 && (
            <div className="flex rounded-lg bg-white/5 p-0.5">
              {["grid", "study"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    view === v ? "bg-indigo-500 text-white" : "text-slate-400"
                  }`}
                >
                  {v === "grid" ? "⊞ Grid" : "📖 Study"}
                </button>
              ))}
            </div>
          )}

          {/* Count */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Cards:</span>

            {[6, 8, 10, 12].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                  count === n
                    ? "bg-indigo-500 text-white"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Generate */}
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs gap-1.5"
          >
            {loading ? (
              <>
                <Spinner className="w-3 h-3" />
                Generating…
              </>
            ) : (
              "✨ Generate"
            )}
          </Button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({
            length: 4,
          }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        /* EMPTY */
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
          <div className="text-5xl animate-float">🃏</div>

          <h3 className="font-semibold font-sora">No flashcards yet</h3>

          <p className="text-slate-400 text-sm">
            Generate AI-powered flashcards from this document
          </p>
        </div>
      ) : view === "grid" ? (
        /* GRID VIEW */
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flip-card h-44 cursor-pointer"
              onClick={() => setFlipped(flipped === card.id ? null : card.id)}
            >
              <div
                className={`flip-card-inner ${
                  flipped === card.id ? "flipped" : ""
                }`}
              >
                {/* FRONT */}
                <div className="flip-card-front glass-card border border-white/10 bg-gradient-to-br from-indigo-500/10 to-violet-500/5">
                  <div className="text-center space-y-2 w-full">
                    <div className="text-xs text-slate-500 uppercase tracking-widest">
                      Question
                    </div>

                    <div className="font-medium text-sm leading-snug">
                      {card.front}
                    </div>

                    <div className="text-xs text-slate-600">Click to flip</div>
                  </div>
                </div>

                {/* BACK */}
                <div className="flip-card-back glass-card border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
                  <div className="text-center space-y-2 w-full">
                    <div className="text-xs text-slate-500 uppercase tracking-widest">
                      Answer
                    </div>

                    <div className="text-sm leading-snug text-emerald-300">
                      {card.back}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* STUDY MODE */
        <div className="space-y-6">
          <div
            className="flip-card h-72 cursor-pointer"
            onClick={() =>
              setFlipped(flipped === currentCard?.id ? null : currentCard?.id)
            }
          >
            <div
              className={`flip-card-inner ${
                flipped === currentCard?.id ? "flipped" : ""
              }`}
            >
              {/* FRONT */}
              <div className="flip-card-front glass-card border border-white/10 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 flex-col gap-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest">
                  Card {studyIndex + 1}
                  of {cards.length}
                </div>

                <div className="font-semibold text-xl text-center leading-snug">
                  {currentCard?.front}
                </div>

                <div className="text-sm text-slate-500">
                  Click to reveal answer
                </div>
              </div>

              {/* BACK */}
              <div className="flip-card-back glass-card border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 flex-col gap-4">
                <div className="text-xs text-emerald-500 uppercase tracking-widest">
                  Answer
                </div>

                <div className="text-lg text-center text-emerald-300 leading-relaxed">
                  {currentCard?.back}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={() => {
                setStudyIndex(Math.max(0, studyIndex - 1));

                setFlipped(null);
              }}
              disabled={studyIndex === 0}
              variant="ghost"
              className="border border-white/10"
            >
              ← Prev
            </Button>

            <div className="text-sm text-slate-400">
              {studyIndex + 1}
              {" / "}
              {cards.length}
            </div>

            <Button
              onClick={() => {
                setStudyIndex(Math.min(cards.length - 1, studyIndex + 1));

                setFlipped(null);
              }}
              disabled={studyIndex === cards.length - 1}
              variant="ghost"
              className="border border-white/10"
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
