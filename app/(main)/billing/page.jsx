"use client";
import React from "react";
import { useUser } from "@/app/provider";
import PayButton from "./_components/PayButton";

export default function BillingPage() {
  // Example credit values
  const { user } = useUser();
  const currentCredits = user?.credits || 0;
  const remainingCredits = [
    { label: "Basic Credits", amount: 3, color: "bg-blue-100 text-blue-700", interview_number : 10, credits : 10 },
    { label: "Standard Credits", amount: 5, color: "bg-green-100 text-green-700", interview_number : 20, credits : 20 },
    { label: "Premium Credits", amount: 10, color: "bg-green-100 text-green-700", interview_number : 50, credits : 50 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Billing & Credits</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
        {/* Current Credits Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border border-blue-100">
          <span className="text-lg font-semibold text-gray-500 mb-2">Current Credits</span>
          <span className="text-5xl font-bold text-blue-700 mb-2">{currentCredits}</span>
          <span className="text-sm text-gray-400">{currentCredits} Interviews Available</span>
        </div>

        {/* Remaining Credits Cards */}
        {remainingCredits.map((credit, idx) => (
          <div
            key={credit.label}
            className={`rounded-xl shadow-lg p-8 flex flex-col items-center border ${credit.color} border-opacity-40`}
          >
            <span className="text-lg font-semibold mb-2">{credit.label}</span>
            <span className="text-4xl font-bold mb-2">${credit.amount}</span>
            <span className="text-2xl font-semibold mb-2">{credit.interview_number} Interviews</span>
            <div className="m-2">
                <PayButton amount={credit.amount} credits={credit.credits} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}