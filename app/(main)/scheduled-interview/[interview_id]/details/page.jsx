"use client";
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import InterviewDetailContainer from './_components/InterviewDetailContainer';
import supabase from '@/services/supabaseClient';
import CandidateList from './_components/CandidateList';

function InterviewDetail() {
  const { interview_id } = useParams();
  const {user} = useParams();
  const [interviewDetail, setInterviewDetail] = React.useState(null);

  useEffect(() => { 
    GetInterviewDetail();
  }, []);

  const GetInterviewDetail = async () => {
    const result= await supabase
        .from('interview')
        .select('jobPosition,jobDescription,questionList,type,created_at,duration,interview_id,interview-feedback(userName,feedback,created_at)')
        .eq('interview_id', interview_id)
        .order('id', { ascending: false });
    setInterviewDetail(result?.data[0]);
    console.log("Interview Detail:", result?.data[0]);
  }

  return (
    <div>
        <h2>
            Interview Detail Page
        </h2>
        <InterviewDetailContainer interviewDetail={interviewDetail} />
        <CandidateList candidateList={interviewDetail?.['interview-feedback']} />
    </div>
  )
}

export default InterviewDetail