import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function stripCodeFences(s) {
  if (!s || typeof s !== "string") return s;
  // remove any ```...``` blocks (including language tag) and trim
  return s.replace(/```[\s\S]*?```/g, "").trim();
}

function parseFeedback(feedbackProp) {
  if (!feedbackProp) return null;

  // If object, prefer its feedback field if present
  if (typeof feedbackProp === "object") {
    const candidate = feedbackProp.feedback ?? feedbackProp;
    if (typeof candidate === "string") {
      const cleaned = stripCodeFences(candidate);
      try {
        const parsed = JSON.parse(cleaned);
        return parsed?.feedback ?? parsed;
      } catch {
        return { summary: cleaned };
      }
    }
    return candidate;
  }

  // If string, first strip code fences then try JSON parse
  if (typeof feedbackProp === "string") {
    const cleaned = stripCodeFences(feedbackProp);
    try {
      const parsed = JSON.parse(cleaned);
      return parsed?.feedback ?? parsed;
    } catch {
      // not JSON — treat whole cleaned string as summary
      return { summary: cleaned };
    }
  }

  return null;
}

export default function CandidateFeedbackDialog({ FeedbackDetails, candidate }) {
  const [open, setOpen] = useState(false);

  const feedback = useMemo(() => parseFeedback(FeedbackDetails), [FeedbackDetails]);

  console.log("FeedbackDetails prop:", FeedbackDetails);
  console.log("parsed feedback:", feedback);

  // derive candidate details
  const candidateName = candidate?.userName ?? feedback?.userName ?? "Candidate";
  const candidateEmail = candidate?.email ?? feedback?.email ?? null;
  const createdAtRaw = candidate?.created_at ?? feedback?.created_at ?? feedback?.createdAt;
  let createdAt = null;
  try {
    createdAt = createdAtRaw ? new Date(createdAtRaw).toLocaleString() : null;
  } catch {
    createdAt = createdAtRaw ?? null;
  }

  // rating shape: feedback.rating = { technicalSkills, communication, problemSolving, experience }
  const rating = feedback?.rating ?? {};
  const labels = [
    { key: "technicalSkills", label: "Technical Skills" },
    { key: "communication", label: "Communication" },
    { key: "problemSolving", label: "Problem Solving" },
    { key: "experience", label: "Experience" },
  ];

  // scale: out of 10 points
  const SCALE = 10;

  // determine recommendation color based on value
  const recommendationValue = feedback?.Recommendation ?? "N/A";
  const isRecommended =
    typeof recommendationValue === "string" &&
    recommendationValue.toLowerCase().includes("yes");
  const recommendationBgColor = isRecommended ? "bg-green-100" : "bg-red-100";
  const recommendationTextColor = isRecommended ? "text-green-800" : "text-red-800";

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>View Feedback</Button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          <div className="relative z-50 w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
            {/* Header with candidate details + close */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-lg font-semibold text-green-800">
                  {candidateName?.charAt(0) ?? "C"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{candidateName}</h3>
                  {candidateEmail && <div className="text-xs text-gray-500">{candidateEmail}</div>}
                  {createdAt && <div className="text-xs text-gray-400">Completed on {createdAt}</div>}
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Ratings Section */}
              <div>
                <h4 className="font-semibold text-base mb-4">Performance Ratings</h4>

                <div className="space-y-4">
                  {labels.map(({ key, label }) => {
                    const val = Number(rating?.[key] ?? 0);
                    const pct = Math.max(0, Math.min(100, Math.round((val / SCALE) * 100)));
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{label}</span>
                          <span className="text-sm font-bold text-gray-900">{val}/{SCALE}</span>
                        </div>

                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${pct}%`, transition: "width 300ms ease" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary / Summery */}
              {(feedback?.summary || feedback?.summery) && (
                <div>
                  <h4 className="font-semibold text-base mb-2">Summary</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {feedback.summary || feedback.summery}
                  </p>
                </div>
              )}

              {/* Recommendation */}
              {feedback?.Recommendation && (
                <div className={`p-4 rounded-lg ${recommendationBgColor}`}>
                  <div className="flex gap-2 items-start mb-2">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold ${recommendationTextColor}`}>
                      Recommendation: {feedback.Recommendation}
                    </span>
                  </div>
                  {feedback?.RecommendationMsg && (
                    <p className={`text-sm ${recommendationTextColor}`}>
                      {feedback.RecommendationMsg}
                    </p>
                  )}
                </div>
              )}

              {/* Raw JSON fallback (for debugging) */}
              <details className="text-sm text-gray-500">
                <summary className="cursor-pointer font-medium">Raw feedback data</summary>
                <pre className="bg-gray-50 rounded p-3 mt-2 text-xs overflow-auto border border-gray-200">
                  {JSON.stringify(feedback, null, 2)}
                </pre>
              </details>

              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}