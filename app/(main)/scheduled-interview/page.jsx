"use client";
import { useUser } from '@/app/provider'
import supabase from '@/services/supabaseClient';
import { Inter } from 'next/font/google';
import React, { useEffect } from 'react'
import InterviewCard from '../dashboard/_components/InterviewCard';

function ScheduledInterviews() {
    const {user} = useUser();
    const [interviews,setInterviews]=React.useState([]);

    useEffect(() => {
        user && GetInterviewList();
    }, [user]);

    const GetInterviewList=async () => {
        const result= await supabase
        .from('interview')
        .select('jobPosition,jobDescription,duration,interview_id,interview-feedback(feedback)')
        .eq('user_id', user?.id)
        .order('id', { ascending: false });

        setInterviews(result); 
    }
  return (
    <div>
      <h1 className='text-2xl font-semibold'>Interview List with candidate feedback</h1>
      <ul>
        <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
        {interviews?.data?.map(interview => (
          <InterviewCard key={interview.interview_id} interview={interview}
            viewDetail={true}
           />
        ))}
        </div>
      </ul>
    </div>
  )
}

export default ScheduledInterviews