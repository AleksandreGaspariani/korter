import React from 'react'
import PromotionalSection from '../../components/PromotionalSection/PromotionalSection'
import PropertyCardGrid from '../../components/PropertyCardGrid/PropertyCardGrid'
import AgentsSection from '../../components/ProfileCard/AgentsSection'
import DevelopersShowcase from '../../components/DevelopersShowcase/DevelopersShowcase'

const Dashboard = () => {
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