// import React from 'react';
// import { Users, Share2, Handshake } from 'lucide-react';

// const InfluencerPartnerships = () => {
//   const strategies = [
//     {
//       icon: <Users className="w-8 h-8 text-blue-600" />,
//       title: "Influencer Meetups",
//       description: "Host exclusive gatherings where influencers experience our premium hospitality services. We provide complimentary accommodation, gourmet dining, and unique experiences. Influencers share their authentic experiences with their followers, generating organic reach and driving revenue through their engaged audiences.",
//       benefits: [
//         "Authentic content creation",
//         "Increased social media visibility",
//         "Direct booking conversions",
//         "Enhanced brand credibility"
//       ],
//       image: true
//     },
//     {
//       icon: <Share2 className="w-8 h-8 text-blue-600" />,
//       title: "Targeted Promotions",
//       description: "Partner with influencers to showcase specific hotel features, products, or seasonal promotions. Whether it's our spa services, signature restaurants, or special packages, influencers create tailored content that resonates with their audience.",
//       benefits: [
//         "Focused product visibility",
//         "Targeted audience reach",
//         "Measurable campaign results",
//         "Seasonal promotion boost"
//       ]
//     },
//     {
//       icon: <Handshake className="w-8 h-8 text-blue-600" />,
//       title: "Community Collaborations",
//       description: "Connect influencers with local businesses and community members for unique partnership opportunities. Create exclusive experiences that combine hotel amenities with local culture and products.",
//       benefits: [
//         "Enhanced local engagement",
//         "Cross-promotional opportunities",
//         "Community goodwill",
//         "Unique content creation"
//       ]
//     }
//   ];

//   return (
//     <div className="max-w-6xl mx-auto p-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-12 text-center">
//         Influencer Partnerships
//       </h1>
      
//       <div className="grid md:grid-cols-3 gap-8">
//         {strategies.map((strategy, index) => (
//           <div 
//             key={index} 
//             className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
//           >
//             {strategy.image && (
//               <div className="w-full h-48 relative">
//                 <img
//                   src="/api/placeholder/400/320"
//                   alt="Influencers gathering at hotel event"
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
//               </div>
//             )}
            
//             <div className="p-6">
//               <div className="flex items-center justify-center mb-4">
//                 {strategy.icon}
//               </div>
              
//               <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
//                 {strategy.title}
//               </h2>
              
//               <p className="text-gray-600 mb-6">
//                 {strategy.description}
//               </p>
              
//               <div className="space-y-2">
//                 <h3 className="font-semibold text-gray-700 mb-2">Key Benefits:</h3>
//                 <ul className="space-y-1">
//                   {strategy.benefits.map((benefit, idx) => (
//                     <li key={idx} className="text-gray-600 flex items-center">
//                       <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
//                       {benefit}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default InfluencerPartnerships;

import React from 'react';
import { Users, Share2, Handshake, Award } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-12 text-center">
        Influencer Partnerships
      </h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {strategies.map((strategy, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            {strategy.image && (
              <div className="w-full h-48 relative">
                <img
                  src="/api/placeholder/400/320"
                  alt="Influencers gathering at hotel event"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                {strategy.icon}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                {strategy.title}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {strategy.description}
              </p>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 mb-2">Key Benefits:</h3>
                <ul className="space-y-1">
                  {strategy.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
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