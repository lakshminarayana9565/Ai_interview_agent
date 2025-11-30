"use client"
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { Inter } from 'next/font/google';
import React, {use, useState} from 'react';
import { useEffect } from 'react';
import { useUser } from '@/app/provider';
import supabase from '@/services/supabaseClient';
import InterviewCard from './InterviewCard';

function LatestInterviewsList() {
    const [interviews, setInterviews] = useState([]);
    const user = useUser();

    useEffect(() => {
        user && getInterviewList();
    }, [user]);

    const getInterviewList = async () => {
        try {
            let { data: Interviews, error } = await supabase
                .from('interview')
                .select('*')
                .eq('user_id', user?.user?.id)
                .order('id', { ascending: false })
                .limit(6);

            if (error) throw error;

            setInterviews(Interviews);
            console.log(Interviews);
        } catch (error) {
            console.error("Error fetching interviews:", error);
        }
    };

  return (

    <div className='my-4'>
        <h2 className='text-2xl font-semibold'>Previous Interviews List</h2>
        {interviews?.length === 0 && (
            <div className='p-5 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg mt-5 bg-blue-50'>
                <Video className='h-10 w-10 text-primary'/>
                <h2>No previous interviews found.</h2>
        </div>
        )}

        {interviews?.length > 0 && (
            <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
                {interviews.map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} />
                ))}
            </div>
        )}
    </div>
  )
}

export default LatestInterviewsList