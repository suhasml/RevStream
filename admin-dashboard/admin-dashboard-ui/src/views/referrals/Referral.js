import React, { useState } from 'react';
import { Gift, Users, TrendingUp, DollarSign, PlusCircle } from 'lucide-react';
import './referral.css'; // Import the CSS file

const ReferralProgram = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: '',
    referralReward: '',
    referrerReward: '',
    expiryDate: '',
    terms: ''
  });

  const benefits = [
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: "Expand Customer Base",
      description: "Leverage your existing customers' networks to reach new prospects organically"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
      title: "Increased Loyalty",
      description: "Build stronger relationships with customers through rewards and recognition"
    },
    {
      icon: <DollarSign className="w-12 h-12 text-blue-600" />,
      title: "Cost-Effective Marketing",
      description: "Pay only for successful referrals, optimizing your marketing budget"
    },
    {
      icon: <Gift className="w-12 h-12 text-blue-600" />,
      title: "Higher Conversion Rates",
      description: "Referred customers are 4x more likely to make a purchase"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Campaign Data:', formData);
    alert('Referral campaign created successfully!');
    setShowForm(false);
    setFormData({
      campaignName: '',
      referralReward: '',
      referrerReward: '',
      expiryDate: '',
      terms: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hotel Referral Program
        </h1>
        <p className="text-gray-600 text-lg">
          Turn your satisfied guests into brand ambassadors
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center h-64 benefit-box"
            style={{
              borderRadius: '1rem',
            }}
          >
            <div className="benefit-icon">
              {benefit.icon}
            </div>
            <h4 className="text-xl font-semibold text-gray-800 benefit-title text-center">
              {benefit.title}
            </h4>
            <p className="text-gray-600 text-center">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      {!showForm && (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: 'black', color: 'white', padding: '12px 32px', borderRadius: '8px' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'lightgrey'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'black'}
            className="font-semibold flex items-center mx-auto transition-colors duration-300"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Launch Referral Campaign
          </button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content relative">
            <button
              onClick={() => setShowForm(false)}
              className="modal-close-button"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Create New Referral Campaign
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  name="campaignName"
                  value={formData.campaignName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Referral Reward
                  </label>
                  <input
                    type="text"
                    name="referralReward"
                    value={formData.referralReward}
                    onChange={handleChange}
                    placeholder="e.g., $50 off next stay"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Referrer Reward
                  </label>
                  <input
                    type="text"
                    name="referrerReward"
                    value={formData.referrerReward}
                    onChange={handleChange}
                    placeholder="e.g., 20% discount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  name="terms"
                  value={formData.terms}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-campaign"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralProgram;
