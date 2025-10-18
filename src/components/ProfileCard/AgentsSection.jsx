import React, { useState } from 'react'
import ProfileCard from './ProfileCard'
import defaultInstance from '../../plugins/axios'

const agents = [
  {
    image: '../../../images/men1.jpg',
    name: 'Prime Home',
    title: 'Prime Home-ის აგენტი',
    followers: 23,
    following: 2,
    description: 'გაყიდვა და გაქირავება',
  },
  {
    image: '../../../images/men2.jpg',
    name: 'Erias',
    title: 'აგენტი',
    followers: 2,
    following: 0,
    description: 'გაყიდვა',
  },
  {
    image: '../../../images/men3.avif',
    name: 'ia bloomer',
    title: 'აგენტი',
    followers: 1,
    following: 0,
    description: 'გაყიდვა',
  },
  {
    image: '../../../images/men4.jpg',
    name: 'ნინო',
    title: 'აგენტი',
    followers: 6,
    following: 0,
    description: 'გაყიდვა',
  },
  {
    image: '../../../images/men4.jpg',
    name: 'Andria Sanodze',
    title: 'აგენტი',
    followers: 34,
    following: 0,
    description: 'გაყიდვა',
  },
  {
    image: '../../../images/men1.jpg',
    name: 'Ксения Штенгелова',
    title: 'აგენტი',
    followers: 5,
    following: 0,
    description: 'გაყიდვა და გაქირავება',
  },
  {
    image: '../../../images/men2.jpg',
    name: 'Home Tbill',
    title: 'აგენტი',
    followers: 4,
    following: 0,
    description: 'გაყიდვა',
  },
  {
    image: '../../../images/men4.jpg',
    name: 'Tamara',
    title: 'აგენტი',
    followers: 56,
    following: 0,
    description: 'გაყიდვა',
  },
]



const AgentsSection = () => {

  const [agents, setAgents] = useState([]);
  // const apiUri = import.meta.env.VITE_APP_URI;
  React.useEffect(() => {
    defaultInstance.get('/dashboard/agents')
      .then(response => {
        setAgents(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching agents:', error);
      });
  }, []);

  // const storage = import.meta.env.VITE_APP_URI + '/storage/';
  

  return (
    <div className="container mx-auto py-8 px-4 md:px-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">ახალი აგენტები Homeinfo-ზე</h2>
        <a href="#" className="text-sm text-blue-500 hover:underline">ყველა უძრავი ქონების აგენტი</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent, idx) => (
          <div key={idx}>
            <ProfileCard
              image={agent?.user_information?.profile_image_url}
              name={agent.name}
              title={'აგენტი'}
              followers={`${agent.property_count} ობიექტი`}
              following={agent?.user_information?.bio}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AgentsSection