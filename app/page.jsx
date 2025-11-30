"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-100">
        <Image src="/LOGO.jpg" alt="AI Recruiter Logo" width={400} height={400} className="mb-2" />
        <h1 className="text-4xl font-bold text-blue-900 mb-2 text-center">AI Interview Scheduler</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          Effortlessly schedule, conduct, and review interviews with AI-powered assistance. Save time, get instant feedback, and streamline your hiring process.
        </p>
        <div className="flex flex-col gap-4 w-full">
          <Link href="/auth" className="w-full">
            <Button className="w-full bg-blue-600 text-white text-lg py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} AI Interview Scheduler. All rights reserved.
        </div>
      </div>
    </div>
  );
}
