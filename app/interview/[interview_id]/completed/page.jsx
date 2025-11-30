"use client"
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function InterviewCompleted() {
  const { interview_id } = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div
          className="bg-white rounded-xl p-8 shadow-sm border"
          style={{ boxShadow: "0 12px 24px rgba(34,197,94,0.06)" }}
        >
          <h1 className="text-2xl font-semibold mb-2">Thank you — Interview completed</h1>
        </div>
      </div>
    </div>
  );
}