"use client";
import { Timer, Mic as MicIcon, Video as VideoIcon, MicOff, VideoOff, PhoneOff } from 'lucide-react';
import React, { useEffect, useContext, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { InterviewDataContext } from '@/context/InterviewDataContext';
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import supabase from '@/services/supabaseClient';

export default function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const vapiRef = useRef(null);
  const feedbackSavedRef = useRef(false);
  const [speaking, setSpeaking] = useState(null); // 'assistant' | 'user' | null
  const { interview_id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const localStreamRef = useRef(null);
  const videoRef = useRef(null);

  const GenerateFeedback = useCallback(async () => {
    if (feedbackSavedRef.current) return;
    feedbackSavedRef.current = true;
    try {
      setLoading(true);
      const result = await axios.post('/api/ai-feedback', {
        conversation: [], // keep lightweight — backend may read stored conversation
        interview_id,
        user_id: interviewInfo?.userId,
      });
      const Content = result?.data?.result?.content || '';
      const FINAL_CONTENT = Content.replace('```json', '').replace('```', '').trim();
      console.log("Generated Feedback:", interviewInfo?.interviewData?.user_id);
      const { data, error } = await supabase
        .from('interview-feedback')
        .insert([{
          userName: interviewInfo?.userName,
          interview_id,
          feedback: JSON.stringify(FINAL_CONTENT),
          recommend: false,
          user_id: interviewInfo?.interviewData?.user_id
        }]).select();

      console.log("Feedback saved to database:", data, error);
      router.replace(`/interview/${interview_id}/completed`);
    } catch (err) {
      console.error("GenerateFeedback error:", err);
      feedbackSavedRef.current = false;
      toast.error("Failed to save feedback");
    } finally {
      setLoading(false);
    }
  }, [interviewInfo, interview_id, router]);

  useEffect(() => {
    // init Vapi once
    const v = new Vapi(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
    vapiRef.current = v;

    const handleMessage = (message) => {
      // Lightweight detection: if message includes assistant/user labels set speaking
      const convo = message?.conversation ?? message;
      try {
        let parsed = convo;
        if (typeof convo === 'string') parsed = JSON.parse(convo);
        const last = Array.isArray(parsed) ? parsed[parsed.length - 1] : parsed;
        const role = (last?.role || last?.speaker || '').toString().toLowerCase();
        if (role.includes('assist') || role.includes('ai')) setSpeaking('assistant');
        else if (role.includes('user') || role.includes('candidate') || role.includes('human')) setSpeaking('user');
      } catch {
        // ignore parse errors
      }
    };

    const onCallStart = () => toast.success("Interview started");
    const onCallEnd = () => { toast.success("Interview ended"); GenerateFeedback(); };
    const onSpeechStart = (ev) => {
      // some SDKs may pass speaker id — we map heuristically
      if (ev?.speaker && ev.speaker.toLowerCase().includes('assistant')) setSpeaking('assistant');
      else setSpeaking('user');
    };
    const onSpeechEnd = () => setSpeaking(null);

    v.on?.("message", handleMessage);
    v.on?.("call-start", onCallStart);
    v.on?.("call-end", onCallEnd);
    v.on?.("speech-start", onSpeechStart);
    v.on?.("speech-end", onSpeechEnd);

    return () => {
      v.off?.("message", handleMessage);
      v.off?.("call-start", onCallStart);
      v.off?.("call-end", onCallEnd);
      v.off?.("speech-start", onSpeechStart);
      v.off?.("speech-end", onSpeechEnd);
      try { v.stop && v.stop(); } catch (e) { /* noop */ }
      vapiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   const ensureStream = async (needAudio = micOn, needVideo = camOn) => {
    try {
      const constraints = { audio: !!needAudio, video: !!needVideo };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      localStreamRef.current = stream;
      // set track enabled flags according to desired state
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !!needAudio));
      localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !!needVideo));
      setLocalStreamToVapi(localStreamRef.current);
      // attach preview if video element exists
      const vid = videoRef.current;
      if (vid && needVideo) {
        try {
          vid.srcObject = stream;
          vid.muted = true;
          await vid.play().catch(() => {});
        } catch (e) {
          /* ignore autoplay policy errors */
        }
      }
      return localStreamRef.current;
    } catch (err) {
      console.error("getUserMedia failed:", err);
      toast.error("Unable to access microphone/camera. Check permissions.");
      return null;
    }
  };

  const setLocalStreamToVapi = (stream) => {
    const v = vapiRef.current;
    if (!v || !stream) return;
    try {
      if (typeof v.setLocalStream === "function") v.setLocalStream(stream);
      else if (v.call && typeof v.call.setLocalStream === "function") v.call.setLocalStream(stream);
      else if (typeof v.addLocalStream === "function") v.addLocalStream(stream);
      else console.debug("No compatible method to attach local stream to Vapi instance");
    } catch (e) {
      console.warn("Failed to attach local stream to Vapi:", e);
    }
  };

  useEffect(() => {
    // start call when Vapi is ready
    if (interviewInfo && vapiRef.current) startNewCall();
  }, [interviewInfo]);

  const startNewCall = () => {
    const v = vapiRef.current;
    if (!v) return;
    const questionList = interviewInfo?.interviewData?.questionList ?? [];
    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName || "Candidate"}, ready?`,
      transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
      voice: { provider: "playht", voiceId: "jennifer" },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [{ role: "system", content: `You are an AI interviewer. Questions: ${JSON.stringify(questionList)}` }]
      }
    };
    if (typeof v.start === "function") v.start(assistantOptions);
    else if (typeof v.startCall === "function") v.startCall(assistantOptions);
    else if (v.call && typeof v.call.start === "function") v.call.start(assistantOptions);
    else console.error("No start method on Vapi instance");
  };

  const stopInterview = async () => {
    const v = vapiRef.current;
    try {
      v.stopCall();
    } catch (e) {
      console.warn("Error stopping call:", e);
    }
    // ensure feedback saved and navigate
    await GenerateFeedback();
  };

  // hangup control used by UI
  const onHangup = async () => {
    setLoading(true);
    await stopInterview();
    setLoading(false);
  };

  const toggleCam = async () => {
    if (!camOn) {
      const stream = await ensureStream(micOn, true);
      if (stream) setCamOn(true);
      return;
    }

    // Turn camera off: stop & remove video tracks so OS camera LED actually turns off
    const s = localStreamRef.current;
    if (s) {
      const videoTracks = s.getVideoTracks();
      videoTracks.forEach((t) => {
        try { t.stop(); } catch (e) {}
        try { s.removeTrack(t); } catch (e) {}
      });

      // if no tracks left (no audio either) release stream reference
      if (s.getTracks().length === 0) {
        try {
          s.getTracks().forEach((t) => t.stop());
        } catch {}
        localStreamRef.current = null;
      }
    }

    setCamOn(false);

    // detach preview element
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch (e) {}
    }
  };

  return (
    <div className="min-h-screen bg-gray-900/60 py-8 px-4 flex items-start justify-center">
      <div className="w-full max-w-7xl">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6 text-white">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Interview — {interviewInfo?.interviewData?.jobPosition ?? 'Session'}</h1>
            <div className="hidden sm:flex items-center gap-2 text-sm bg-white/6 px-2 py-1 rounded-full">
              <Timer className="w-4 h-4 text-green-300" />
              <span className="text-green-200">{interviewInfo?.interviewData?.duration ?? '—'} mins</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-white/70">Participants</div>
            <div className="flex items-center -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200/20 border border-white/20 flex items-center justify-center text-xs text-white">AI</div>
              <div className="w-8 h-8 rounded-full bg-green-100/20 border border-white/20 flex items-center justify-center text-xs text-white">{(interviewInfo?.userName?.charAt(0) ?? 'C')}</div>
            </div>
          </div>
        </div>

        {/* Main Teams-like area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI panel */}
          <div className="relative bg-black rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: 360 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
            <div className="z-10 flex flex-col items-center gap-3">
              <div className="relative">
                <Image src="/interviwer.png" alt="AI Recruiter" width={160} height={160} className="rounded-full object-cover" />
                {speaking === 'assistant' && (
                  <span className="absolute -right-2 -bottom-2 w-4 h-4 rounded-full bg-green-400 ring-2 ring-white animate-pulse" />
                )}
              </div>
              <div className="text-center text-white">
                <div className="font-semibold">AI Recruiter</div>
                <div className="text-xs text-white/70">Automated interviewer</div>
              </div>
            </div>
          </div>

          {/* Candidate panel */}
          <div className="relative bg-black rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: 360 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
            <div className="z-10 flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-[160px] h-[160px] rounded-full bg-green-50 flex items-center justify-center text-3xl text-green-700">
                  {interviewInfo?.userName?.charAt(0) ?? 'C'}
                </div>
                {speaking === 'user' && (
                  <span className="absolute -right-2 -bottom-2 w-4 h-4 rounded-full bg-green-400 ring-2 ring-white animate-pulse" />
                )}
              </div>
              <div className="text-center text-white">
                <div className="font-semibold">{interviewInfo?.userName ?? 'Candidate'}</div>
                <div className="text-xs text-white/70">{interviewInfo?.interviewData?.jobPosition ?? ''}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom control bar */}
        <div className="mt-6 flex items-center justify-center">
          <div className="bg-white/6 px-4 py-3 rounded-full flex items-center gap-6">
            <button
              onClick={() => setMicOn((s) => !s)}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white"
              aria-label="Toggle mic"
            >
              {micOn ? <MicIcon className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleCam}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white"
              aria-label="Toggle camera"
            >
              {camOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onHangup}
              disabled={loading}
              className="w-16 h-16 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white shadow-lg"
              aria-label="Hang up"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

            <div className="ml-6 text-white/80 text-sm">
              {loading ? "Ending..." : "In call"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}