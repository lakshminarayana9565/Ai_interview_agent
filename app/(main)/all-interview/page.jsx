"use client";
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useUser } from '@/app/provider';
import supabase from '@/services/supabaseClient';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import InterviewCard from '../dashboard/_components/InterviewCard';

function AllInterviews() {
  const [interviews, setInterviews] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) getInterviewList();
  }, [user]);

  const getInterviewList = async () => {
    try {
      let { data: Interviews, error } = await supabase
        .from('interview')
        .select('*')
        .eq('user_id', user?.id)
        .order('id', { ascending: false })
        .limit(12);

      if (error) throw error;

      setInterviews(Interviews || []);
      console.log(Interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  return (
    <div className='my-5'>
      <h2 className='font-bold text-2xl'>All Interviews List</h2>

      {interviews?.length === 0 ? (
        <div className='p-5 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg mt-5 bg-blue-50'>
          <Video className='h-10 w-10 text-primary'/>
          <h2>No previous interviews found.</h2>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5'>
          {interviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AllInterviews