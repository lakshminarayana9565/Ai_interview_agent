import { Button } from '@/components/ui/button';
import React from 'react';
import moment from 'moment';
import CandidateFeedbackDialog from './CandidateFeedbackDialog';

function CandidateList({ candidateList }) {
  console.log("CandidateList:", candidateList);
  // normalize candidateList so we always iterate an array
  let list = [];

  if (Array.isArray(candidateList)) {
    list = candidateList;
  } else if (typeof candidateList === 'string') {
    // try JSON first, then fallback to comma-separated names
    try {
      const parsed = JSON.parse(candidateList);
      if (Array.isArray(parsed)) list = parsed;
      else if (parsed && typeof parsed === 'object') list = [parsed];
      else list = String(parsed).split(',').map(s => s.trim()).filter(Boolean).map(name => ({ userName: name }));
    } catch {
      // not JSON — assume comma/line separated values
      list = candidateList
        .split(/\r?\n|,/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(name => ({ userName: name }));
    }
  } else if (candidateList && typeof candidateList === 'object') {
    list = [candidateList];
  } else {
    list = [];
  }

  const renderFeedback = (fb) => {
    if (!fb) return 'No feedback';
    if (typeof fb === 'string') {
      try {
        const p = JSON.parse(fb);
        if (typeof p === 'string') return p;
        if (Array.isArray(p)) return p.map(m => (m.content ?? m.text ?? JSON.stringify(m))).join('\n\n');
        if (typeof p === 'object') return JSON.stringify(p, null, 2);
        return String(p);
      } catch {
        return fb;
      }
    }
    if (Array.isArray(fb)) return fb.map(m => (m.content ?? m.text ?? JSON.stringify(m))).join('\n\n');
    if (typeof fb === 'object') return JSON.stringify(fb, null, 2);
    return String(fb);
  };

  return (
    <div className=''>
      <h2 className='text-2xl font-semibold mb-4'>Candidates ({list.length})</h2>

      {list.length === 0 ? (
        <div className='p-4 text-sm text-gray-500'>No candidates found.</div>
      ) : (
        list.map((candidate, idx) => (
          <div
            key={candidate?.userId ?? candidate?.userName ?? idx}
            className='mb-4 p-4 border rounded-lg bg-gray-50'
          >
            <h3 className='font-medium'>{candidate?.userName ?? `Candidate ${idx + 1}`}</h3>
            <h3>Completed On: { moment(candidate?.created_at).format('MMMM Do YYYY, h:mm:ss a') }</h3>
            <CandidateFeedbackDialog candidate={candidate} FeedbackDetails={candidate?.feedback ?? candidate?.interview_feedback} />
          </div>
        ))
      )}
    </div>
  )
}

export default CandidateList