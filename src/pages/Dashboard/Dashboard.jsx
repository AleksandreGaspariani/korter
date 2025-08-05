import React from 'react'
import PromotionalSection from '../../components/PromotionalSection/PromotionalSection'
import PropertyCardGrid from '../../components/PropertyCardGrid/PropertyCardGrid'
import AgentsSection from '../../components/ProfileCard/AgentsSection'

const Dashboard = () => {
  return (
    <div className="container mx-auto mt-5">
        <PromotionalSection />
        <PropertyCardGrid />
        <AgentsSection />
    </div>
  )
}

export default Dashboard