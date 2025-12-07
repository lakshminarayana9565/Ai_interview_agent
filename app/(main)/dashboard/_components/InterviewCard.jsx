import React from 'react';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Copy, Send, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

function InterviewCard({ interview, viewDetail = false }) {
  const host = process.env.NEXT_PUBLIC_HOST_URL;
  const interviewUrl = `${host}/${interview?.interview_id}`;

  const copylink = async () => {
    try {
      await navigator.clipboard.writeText(interviewUrl);
      toast.success('Interview link copied to clipboard!');
    } catch (err) {
      console.error('Copy failed', err);
      toast.error('Failed to copy link');
    }
  };

  const onsend = () => {
    const mailto = `mailto:?subject=Interview Link&body=Please join the interview using the following link: ${interviewUrl}`;
    window.location.href = mailto;
    toast.success('Opened mail client');
  };

  console.log("Interview Card Rendered:", interview);

  return (
    <article
      className="w-full bg-[rgba(34,197,94,0.06)] border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
      aria-label={`Interview ${interview?.jobPosition}`}
      style={{ minHeight: 180 }}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-md font-semibold text-gray-800 truncate">{interview?.jobPosition ?? 'Untitled Role'}</h3>
          <p className="text-sm text-gray-500 mt-1 truncate">{interview?.duration ? `${interview.duration} minutes` : 'Duration N/A'}</p>
          <p className="text-xs text-gray-400 mt-2">{moment(interview?.created_at).format('MMM D, YYYY • h:mm A')}</p>
        </div>

      </header>

      <div className="mt-4 text-sm text-gray-700 flex-1">
        <p className="line-clamp-3">{interview?.jobDescription ?? 'No description provided.'}</p>
      </div>

      <footer className="mt-5 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copylink} aria-label="Copy interview link">
            <Copy className="mr-2" /> Copy
          </Button>

          <Button variant="outline" size="sm" onClick={onsend} aria-label="Send interview link">
            <Send className="mr-2" /> Send
          </Button>
        </div>
      </footer>
      <footer className="mt-5 flex items-center justify-between">
      <div className="ml-auto">
          {viewDetail ? (
            <Link href={`/scheduled-interview/${interview?.interview_id}/details`}>
                <Button size="sm" onClick={() => {}} aria-label="View details">
                  View <ArrowRight className="ml-2" />
                </Button>
            </Link>
          ) : (
            <Link href={interviewUrl}>
                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                  Join <ArrowRight className="ml-2" />
                </Button>
            </Link>
          )}
        </div>
        </footer>
    </article>
  );
}

export default InterviewCard;