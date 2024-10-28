import React from 'react';
import { Users, Share2, Handshake, Award } from 'lucide-react';
import './InfluencerPartnerships.css'; // Import the CSS file

const InfluencerPartnerships = () => {
  const strategies = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Influencer Meetups",
      description: "Host exclusive gatherings where influencers experience our premium hospitality services. We provide complimentary accommodation, gourmet dining, and unique experiences. Influencers share their authentic experiences with their followers, generating organic reach and driving revenue through their engaged audiences.",
      benefits: [
        "Authentic content creation",
        "Increased social media visibility",
        "Direct booking conversions",
        "Enhanced brand credibility"
      ],
      image: true
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "Brand Ambassadors Program",
      description: "Partner with select influencers and celebrities as official brand ambassadors. They'll collaborate on exclusive merchandise lines, sign limited edition products, and earn commissions on sales. Ambassadors also get priority access to events and special perks.",
      benefits: [
        "Revenue sharing opportunities",
        "Exclusive merchandise collections",
        "Long-term brand association",
        "Authenticated signed products"
      ],
      image: true
    },
    {
      icon: <Share2 className="w-8 h-8 text-blue-600" />,
      title: "Targeted Promotions",
      description: "Partner with influencers to showcase specific hotel features, products, or seasonal promotions. Whether it's our spa services, signature restaurants, or special packages, influencers create tailored content that resonates with their audience.",
      benefits: [
        "Focused product visibility",
        "Targeted audience reach",
        "Measurable campaign results",
        "Seasonal promotion boost"
      ]
    },
    {
      icon: <Handshake className="w-8 h-8 text-blue-600" />,
      title: "Community Collaborations",
      description: "Connect influencers with local businesses and community members for unique partnership opportunities. Create exclusive experiences that combine hotel amenities with local culture and products.",
      benefits: [
        "Enhanced local engagement",
        "Cross-promotional opportunities",
        "Community goodwill",
        "Unique content creation"
      ]
    }
  ];

  return (
    <div className="container">
      <h1 className="title">Influencer Partnerships</h1>

      <div className="grid">
        {strategies.map((strategy, index) => (
          <div key={index} className="card">
            {strategy.image && (
              <div className="image-container">
                <div className="overlay"></div>
              </div>
            )}

            <div className="content">
              <div className="icon-container">{strategy.icon}</div> {/* Centered logos */}

              <h2 className="card-title">{strategy.title}</h2>

              <p className="description">{strategy.description}</p>

              <div className="benefits">
                <h3 className="benefits-title">Key Benefits:</h3>
                <ul className="benefits-list">
                  {strategy.benefits.map((benefit, idx) => (
                    <li key={idx} className="benefit-item">
                      <span className="benefit-dot"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerPartnerships;