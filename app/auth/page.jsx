"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import supabase from '@/services/supabaseClient'
import { useRouter } from 'next/navigation'

function login() {
  const router = useRouter();
  const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });

  if (error) console.error('Error:', error.message);
};
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex flex-col items-center border rounded-2xl p-30 shadow-lg'>
        <Image src={'/login.png'} alt='login' width={800} height={200} />
        <h2 className='text-2xl font-bold mt-4 mb-2 text-center'>Welcome to AI Interview Scheduler</h2>
        <div>
          <Image
            src={'/logo.png'}
            alt='logo'
            width={25}
            height={30}
          />
        </div>
        <p className='mb-6 text-center'>Schedule your interviews effortlessly with AI-powered assistance.</p>
        <Button className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600' onClick={signInWithGoogle}>
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}

export default login