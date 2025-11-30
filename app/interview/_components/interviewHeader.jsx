"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";

export default function InterviewHeader({ title = "AI Interview Scheduler", subtitle = "Conduct interviews with AI" }) {
  const router = useRouter();
  const { user } = useUser();

  return (
    <header
      className="w-full bg-white rounded-xl p-3 md:p-4 flex items-center justify-between gap-4"
      style={{ boxShadow: "0 12px 24px rgba(34,197,94,0.06)" }}
    >
      <div className="flex items-center gap-4">
          <Image src="/LOGO.jpg" alt="LOGO" width={120} height={100} className="rounded-md object-cover" />
          <div className="min-w-0">
            <h1 className="text-sm md:text-base font-semibold leading-tight truncate">{title}</h1>
          </div>
      </div>

      <div className="flex items-center gap-3">

        {user ? (
          <div className="flex items-center gap-3">
            {user.picture ? (
              <Image
                src={user.picture}
                alt={user.name || "User avatar"}
                width={35}
                height={35}
                className="rounded-full object-cover border border-gray-100"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-green-700 font-medium">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="text-right">
              <div className="text-sm font-medium truncate" title={user.name}>{user.name ?? "User"}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/auth">
              <Button size="sm">Sign in</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}