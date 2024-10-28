import React from 'react';
import { ArrowRight, Users, Store, Calendar, Target } from 'lucide-react';
import './HomePage.css'; // Ensure you import the CSS file

const HomePage = () => {
  const benefits = [
    {
      icon: <Calendar className="benefit-icon" />,
      title: "Host Exclusive Events",
      description: "Create and manage unique experiences for your community members"
    },
    {
      icon: <Users className="benefit-icon" />,
      title: "Access Talent Pool",
      description: "Connect with skilled freelancers and professionals within the community"
    },
    {
      icon: <Store className="benefit-icon" />,
      title: "Community Marketplace",
      description: "Browse and purchase products from community members in the in-app store"
    },
    {
      icon: <Target className="benefit-icon" />,
      title: "Personalized Connections",
      description: "Reach specific groups and teams for events, stalls, and pop-up stores"
    }
  ];

  return (
    <div className="container mx-auto px-4 pt-20 pb-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="hero-title">
          LYF Community
        </h1>
        <p className="hero-description">
          Connect, collaborate, and grow with a vibrant community of creators and professionals
        </p>
      </div>

      {/* Benefits Section */}
      <div className="mb-20">
        <h2 className="benefits-title">
          Benefits of Community
        </h2>

        <div className="benefits-container">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefit-card"
            >
              <div className="flex flex-col items-center text-center">
                {benefit.icon}
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;