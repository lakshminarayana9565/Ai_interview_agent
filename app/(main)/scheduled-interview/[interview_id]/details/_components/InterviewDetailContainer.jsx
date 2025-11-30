import React from 'react'

function InterviewDetailContainer({interviewDetail}) {
  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="p-6 bg-white rounded-xl shadow-md border">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">Interview Details</h2>
            <p className="text-sm text-gray-500 mt-1">Overview for this interview</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div>Created: <span className="font-medium">{interviewDetail?.created_at ?? '—'}</span></div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm text-gray-500">Job Position</h3>
              <p className="font-medium">{interviewDetail?.jobPosition ?? '—'}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Duration</h3>
              <p className="font-medium">{interviewDetail?.duration ?? '—'} minutes</p>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-sm text-gray-500">Job Description</h3>
              <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-3 rounded">{interviewDetail?.jobDescription ?? '—'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-500">Questions</h3>
            <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded border">
              {(interviewDetail?.questionList && interviewDetail.questionList.length > 0) ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {interviewDetail.questionList.map((q, i) => (
                    <li key={i} className="py-1">{q}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No questions available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewDetailContainer