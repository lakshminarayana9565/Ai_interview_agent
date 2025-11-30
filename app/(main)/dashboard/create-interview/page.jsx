"use client"
import React, {use, useState} from 'react';
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress'; 
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import { toast } from 'sonner';
import InterviewLink from './_components/InterviewLink';
import { useUser } from '@/app/provider';

function CreateInterview() {
const router = useRouter();
const [step, setStep] = useState(1);
const [formData, setFormData] = useState();
const [interviewId, setInterviewId] = useState(null);
const { user } = useUser();
const onHandleInputChange = (field,value) => {
    setFormData({ ...formData, [field]: value });
    console.log("formData", formData);
  };

const onGoToNext = () => {
    if(user?.credits <=0) {
        toast.error("You have insufficient credits to create a new interview. Please purchase more credits to proceed.");
        return;
    }
    if(!formData?.jobPosition || !formData?.jobDescription || !formData?.duration) {
        return toast("Please fill all fields and select at least one interview type");

    }
    setStep(step + 1);
};

const onCreateLink = (interview_id) => {
    setInterviewId(interview_id);
    setStep(step + 1);
}

  return (
    <div  className='mt-1 px-5 md:px-24 lg:px-24 xl:px-36'>
        <div  className='flex gap-5 items-center'>
            <ArrowLeft onClick={() => router.back()} className='cursor-pointer'/>
            <h2 className='font-bold text-2xl'>Create Interview</h2>
        </div>
        <div>
            <Progress value={step * 33} />
            <div className='m-4 pl-10 pr-10'>
                {step === 1 && <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={onGoToNext} />}
                {step === 2 && <QuestionList formData={formData} onCreateLink={(interview_id) => onCreateLink(interview_id)} />}
                {step === 3 && <InterviewLink interviewId={interviewId} formData={formData} />}
            </div>
        </div>
    </div>
  )
}

export default CreateInterview