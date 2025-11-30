import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request) {

    const {conversation} = await request.json();
    const FINAL_PROMT=FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));

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
                        content: FINAL_PROMT
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