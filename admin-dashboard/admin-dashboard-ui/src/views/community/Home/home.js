import React from 'react';
import { ArrowRight, Users, Store, Calendar, Target } from 'lucide-react';

const HomePage = () => {
  const benefits = [
    {
      icon: <Calendar className="w-8 h-8 mb-4 text-indigo-600" />,
      title: "Host Exclusive Events",
      description: "Create and manage unique experiences for your community members"
    },
    {
      icon: <Users className="w-8 h-8 mb-4 text-indigo-600" />,
      title: "Access Talent Pool",
      description: "Connect with skilled freelancers and professionals within the community"
    },
    {
      icon: <Store className="w-8 h-8 mb-4 text-indigo-600" />,
      title: "Community Marketplace",
      description: "Browse and purchase products from community members in the in-app store"
    },
    {
      icon: <Target className="w-8 h-8 mb-4 text-indigo-600" />,
      title: "Personalized Connections",
      description: "Reach specific groups and teams for events, stalls, and pop-up stores"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Welcome to LYF Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect, collaborate, and grow with a vibrant community of creators and professionals
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Benefits of Community
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
              >
                <div className="flex flex-col items-center text-center">
                  {benefit.icon}
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                  <ArrowRight className="w-5 h-5 mt-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-300">
            Join Our Community
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;