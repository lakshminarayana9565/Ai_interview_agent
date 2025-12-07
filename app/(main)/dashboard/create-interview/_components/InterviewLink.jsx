import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy, Mail, ArrowLeft, Plus, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function InterviewLink({ interviewId, formData }) {
  const router = useRouter()
  const host = process.env.NEXT_PUBLIC_HOST_URL?.replace(/\/$/, '')
  const url = `${host}/${interviewId}`

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Interview link copied to clipboard!')
    } catch (err) {
      console.error('Copy failed', err)
      toast.error('Failed to copy link')
    }
  }

  const onShareEmail = () => {
    const subject = encodeURIComponent(`Interview Invitation: ${formData?.jobPosition ?? 'Interview'}`)
    const body = encodeURIComponent(`Please join the interview using the following link:\n\n${url}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const onShareWhatsapp = () => {
    const text = encodeURIComponent(`Join the interview: ${formData?.jobPosition ?? ''}\n${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="pt-2">
      <div className="bg-white rounded-xl border shadow-sm w-full max-w-4xl"
           style={{ boxShadow: '0 10px 30px rgba(34,197,94,0.06)' }}>
        <div className="p-6 bg-[rgba(34,197,94,0.03)] border-b">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Image src="/arrow.webp" alt="success" width={56} height={56} className="rounded-md" />
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 truncate">Interview Created</h2>
                <p className="text-sm text-gray-500 truncate">
                  The interview link is ready. Share it with candidates or go back to dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => router.back()} className="hidden sm:inline-flex">
                <ArrowLeft className="mr-2" /> Back
              </Button>
              <Link href="/dashboard" className="inline-flex">
                <Button variant="outline"><Plus className="mr-2" />New</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-sm text-gray-500">Interview Link</label>
            <div className="flex gap-3 items-center">
              <Input defaultValue={url} readOnly disabled className="flex-1" />
              <Button onClick={onCopyLink} aria-label="Copy link">
                <Copy className="mr-2" /> Copy
              </Button>
            </div>

            <div className="mt-2 bg-white border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700">Interview Details</h3>
              <div className="mt-3 text-sm text-gray-600 space-y-2">
                <div><span className="font-semibold text-gray-800">Position:</span> {formData?.jobPosition ?? '—'}</div>
                <div><span className="font-semibold text-gray-800">Duration:</span> {formData?.duration ? `${formData.duration} mins` : '—'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700">Share</h3>
              <p className="text-sm text-gray-500 mt-1">Quickly share the interview link via email or WhatsApp.</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={onShareEmail} className="w-full" variant="outline">
                  <Mail className="mr-2" /> Email
                </Button>
                <Button onClick={onShareWhatsapp} className="w-full" variant="outline">
                  <MessageSquare className="mr-2" /> WhatsApp
                </Button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700">More Actions</h3>
              <div className="mt-3 flex gap-3">
                <Link href={`/interview/${interviewId}`} className="flex-1">
                  <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                    Start Interview
                  </Button>
                </Link>
                <Link href="/dashboard" className="flex-1">
                  <Button variant="ghost" className="w-full">Go to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-white/50 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500">Link valid for 30 days. You can regenerate later from the interview details.</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onCopyLink}><Copy /></Button>
            <Button variant="ghost" onClick={onShareEmail}><Mail /></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewLink