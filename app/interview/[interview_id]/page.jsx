"use client";
import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon, Video } from "lucide-react";
import supabase from "@/services/supabaseClient";
import { InterviewDataContext } from "@/context/InterviewDataContext";

function Interview() {
  const { interview_id } = useParams();
  const router = useRouter();

  const [interviewData, setInterviewData] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);

  useEffect(() => {
    if (interview_id) GetInterviewDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview_id]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      const { data: Interviews, error } = await supabase
        .from("interview")
        .select("jobPosition,jobDescription,duration,questionList,created_at")
        .eq("interview_id", interview_id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching interview details:", error);
        setInterviewData(null);
      } else {
        setInterviewData(Interviews ?? null);
      }
    } catch (err) {
      console.error("Unexpected error fetching interview:", err);
      setInterviewData(null);
    } finally {
      setLoading(false);
    }
  };

  const onjoinInterview = async () => {
    if (!userName) return;
    setLoading(true);
    try {
      const { data: Interviews } = await supabase
        .from("interview")
        .select("*")
        .eq("interview_id", interview_id)
        .maybeSingle();

      const interviewRow = Interviews ?? interviewData ?? null;

      setInterviewInfo({
        userName,
        interviewData: interviewRow,
      });

      router.push(`/interview/${interview_id}/start`);
    } catch (err) {
      console.error("Error joining interview:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <main
          className="bg-white rounded-2xl border p-6 md:p-10 shadow-sm"
          style={{ boxShadow: "0 14px 30px rgba(34,197,94,0.06)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Image
                src="/LOGIN.webp"
                alt="Interview illustration"
                width={520}
                height={360}
                className="w-full max-w-md rounded-lg"
                priority
              />

              <div className="mt-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-900">
                  {interviewData?.jobPosition ?? "Interview"}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  {interviewData?.jobDescription ?? "No description provided for this interview."}
                </p>
              </div>
            </div>

            <aside className="w-full">
              <div className="bg-[rgba(34,197,94,0.03)] rounded-xl p-6 border border-green-50">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Enter your details</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Provide your name to join the interview. Make sure your microphone and camera (if using video) are working.
                </p>

                <label className="text-xs text-gray-600">Full name</label>
                <Input
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-2"
                  aria-label="Your name"
                />

                <div className="mt-4">
                  <Button
                    onClick={onjoinInterview}
                    disabled={!userName || loading}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? <Loader2Icon className="animate-spin h-4 w-4" /> : <Video className="h-4 w-4" />}
                    <span>Join Interview</span>
                  </Button>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  By joining you agree to the interview terms. You can leave anytime.
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Interview;