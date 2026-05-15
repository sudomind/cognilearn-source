import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Loaders";
import { aiApi } from "../../services/api";

export default function ExplainTab({ docId }) {
  const storageKey = `explain_${docId || "default"}`;

  const [concept, setConcept] = useState("");

  const [explanation, setExplanation] = useState("");

  const [loading, setLoading] = useState(false);

  // ======================================
  // RESTORE SAVED SESSION
  // ======================================

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        setConcept(parsed.concept || "");

        setExplanation(parsed.explanation || "");
      } catch (err) {
        console.error(err);
      }
    }
  }, [storageKey]);

  // ======================================
  // SAVE SESSION
  // ======================================

  useEffect(() => {
    sessionStorage.setItem(
      storageKey,

      JSON.stringify({
        concept,
        explanation,
      })
    );
  }, [concept, explanation, storageKey]);

  // ======================================
  // EXPLAIN HANDLER
  // ======================================

  const handleExplain = async () => {
    if (!concept.trim()) return;

    setLoading(true);

    try {
      const res = await aiApi.explainConcept(docId, concept);

      const result = res.data?.explanation || "No explanation generated.";

      setExplanation(result);
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to explain concept.";

      setExplanation(`ERROR: ${backendMessage}`);

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // CLEAR CHAT
  // ======================================

  const handleClear = () => {
    setConcept("");
    setExplanation("");

    sessionStorage.removeItem(storageKey);
  };

  // ======================================
  // MARKDOWN RENDER
  // ======================================

  const renderMarkdown = (text) =>
    text

      // bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300">$1</strong>')

      // h1
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold text-white mt-6 mb-3">$1</h1>'
      )

      // h2
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-semibold text-indigo-300 mt-5 mb-2">$1</h2>'
      )

      // bullets
      .replace(/^\- (.*$)/gim, '<li class="ml-5 list-disc">$1</li>')

      // line breaks
      .replace(/\n/g, "<br/>");

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold font-sora text-lg">
            AI Concept Explainer
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Ask Gemini to explain concepts from your document
          </p>
        </div>

        {(concept || explanation) && (
          <button
            onClick={handleClear}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleExplain()}
          placeholder="Ask any concept... (e.g. recursion, stack memory, neural networks)"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />

        <Button
          onClick={handleExplain}
          disabled={!concept.trim() || loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 rounded-xl whitespace-nowrap"
        >
          {loading ? "Thinking..." : "Explain"}
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[100, 85, 92, 78, 88, 60].map((w, i) => (
            <Skeleton
              key={i}
              className="h-4"
              style={{
                width: `${w}%`,
              }}
            />
          ))}
        </div>
      ) : explanation ? (
        /* Result */
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div
            className="text-slate-200 leading-relaxed text-sm space-y-3"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(explanation),
            }}
          />
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
          <div className="text-5xl animate-float">💡</div>

          <h3 className="font-semibold font-sora">Ask Anything</h3>

          <p className="text-slate-400 text-sm max-w-md">
            Ask Gemini to explain concepts, theories, algorithms, formulas, or
            anything from your uploaded study material.
          </p>
        </div>
      )}
    </div>
  );
}
