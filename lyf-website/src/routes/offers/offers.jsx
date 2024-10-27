// import React, { useState, useEffect } from 'react';
// import { Gift, Tag, ThumbsUp } from 'lucide-react';

// const Offers = () => {
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOffers();
//   }, []);

//   const fetchOffers = async () => {
//     try {
//       const response = await fetch('http://localhost:8002/coupons');
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       const shuffledOffers = data.coupons
//         .map(value => ({ value, sort: Math.random() }))
//         .sort((a, b) => a.sort - b.sort)
//         .map(({ value }) => value);
      
//       const enhancedOffers = shuffledOffers.map(offer => ({
//         ...offer,
//         usageCount: Math.floor(Math.random() * 500) + 100,
//       }));
      
//       setOffers(enhancedOffers);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching offers:', error);
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-8">
//       <div className="text-center mb-12">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">
//           Exclusive Offers Just for You
//         </h1>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Discover personalized deals and special promotions handpicked to enhance your stay.
//           These offers are regularly updated to provide you with the best value.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {offers.map((offer, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
//           >
//             <div className="bg-blue-600 text-white p-4 text-center">
//               <h2 className="text-2xl font-bold">
//                 {offer.name || 'Special Offer'}
//               </h2>
//             </div>
            
//             <div className="p-6">
//               <div className="mb-6">
//                 <div className="flex items-center justify-center text-blue-600">
//                   <Tag className="w-6 h-6 mr-2" />
//                   <span className="text-3xl font-bold">
//                     {(offer.discount * 100).toFixed(0)}% OFF
//                   </span>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex items-center justify-center space-x-2 text-gray-600">
//                   <Gift className="w-4 h-4" />
//                   <span className="text-sm">Used by {offer.usageCount}+ guests</span>
//                 </div>

//                 <div className="border-t border-gray-100 pt-4">
//                   <div className="flex items-center justify-center">
//                     <button 
//                       onClick={() => {
//                         navigator.clipboard.writeText(offer.coupon);
//                         alert('Coupon code copied!');
//                       }}
//                       className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg w-full text-center"
//                     >
//                       {offer.coupon}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <div className="mt-12 text-center text-gray-500">
//         <p className="text-sm">
//           * Offers are subject to availability and terms & conditions apply.
//           Click on the coupon code to copy it to your clipboard.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Offers;

import React, { useState, useEffect } from 'react';
import { Gift, Tag, TrendingUp } from 'lucide-react';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:8002/coupons');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const enhancedOffers = data.coupons.map(offer => ({
        ...offer,
        usageCount: Math.floor(Math.random() * 100) + 50,
      }));
      
      // Sort by usage count in descending order
      const sortedOffers = enhancedOffers.sort((a, b) => b.usageCount - a.usageCount);
      
      setOffers(sortedOffers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Popular Offers Recommended for You
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our most-claimed deals and special promotions, sorted by popularity.
          Join thousands of satisfied customers who have already taken advantage of these offers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative"
          >
            {index === 0 && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Most Popular</span>
              </div>
            )}
            
            <div className="bg-blue-600 text-white p-4 text-center">
              <h2 className="text-2xl font-bold">
                {offer.name || 'Special Offer'}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-center text-blue-600">
                  <Tag className="w-6 h-6 mr-2" />
                  <span className="text-3xl font-bold">
                    {(offer.discount * 100).toFixed(0)}% OFF
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm font-medium">Claimed by {offer.usageCount.toLocaleString()}+ guests</span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-center">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(offer.coupon);
                        alert('Coupon code copied!');
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg w-full text-center"
                    >
                      {offer.coupon}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center text-gray-500">
        <p className="text-sm">
          * Offers are subject to availability and terms & conditions apply.
          Click on the coupon code to copy it to your clipboard.
        </p>
      </div>
    </div>
  );
};

export default Offers;