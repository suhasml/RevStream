import React, { useState } from 'react';
import { ArrowRight, Users, Store, Target, WalletIcon } from 'lucide-react';

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    lookingForTalent: false,
    isFreelancer: false,
    ownsProduct: false,
    isHotelRelated: false,
    ownsStartup: false
  });

  const benefits = [
    {
      icon: <WalletIcon className="w-8 h-8 mb-4 text-indigo-600" />,
      title: "Involve in Branding",
      description: "Collaborate on co-sponsorship opportunities and brand partnerships"
    },
    {
      icon: <Users className="w-8 h-8 mb-4 text-indigo-600" />,
      title: "Talent Pool",
      description: "Connect with skilled freelancers and professionals within the community or be a part of the talent pool"
    },
    {
      icon: <Store className="w-8 h-8 mb-4 text-indigo-600" />,
      title: "Community Marketplace",
      description: "Browse and purchase products from community members in the in-app store and sell your products"
    },
    {
      icon: <Target className="w-8 h-8 mb-4 text-indigo-600" />,
      title: "Personalized Connections",
      description: "Reach specific groups and teams for events, stalls, and pop-up stores or get personalized connections and be reached by specific groups"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowPopup(false);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Welcome to LYF Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connect, collaborate, and grow with a vibrant community of creators and professionals
          </p>
          <button
            onClick={() => setShowPopup(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Join Community
          </button>
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
      </div>

      {/* Join Community Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-90vh overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">Join Our Community</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="lookingForTalent"
                      checked={formData.lookingForTalent}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label>Are you looking for talent?</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFreelancer"
                      checked={formData.isFreelancer}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label>Are you a freelancer?</label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="ownsProduct"
                        checked={formData.ownsProduct}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label>Do you own a product?</label>
                    </div>
                    {formData.ownsProduct && (
                      <div className="ml-6 flex items-center">
                        <input
                          type="checkbox"
                          name="isHotelRelated"
                          checked={formData.isHotelRelated}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label>Is it related to the hotel industry?</label>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="ownsStartup"
                      checked={formData.ownsStartup}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label>Do you own or have a major part in a startup/organization?</label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;