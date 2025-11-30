"use client"
import React from "react"
import Link from "next/link"
import { Video, Phone, ArrowRight } from "lucide-react"

export default function CreateOptions() {
  return (
    <section className="w-full">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Create Interview</h3>
          <p className="text-sm text-gray-500">Choose a format and get started — powered by AI to help you assess candidates faster.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/dashboard/create-interview"
          aria-label="Create Video Interview"
          className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Video className="w-6 h-6" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-lg font-semibold">Video Interview</h4>
              <p className="mt-1 text-sm text-gray-500">
                Create a video interview to assess candidates remotely with recorded responses and AI assistance.
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1">Recommended</span>
                <span className="text-xs text-gray-400">Avg. duration: 30–45 mins</span>
              </div>
            </div>

            <div className="ml-3 hidden sm:flex items-center">
              <div className="rounded-full bg-gray-100 p-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/create-interview?mode=phone"
          aria-label="Create Phone Interview"
          className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Phone className="w-6 h-6" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-lg font-semibold">Phone Interview</h4>
              <p className="mt-1 text-sm text-gray-500">
                Quick phone interviews to screen candidates. Lightweight workflow with automatic notes and feedback.
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1">Fast</span>
                <span className="text-xs text-gray-400">Avg. duration: 10–20 mins</span>
              </div>
            </div>

            <div className="ml-3 hidden sm:flex items-center">
              <div className="rounded-full bg-gray-100 p-2 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}