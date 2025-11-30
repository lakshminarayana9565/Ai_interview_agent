"use client"
import React, {useEffect, useState} from 'react'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INTERVIEWTYPES } from '@/services/Constants';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

function FormContainer({onHandleInputChange, GoToNext}) {
    const [interviewTypes, setInterviewTypes] = useState([]);

    useEffect(() => {
        onHandleInputChange('interviewType', interviewTypes);
    }, [interviewTypes]);

    const toggleInterviewType = (typeTitle) => {
        setInterviewTypes(prev =>
            prev.includes(typeTitle)
                ? prev.filter(t => t !== typeTitle)
                : [...prev, typeTitle]
        );
    };

    return (
        <div className='pt-5'>
            <div>
                <h2 className='text-sm font-bold'>Job Position</h2>
                <Input placeholder='e.g. Software Engineer' 
                    className='mt-2 mb-4'
                    onChange={(e) => onHandleInputChange('jobPosition', e.target.value)}
                />
            </div>
            <div className='mt-4'>
                <h2 className='text-sm font-bold'>Job Description</h2>
                <Textarea placeholder='e.g. Responsible for developing software solutions.' className='mt-2 mb-4 bg-gray-100' onChange={(e) => onHandleInputChange('jobDescription', e.target.value)} />
            </div>
            <div className='mt-4'>
                <h2 className='text-sm font-bold'>Interview Duration</h2>
                <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
                    <SelectTrigger className='w-[180px] mt-2 mb-4'>
                        <SelectValue placeholder='Select duration' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='15'>15 minutes</SelectItem>
                        <SelectItem value='30'>30 minutes</SelectItem>
                        <SelectItem value='45'>45 minutes</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='mt-4'>
                <h2 className='text-sm font-bold'>Interview Type</h2>
                <div className='flex gap-3 flex-wrap'>
                    {INTERVIEWTYPES.map((type, index) => (
                        <div
                            key={index}
                            className='flex gap-2 p-1 px-2 bg-blue-50 border border-gray-200 rounded-lg w-max mt-2 cursor-pointer hover:shadow-md'
                            onClick={() => toggleInterviewType(type.title)}
                            style={{ borderColor: interviewTypes.includes(type.title) ? '#3b82f6' : '#e5e7eb' }}
                        >
                            <type.icon
                                className={`h-4 w-4 ${interviewTypes.includes(type.title) ? 'text-blue-600' : 'text-primary'}`}
                            />
                            <span className={interviewTypes.includes(type.title) ? 'font-bold text-blue-600' : ''}>
                                {type.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='mt-7 flex justify-end'>
                <Button className='mt-6 cursor-pointer' onClick={() => GoToNext()}>Generate Question <ArrowRight /></Button>
            </div>
        </div>
    )
}

export default FormContainer