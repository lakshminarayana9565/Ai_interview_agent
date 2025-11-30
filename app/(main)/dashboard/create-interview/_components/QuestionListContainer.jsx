import React from 'react'

function QuestionListContainer({ questions }) {
  return (
    <div>
              <h2 className="text-2xl font-bold mb-4">Generated Interview Questions</h2>
            <div className="p-5 border border-gray-300 rounded-md bg-gray-50">
              {questions.map((question, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-md mb-2 bg-white flex gap-3">
                  <span className="font-medium">{index + 1}.</span>
                  <span>{question}</span>
                </div>
              ))}
            </div>
            </div>
  )
}

export default QuestionListContainer