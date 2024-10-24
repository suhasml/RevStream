// import React, { useState } from 'react';

// // Custom Modal Component
// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-full max-w-md mx-4">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">{title}</h2>
//             <button 
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               ×
//             </button>
//           </div>
//         </div>
//         <div className="p-4">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// const HotelDetailsNavbar = () => {
//   const [activePopup, setActivePopup] = useState(null);

//   const navItems = [
//     {
//       id: 'events',
//       title: 'Events',
//       content: (
//         <div className="space-y-4">
//           <p className="text-gray-700">Our hotel offers various event spaces perfect for:</p>
//           <ul className="list-disc pl-6 space-y-2">
//             <li>Weddings and Receptions</li>
//             <li>Corporate Conferences</li>
//             <li>Birthday Celebrations</li>
//             <li>Business Meetings</li>
//             <li>Social Gatherings</li>
//           </ul>
//         </div>
//       )
//     },
//     {
//       id: 'packages',
//       title: 'Packages',
//       content: (
//         <div className="space-y-4">
//           <p className="text-gray-700">Choose from our carefully curated packages:</p>
//           <ul className="list-disc pl-6 space-y-2">
//             <li>Romantic Getaway Package</li>
//             <li>Family Vacation Bundle</li>
//             <li>Business Traveler Special</li>
//             <li>Spa & Wellness Retreat</li>
//             <li>Weekend Escape Deal</li>
//           </ul>
//         </div>
//       )
//     },
//     {
//       id: 'benefits',
//       title: 'Benefits',
//       content: (
//         <div className="space-y-4">
//           <p className="text-gray-700">Enjoy exclusive benefits during your stay:</p>
//           <ul className="list-disc pl-6 space-y-2">
//             <li>Complimentary Breakfast</li>
//             <li>Free Wi-Fi Access</li>
//             <li>Access to Fitness Center</li>
//             <li>Late Check-out Options</li>
//             <li>Loyalty Points Program</li>
//           </ul>
//         </div>
//       )
//     }
//   ];

//   return (
//     <>
//       <nav className="relative flex flex-wrap justify-between items-center px-4 md:px-12 py-4 bg-white shadow-md">
//         {/* Logo Section */}
//         <div className="flex items-center">
//           <img 
//             src="/api/placeholder/150/50"
//             alt="Hotel Logo"
//             className="h-12 w-auto"
//           />
//         </div>

//         {/* Navigation Items */}
//         <div className="flex items-center space-x-8">
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActivePopup(item.id)}
//               className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
//             >
//               {item.title}
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* Modals */}
//       {navItems.map((item) => (
//         <Modal
//           key={item.id}
//           isOpen={activePopup === item.id}
//           onClose={() => setActivePopup(null)}
//           title={item.title}
//         >
//           {item.content}
//         </Modal>
//       ))}
//     </>
//   );
// };

// export default HotelDetailsNavbar;

import React, { useState, useEffect } from 'react';
import { X, Loader2, List } from 'lucide-react';

