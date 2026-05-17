import { useMemo } from "react";

import { useApp } from "../context/AppContext";

export default function ProgressPage() {
  const { documents, flashcards, quizzes } = useApp();

  // ======================================
  // QUIZ STATS
  // ======================================

  const completed = useMemo(
    () =>
      quizzes.filter((q) => q.status === "completed" && q.latestScore !== null),
    [quizzes]
  );

  const avgScore = completed.length
    ? Math.round(
        completed.reduce(
          (a, q) => a + (q.latestScore / q.latestTotal) * 100,
          0
        ) / completed.length
      )
    : 0;

  // ======================================
  // DISTRIBUTION
  // ======================================

  const distribution = [
    {
      range: "90–100%",
      count: completed.filter((q) => q.latestScore / q.latestTotal >= 0.9)
        .length,
      color: "bg-emerald-400",
    },

    {
      range: "70–89%",
      count: completed.filter((q) => {
        const p = q.latestScore / q.latestTotal;

        return p >= 0.7 && p < 0.9;
      }).length,
      color: "bg-indigo-400",
    },

    {
      range: "50–69%",
      count: completed.filter((q) => {
        const p = q.latestScore / q.latestTotal;

        return p >= 0.5 && p < 0.7;
      }).length,
      color: "bg-amber-400",
    },

    {
      range: "Below 50%",
      count: completed.filter((q) => q.latestScore / q.latestTotal < 0.5)
        .length,
      color: "bg-rose-400",
    },
  ];

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  // ======================================
  // FLASHCARD STATS
  // ======================================

  const favoriteCount = flashcards.filter((f) => f.favorited).length;

  const reviewedCount = flashcards.filter((f) => f.reviewed).length;

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold font-sora">Learning Progress</h1>

        <p className="text-slate-400 text-sm mt-1">
          Track your study journey and performance
        </p>
      </div>

      {/* ====================================== */}
      {/* TOP ROW */}
      {/* ====================================== */}

      <div className="grid grid-cols-2 gap-4">
        {/* DOCUMENTS */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">📄</span>

            <div className="text-3xl font-bold font-sora text-indigo-400">
              {documents.length}
            </div>
          </div>

          <div className="text-sm text-slate-300 font-medium">
            Documents Uploaded
          </div>

          <div className="mt-3 space-y-1">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{
                  width: `${Math.min(100, (documents.length / 10) * 100)}%`,
                }}
              />
            </div>

            <div className="text-xs text-slate-600">
              {documents.length}
              {" / 10 goal"}
            </div>
          </div>
        </div>

        {/* FLASHCARDS */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">🃏</span>

            <div className="text-3xl font-bold font-sora text-violet-400">
              {flashcards.length}
            </div>
          </div>

          <div className="text-sm text-slate-300 font-medium">
            Flashcards Created
          </div>

          <div className="mt-3 space-y-1">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500"
                style={{
                  width: `${Math.min(100, (flashcards.length / 50) * 100)}%`,
                }}
              />
            </div>

            <div className="text-xs text-slate-600">
              {flashcards.length}
              {" / 50 goal"}
            </div>
          </div>
        </div>
      </div>

      {/* ====================================== */}
      {/* FLASHCARD DASHBOARD */}
      {/* ====================================== */}

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold font-sora">Flashcard Dashboard</h2>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-2xl font-bold font-sora text-indigo-400">
              {flashcards.length}
            </div>

            <div className="text-xs text-slate-500 mt-1">Total Cards</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-2xl font-bold font-sora text-amber-400">
              {favoriteCount}
            </div>

            <div className="text-xs text-slate-500 mt-1">Favorited</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-2xl font-bold font-sora text-emerald-400">
              {reviewedCount}
            </div>

            <div className="text-xs text-slate-500 mt-1">Reviewed</div>
          </div>
        </div>
      </div>

      {/* ====================================== */}
      {/* QUIZ ROW */}
      {/* ====================================== */}

      <div className="grid grid-cols-2 gap-4">
        {/* QUIZZES */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">🧠</span>

            <div className="text-3xl font-bold font-sora text-emerald-400">
              {completed.length}
            </div>
          </div>

          <div className="text-sm text-slate-300 font-medium">
            Quizzes Taken
          </div>

          <div className="mt-3 space-y-1">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${Math.min(100, (completed.length / 20) * 100)}%`,
                }}
              />
            </div>

            <div className="text-xs text-slate-600">
              {completed.length}
              {" / 20 goal"}
            </div>
          </div>
        </div>

        {/* AVG SCORE */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">🎯</span>

            <div
              className={`text-3xl font-bold font-sora ${
                avgScore >= 70 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {avgScore ? `${avgScore}%` : "—"}
            </div>
          </div>

          <div className="text-sm text-slate-300 font-medium">
            Avg Quiz Score
          </div>
        </div>
      </div>

      {/* ====================================== */}
      {/* DISTRIBUTION */}
      {/* ====================================== */}

      <div className="glass-card rounded-2xl p-6 space-y-6">
        <h2 className="font-semibold font-sora">Quiz Score Distribution</h2>

        {completed.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="text-4xl">📊</div>

            <div className="text-slate-400 text-sm">
              Complete some quizzes to see your score distribution
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {distribution.map((d) => (
              <div key={d.range} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{d.range}</span>

                  <span className="font-medium">
                    {d.count}
                    {" quiz"}
                    {d.count !== 1 ? "zes" : ""}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.color} transition-all duration-1000`}
                    style={{
                      width: `${(d.count / maxCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
