import React, { useEffect, useState } from 'react'
import PromotionalSection from '../../components/PromotionalSection/PromotionalSection'
import PropertyCardGrid from '../../components/PropertyCardGrid/PropertyCardGrid'
import AgentsSection from '../../components/ProfileCard/AgentsSection'
import DevelopersShowcase from '../../components/DevelopersShowcase/DevelopersShowcase'
import { useAuthUser } from '../../redux/useAuthUser'
import defaultInstance from '../../plugins/axios'

const Dashboard = () => {

  const [cottage, setCottage] = useState('Loading...')
  const [complex, setComplex] = useState('Loading...')
  const [commercial, setCommercial] = useState('Loading...')

  const user = useAuthUser()
  // console.log('Authenticated user:', user)

  useEffect(() => {
    const fetchPropertyCounts = async () => {
      try {
        const response = await defaultInstance.get('/dashboard')
        const data = response.data
        setCottage(data.totalCottages || 0)
        setComplex(data.totalBuildingComplexes || 0)
        setCommercial(data.totalCommercial || 0)
      } catch (error) {
        console.error('Error fetching property counts:', error)
      }
    }

    fetchPropertyCounts()
  }, [])

  console.log('Dashboard property counts:', { cottage, complex, commercial })

  return (
    <div className="container mx-auto mt-5">
        <PromotionalSection totalCottage={cottage} totalComplex={complex} totalCommercial={commercial} />
        <PropertyCardGrid />
        <AgentsSection />
        <DevelopersShowcase />
    </div>
  )
}

export default Dashboard