// Modal Component with proper hook usage
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Event Card Component with improved layout
const EventCard = ({ event, onAddToPackage }) => (
  <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
    <img 
      src={event.image || "/api/placeholder/200/150"} 
      alt={event.name} 
      className="w-full md:w-48 h-40 object-cover rounded"
    />
    <div className="flex-1">
      <h3 className="text-lg font-semibold">{event.name}</h3>
      <p className="text-gray-600 mt-2">{event.description}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          ${event.price}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {event.duration}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          {event.capacity} people
        </span>
      </div>
    </div>
    <div className="flex items-center">
      <button
        onClick={() => onAddToPackage(event)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add to Package
      </button>
    </div>
  </div>
);

// Package Card Component
const PackageCard = ({ pkg, onAddToPackage }) => (
  <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
    <img 
      src={pkg.image || "/api/placeholder/200/150"} 
      alt={pkg.name} 
      className="w-full md:w-48 h-40 object-cover rounded"
    />
    <div className="flex-1">
      <h3 className="text-lg font-semibold">{pkg.name}</h3>
      <p className="text-gray-600 mt-2">{pkg.description}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          ${pkg.price}/day
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {pkg.duration} 
        </span>
        
      </div>
    </div>
    <div className="flex items-center">
      <button
        onClick={() => onAddToPackage(pkg)}
        className={`px-4 py-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700`}
      >
        Add to Package
      </button>
    </div>
  </div>
);

const HotelDetailsNavbar = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [events, setEvents] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch data based on active modal
  useEffect(() => {
    if (!activeModal) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeModal === 'events') {
          // Fetch events
          const response = await fetch('http://localhost:8002/admin/events');
          const data = await response.json();
          console.log('Events data:', data);
          setEvents(data || []);
        } 
        else if (activeModal === 'packages') {
          const response = await fetch('http://localhost:8002/admin/packages');
          const packagesData = await response.json();

          // Fetch sponsored packages
          const sponsoredResponse = await fetch('http://localhost:8002/admin/sponsored-packages');
          const sponsoredData = await sponsoredResponse.json();

          // Combine both regular and sponsored packages
          const combinedPackages = [...packagesData, ...sponsoredData];
          console.log('Combined packages data:', combinedPackages);

          setPackages(combinedPackages || []);
        }
      } catch (err) {
        console.error(`Error fetching ${activeModal}:`, err);
        setError(`Failed to load ${activeModal}. Please try again later.`);
        
        // Set fallback data for development
        if (activeModal === 'events') {
          setEvents([
            {
              id: 1,
              name: "Wedding Package",
              description: "Complete wedding venue with catering and decoration",
              price: 2500,
              duration: "6 hours",
              capacity: 200
            }
          ]);
        } else if (activeModal === 'packages') {
          setPackages([
            {
              id: 1,
              name: "Conference Room A",
              description: "Modern conference room with AV equipment",
              price: 100,
              capacity: 50,
              available: true
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeModal]);

  const handleAddToPackage = (item) => {
    setSelectedItems(prev => [...prev, item]);
    // Show success message
    alert(`Added ${item.name} to package`);
  };

  // Custom Package Request Form Component
const CustomPackageForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requests: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      alert("Custom package request submitted successfully!");
    } catch (err) {
      setError("Failed to submit custom package request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Package Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Special Requests</label>
        <input
          type="text"
          name="requests"
          value={formData.requests}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded-md p-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};


  const renderModalContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => setActiveModal(activeModal)} 
            className="mt-4 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    switch (activeModal) {
      case 'events':
        return (
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onAddToPackage={handleAddToPackage}
                />
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">No events available</p>
            )}
          </div>
        );
      
      case 'packages':
        // return (
        //   <div className="space-y-4">
        //     {packages.length > 0 ? (
        //       packages.map(pkg => (
        //         <PackageCard 
        //           key={pkg.id} 
        //           pkg={pkg} 
        //           onAddToPackage={handleAddToPackage}
        //         />
        //       ))
        //     ) : (
        //       <p className="text-center py-4 text-gray-500">No packages available</p>
        //     )}
        //   </div>
        // );
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              {packages.length > 0 ? (
                packages.map(pkg => (
                  <PackageCard 
                    key={pkg.id} 
                    pkg={pkg} 
                    onAddToPackage={handleAddToPackage}
                  />
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">No packages available</p>
              )}
            </div>
  
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700">Request a Custom Package</h3>
              <CustomPackageForm 
                onSubmit={async (formData) => {
                  const response = await fetch('http://localhost:8002/admin/custom-package-requests', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      name: formData.name,
                      description: formData.description,
                      requests: formData.requests,
                      status: "pending" // Assuming the status is set as pending by default
                    })
                  });
                  if (!response.ok) {
                    throw new Error("Failed to submit custom package request.");
                  }
                }}
              />
            </div>
          </div>
        );

      case 'benefits':
        return (
          <div className="space-y-6">
            <p className="text-gray-700">Enjoy these exclusive benefits during your stay:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Complimentary Breakfast",
                "Free High-Speed Wi-Fi",
                "24/7 Fitness Center Access",
                "Flexible Check-out Options",
                "Loyalty Points Program",
                "Concierge Services"
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'events', label: 'Events' },
    { id: 'packages', label: 'Packages' },
    { id: 'benefits', label: 'Benefits' }
  ];

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/api/placeholder/150/50"
                alt="Hotel Logo"
                className="h-8 w-auto"
              />
            </div>
            
            <div className="flex items-center space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveModal(item.id)}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={navItems.find(item => item.id === activeModal)?.label || ''}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default HotelDetailsNavbar;