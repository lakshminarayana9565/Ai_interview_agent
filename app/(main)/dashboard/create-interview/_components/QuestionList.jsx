import axios from 'axios';
import OpenAI from "openai";
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import QuestionListContainer from './QuestionListContainer';
import supabase from '@/services/supabaseClient';
import {useUser} from '@/app/provider';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function QuestionList({formData, onCreateLink}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useUser();
  const [saveLoading, setSaveLoading] = useState(false);
    useEffect(() => {
        if(formData){
            GenerateQuestionList();
        }
    }, [formData]);

    const GenerateQuestionList = async () => {
  setLoading(true);
  try {
    const result = await axios.post('/api/ai-model', { ...formData });
    const responseText = result?.data?.result?.content || '';

    console.log('AI Model Response:', result?.data?.result);

    let extractedQuestions = [];

    // 1️⃣ Try parsing JSON if model returns structured format
    try {
      const json = JSON.parse(responseText);
      if (json?.interviewQuestions) {
        extractedQuestions = json.interviewQuestions.map(q => q.question);
      }
    } catch {
      // 2️⃣ Fallback: smart text-based question detection
      const questionRegex = /(?:^|\n)(?:[-*•]?\s*)([A-Z][^?]{3,200}\?)/g;
      const matches = [...responseText.matchAll(questionRegex)];
      extractedQuestions = matches.map(m => 
        m[1]
          .replace(/\*\*/g, '') // remove bold
          .replace(/[*_`]/g, '') // remove markdown symbols
          .trim()
      );

      // 3️⃣ Also capture inline questions within sentences (for lines like “Example: What is ...?”)
      if (extractedQuestions.length < 5) {
        const inlineMatches = responseText.match(/([A-Z][^.?!]{5,100}\?)/g);
        if (inlineMatches) {
          extractedQuestions.push(...inlineMatches);
        }
      }
    }

    // 4️⃣ Deduplicate + limit to 10 questions
    const uniqueQuestions = [...new Set(extractedQuestions)].slice(0, 10);
    setQuestions(uniqueQuestions);
  } catch (error) {
    console.error('Error generating interview questions:', error);
  } finally {
    setLoading(false);
  }
};

  const onFinish = async () => {
    // Handle finish action
    setSaveLoading(true);
    const interview_id = uuidv4();
    console.log("formaData", formData);
    const { interviewType, ...formDataWithoutType } = formData || {};
    const { data, error } = await supabase
      .from('interview')
      .insert([
        {
          ...formDataWithoutType,
          type: Array.isArray(interviewType) ? interviewType.join(', ') : interviewType || '',
          questionList: questions,
          userEmail: user?.email,
          interview_id: interview_id,
          user_id: user?.id
        },
      ]).select();

      // update user credits
      const userUpdate = await supabase
        .from('Users')
        .update({ credits: Math.max(0, (user?.credits || 0) - 1) })
        .eq('id', user?.id).select();
      
      console.log("User credits updated:", userUpdate);
      console.log("Inserted interview:", data, error);
      setSaveLoading(false);

      onCreateLink(interview_id);
  }

  return (
    <div>
      {loading ? (
        <div className='flex flex-col items-center justify-center gap-4'>
          <Loader2Icon className='animate-spin' />
          <div>
            <h2>Your Questions are generating...</h2>
            <p> Our Ai is crafting the perfect questions for you.</p>
          </div>
        </div>
      ) : (
         <>
          {questions.length > 0 ? (
            <div>
              <QuestionListContainer questions={questions} />
            </div>
          ) : (
            <p className="text-gray-500 italic">No questions generated yet.</p>
          )}
        </>
      )}

      <div className='flex justify-end mt-10'>
        <Button onClick={() => onFinish()} disabled={loading} className="mt-4">
          {saveLoading && <Loader2 className="mr-2" />}
          Create Interview Link
        </Button>
      </div>
    </div>
  )
}

export default QuestionList