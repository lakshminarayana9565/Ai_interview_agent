import { NextResponse } from "next/server";
import { QUESTION_PROMPT } from "@/services/Constants";
import OpenAI from "openai";

export async function POST(req) {
    const { jobPosition, jobDescription, duration, interviewType } = await req.json();
    const type = Array.isArray(interviewType) ? interviewType.join(', ') : interviewType || '';
    const FINAL_PROMT = QUESTION_PROMPT
        .replace('{jobRole}', jobPosition)
        .replace('{jobDescription}', jobDescription)
        .replace('{duration}', duration)
        .replace('{type}', type);

    console.log('Final Prompt:', FINAL_PROMT);

    if (!process.env.OPENROUTER_API_KEY) {
        return NextResponse.json({ error: 'Missing OpenRouter API key' }, { status: 500 });
    }

    try {
        const openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: `I am interviewing for a ${jobPosition} position. Here is the job description: ${jobDescription}. The interview will last for ${duration} minutes and will be a ${type} interview.`
                }
            ],
        });
        return NextResponse.json({ result: completion.choices[0].message });
    }
    catch (error) {
        console.error('Error generating interview questions:', error);
        return NextResponse.json({ error: 'Failed to generate interview questions' }, { status: 500 });
    }
}
