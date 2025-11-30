import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer';
import Provider from '@/app/provider';
import CreateOptions from './_components/CreateOptions';
import LatestInterviewsList from './_components/LatestInterviewsList';

function Dashboard() {
  return (
    <div>
        {/* <WelcomeContainer /> */}
        <CreateOptions />
        <LatestInterviewsList />
    </div>
  )
}

export default Dashboard;