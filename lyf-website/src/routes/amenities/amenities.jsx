import React from 'react';

const AmenitiesView = () => {
  const amenities = [
    {
      name: "Gaming Room Access",
      description: "Step into our state-of-the-art gaming paradise featuring the latest consoles, gaming PCs, and a wide selection of popular titles. Perfect for solo gaming or multiplayer tournaments.",
      pricing: "Included with Package",
      imageAlt: "Modern gaming room setup"
    },
    {
      name: "Karaoke Lounge Access",
      description: "Unleash your inner star in our premium karaoke lounges, equipped with professional-grade sound systems and an extensive library of songs from around the world.",
      pricing: "$30/hour",
      imageAlt: "Luxurious karaoke lounge"
    },
    {
      name: "Pool & Spa Access",
      description: "Unwind in our pristine pool and rejuvenate in our world-class spa facilities. Features heated pools, jacuzzis, and dedicated relaxation areas.",
      pricing: "Included with Package",
      imageAlt: "Luxury pool and spa area"
    },
    {
      name: "VR/AR Experience",
      description: "Immerse yourself in cutting-edge virtual and augmented reality experiences. From virtual tours to interactive games, explore new dimensions of entertainment.",
      pricing: "$45/hour",
      imageAlt: "VR gaming setup"
    },
    {
      name: "Photo Booth",
      description: "Capture memorable moments in our professional-grade photo booth with custom backgrounds, props, and instant high-quality prints to take home.",
      pricing: "$25/hour",
      imageAlt: "Modern photo booth setup"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-12">Our Premium Amenities</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {amenities.map((amenity, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={`/api/placeholder/400/300`}
              alt={amenity.imageAlt}
              className="w-full h-48 object-cover object-center"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{amenity.name}</h3>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${amenity.pricing.includes('Package') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'}
                `}>
                  {amenity.pricing}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {amenity.description}
              </p>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                {amenity.pricing.includes('Package') 
                  ? 'Book Now' 
                  : 'Reserve Time Slot'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-block bg-gray-100 rounded-lg p-6 max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Package Benefits</h2>
          <p className="text-gray-600">
            Enhance your stay with our premium amenities. Some facilities are included with your package, 
            while others can be enjoyed at hourly rates. Our staff is always available to help you make 
            the most of these exclusive offerings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesView;