import { useApp } from "../context/AppContext";

import { Button } from "../components/ui/Button";

import { timeAgo } from "../utils/helpers";

export default function QuizzesPage() {
  const { quizzes, deleteQuiz, setCurrentView } = useApp();

  // ======================================
  // FILTERS
  // ======================================

  const completed = quizzes.filter((q) => q.status === "completed");

  const pending = quizzes.filter((q) => q.status !== "completed");

  // ======================================
  // AVG SCORE
  // ======================================

  const avgScore = completed.length
    ? Math.round(
        completed.reduce(
          (acc, q) => {
            const pct = q.latestTotal
              ? (q.latestScore / q.latestTotal) * 100
              : 0;

            return acc + pct;
          },

          0
        ) / completed.length
      )
    : 0;

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sora">My Quizzes</h1>

          <p className="text-slate-400 text-sm mt-1">
            {quizzes.length}
            {" quizzes · "}
            {completed.length}
            {" completed"}
          </p>
        </div>

        <Button
          onClick={() => setCurrentView("documents")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          + New Quiz
        </Button>
      </div>

      {/* STATS */}
      {completed.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Completed",

              value: completed.length,

              color: "text-emerald-400",
            },

            {
              label: "Avg Score",

              value: `${avgScore}%`,

              color:
                avgScore >= 70
                  ? "text-emerald-400"
                  : avgScore >= 50
                  ? "text-amber-400"
                  : "text-rose-400",
            },

            {
              label: "Pending",

              value: pending.length,

              color: "text-indigo-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-xl p-4 text-center"
            >
              <div className={`text-2xl font-bold font-sora ${s.color}`}>
                {s.value}
              </div>

              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {quizzes.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center space-y-4">
          <div className="text-6xl">🧠</div>

          <h3 className="text-xl font-semibold font-sora">No quizzes yet</h3>

          <p className="text-slate-400 text-sm">
            Open a document and generate your first AI quiz
          </p>

          <Button
            onClick={() => setCurrentView("documents")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Go to Documents
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map((q, i) => {
            const pct = q.latestTotal
              ? Math.round((q.latestScore / q.latestTotal) * 100)
              : null;

            const completedQuiz = q.status === "completed";

            return (
              <div
                key={q.id}
                className="glass-card rounded-xl p-5 flex items-center gap-4 animate-fade-in-up hover:border-indigo-500/30 transition-all"
                style={{
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {/* ICON */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    !completedQuiz
                      ? "bg-indigo-500/15"
                      : pct >= 70
                      ? "bg-emerald-500/15"
                      : "bg-amber-500/15"
                  }`}
                >
                  {!completedQuiz ? "🧠" : pct >= 70 ? "✅" : "📚"}
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {q.documentName || "AI Quiz"}
                  </div>

                  <div className="text-xs text-slate-500 mt-0.5">
                    {q.questions.length}
                    {" questions · "}
                    {timeAgo(q.createdAt)}
                  </div>

                  {completedQuiz && (
                    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden max-w-xs">
                      <div
                        className="h-full rounded-full progress-bar"
                        style={{
                          width: `${pct}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* STATUS */}
                <div className="flex items-center gap-3">
                  {!completedQuiz ? (
                    <div className="text-xs bg-indigo-500/20 text-indigo-400 rounded-full px-3 py-1">
                      Pending
                    </div>
                  ) : (
                    <div
                      className={`text-xl font-bold ${
                        pct >= 70
                          ? "text-emerald-400"
                          : pct >= 50
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {pct}%
                    </div>
                  )}

                  <button
                    onClick={() => deleteQuiz(q.id)}
                    className="text-slate-600 hover:text-rose-400 transition-colors text-sm"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
