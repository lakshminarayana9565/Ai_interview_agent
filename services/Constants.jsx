import { LayoutDashboard,Calendar,List,DollarSign, Code2Icon, User2Icon, Puzzle, BriefcaseBusinessIcon} from 'lucide-react'
export const SideBarOptions = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Scheduled Interview", icon: Calendar, path: "/scheduled-interview" },
  { name: "All Interview", icon: List, path: "/all-interview" },
  { name: "Billing", icon: DollarSign, path: "/billing" },
]

export const INTERVIEWTYPES = [
  {
    title: 'Techical',
    icon: Code2Icon
  },
  {
    title: 'Behavioral',
    icon: User2Icon
  },
  {
    title: 'Experience',
    icon: BriefcaseBusinessIcon
  },
  {
    title: 'Problem Solving',
    icon: Puzzle
  },

]

export const QUESTION_PROMPT = `
You are an expert technical interviewer. Based on the following inputs, return exactly 10 concise interview questions as valid JSON.

Inputs:
1. Job Role: {jobRole}
2. Job Description: {jobDescription}
3. Interview Duration: {duration}
4. Interview Type: {type}

Instructions:
- Analyze the role and description to identify key skills and concepts.
- Generate 10 clear and relevant interview questions covering:
  - Technical knowledge
  - Problem solving
  - Behavioral aspects
  - Experience-based understanding
- Do NOT include explanations, preparation tips, markdown, or text outside JSON.
- Each question object must include:
  - "question": the question text
  - "type": one of ["Technical", "Behavioral", "Experience", "Problem Solving"]
- Return ONLY valid JSON. No commentary or formatting.

Expected JSON structure:
{
  "interviewQuestions": [
    {
      "question": "What is JSX in React?",
      "type": "Technical"
    },
    {
      "question": "Describe a challenge you faced when optimizing a .NET API.",
      "type": "Experience"
    }
  ]
}
`

export const FEEDBACK_PROMPT = `
{{conversation}}

Depends on this Interview Conversation between assistant and user,
Give me feedback for user interview. Give me rating out of 10 for technical Skills,
Communication, Problem Solving, Experience. Also give me summery in 3 lines
about the interview and one line to let me know whether is recommended
for hire or not with msg. Give me response in JSON format

{
  feedback:{
    rating:{
      techicalSkills:5,
      communication:6,
      problemSolving:4,
      experince:7
    },
    summery:<in 3 Line>,
    Recommendation:"",
    RecommendationMsg:""
  }
}
`
