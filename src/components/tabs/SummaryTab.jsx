import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Button } from "../ui/Button";
import { Spinner, Skeleton } from "../ui/Loaders";
import { aiApi } from "../../services/api";

export default function SummaryTab({ docId }) {
  const { documents } = useApp();

  const doc = documents.find((d) => d.id === docId || d._id === docId);

  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState(doc?.summary || "");

  const handleGenerate = async () => {
    if (!docId) return;

    setLoading(true);

    try {
      const res = await aiApi.generateSummary(docId);

      const generated = res.data?.summary || "";

      setSummary(generated);
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message || err?.message || "Unknown error";

      setSummary(`ERROR: ${backendMessage}`);

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Simple markdown rendering
  const renderMarkdown = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300">$1</strong>')
      .replace(/\n/g, "<br/>");

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold font-sora">Document Summary</h3>

          <p className="text-xs text-slate-500 mt-1">
            Gemini AI-generated overview
          </p>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm gap-2"
        >
          {loading ? (
            <>
              <Spinner className="w-3.5 h-3.5" />
              Generating…
            </>
          ) : (
            "✨ Generate Summary"
          )}
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[100, 90, 95, 80, 85].map((w, i) => (
            <Skeleton
              key={i}
              className="h-4"
              style={{
                width: `${w}%`,
              }}
            />
          ))}
        </div>
      ) : summary ? (
        <div className="glass-card rounded-2xl p-6">
          <div
            className="text-slate-200 leading-relaxed text-sm"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(summary),
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="text-5xl animate-float">📝</div>

          <h3 className="font-semibold font-sora">No summary yet</h3>

          <p className="text-slate-400 text-sm">
            Click Generate Summary to create an AI overview
          </p>
        </div>
      )}
    </div>
  );
}
