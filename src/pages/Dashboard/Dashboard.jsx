import React from 'react'
import PromotionalSection from '../../components/PromotionalSection/PromotionalSection'
import PropertyCardGrid from '../../components/PropertyCardGrid/PropertyCardGrid'
import AgentsSection from '../../components/ProfileCard/AgentsSection'
import DevelopersShowcase from '../../components/DevelopersShowcase/DevelopersShowcase'
import { useAuthUser } from '../../redux/useAuthUser'

const Dashboard = () => {
  const user = useAuthUser()
  console.log('Authenticated user:', user)

  return (
    <div className="container mx-auto mt-5">
        <PromotionalSection />
        <PropertyCardGrid />
        <AgentsSection />
        <DevelopersShowcase />
    </div>
  )
}

export default Dashboard