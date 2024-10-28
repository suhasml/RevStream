import React, { useState, useEffect } from 'react';
import { X, Loader2, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logos/lyf_White.png';

const formatDateToSGT = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Singapore'
  });
};

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
const EventCard = ({ event }) => (
  <div className="bg-white border rounded-lg overflow-hidden mb-4">
    <div className="p-4 border-b bg-gray-50">
      <h3 className="text-lg font-semibold">{event.title}</h3>
    </div>
    <div className="p-4">
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Date:</span> {event.date.split('T')[0]}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Description:</span> {event.description}
        </p>
      </div>
    </div>
  </div>
);

// Package Card Component
const PackageCard = ({ pkg, onAddToPackage }) => (
  <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
    <div className="flex-1">
      <h3 className="text-lg font-semibold">{pkg.title}</h3>
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
    <div className="flex items-center"></div>
  </div>
);

const HotelDetailsNavbar = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [events, setEvents] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch data based on active modal
  useEffect(() => {
    if (!activeModal) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeModal === 'events') {
          // Fetch events
          const response = await fetch('http://localhost:8002/hosted-events');
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
      return <p className="text-red-600">{error}</p>;
    }

    if (activeModal === 'events') {
      return (
        <div>
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      );
    }

    if (activeModal === 'packages') {
      return (
        <div>
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} onAddToPackage={handleAddToPackage} />
          ))}
          <CustomPackageForm onSubmit={async (data) => {
            // Handle custom package submission logic here
            console.log("Custom package request:", data);
          }} />
        </div>
      );
    }

    if (activeModal === 'benefits') {
      return (
        <div className="space-y-6">
          <p className="text-gray-700">Enjoy these exclusive Amenities during your stay:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Gaming Room Access",
              "Karoake Lounge Access",
              "Pool & Spa Access",
              "VR/AR Experience",
              "Photo Booth",

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
      )
    }
  };

  const navItems = [
    { id: 'events', label: 'Events' },
    { id: 'packages', label: 'Packages' },
    { id: 'benefits', label: 'Amenities' }
  ];

  return (
    <>
      <div className="relative flex flex-wrap justify-between items-center px-4 md:px-12 global-navbar__container bg-black brand-divider-bottom shadow-md">
            <div className="flex">
              <Link to="/">
                <img
                  src={logo}
                  alt="Hotel Logo"
                  className="site-logo__img"
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveModal(item.id)}
                  className="text-white hover:text-blue-600 font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Hamburger Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-blue-600 focus:outline-none"
            >
              <List className="h-6 w-6" />
            </button>
          </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black">
            <div className="flex flex-col items-center py-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModal(item.id);
                    setMobileMenuOpen(false); // Close menu after selection
                  }}
                  className="text-white hover:text-blue-600 font-medium transition-colors w-full text-left px-4 py-2"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}


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
