import GlobalNavbar from 'components/global-navbar/GlobalNavbar';
import React from 'react';

/**
 * AboutUs component
 * @returns {jsx}
 */
const AboutUs = () => {
  return (
    <>
    <GlobalNavbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-brand mb-2">About Us</h1>
      <p className="text-lg mb-8">
        Welcome to <span className="text-brand">RevStream</span>, where we harness the power of generative AI to make your tasks simpler and enhance your experience during booking, staying, and beyond. Our platform is designed to streamline every aspect of your journey.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Our Vision</h2>
      <p className="text-lg mb-8">
        At <span className="text-brand">RevStream</span>, we envision a seamless booking experience that adapts to each user’s unique needs. Our goal is to empower travelers with smarter tools for every step of their journey and to offer administrators insights that drive increased profitability.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">
        Why Choose RevStream?
      </h2>
      <ul className="list-disc ml-6 mb-8">
        <li className="text-lg mb-3">
          Our genAI technology optimizes and simplifies tasks, creating a smooth booking and stay experience for users.
        </li>
        <li className="text-lg mb-3">
          Our admin dashboard provides real-time revenue tracking and actionable insights, empowering decision-makers to enhance profitability.
        </li>
        <li className="text-lg mb-3">
          With a user-friendly interface and advanced features, you can easily manage and monitor your bookings with confidence and ease.
        </li>
        <li className="text-lg mb-3">
          We are committed to safeguarding your data and ensuring a secure platform for all transactions and interactions.
        </li>
      </ul>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Contact Us</h2>
      <p className="text-lg mb-4">
        Have questions or need assistance? Our customer support team is ready to help. Reach us at{' '}
        <a
          className="text-brand hover:underline"
          href="mailto:info@revstream.com"
        >
          info@revstream.com
        </a>
        .
      </p>
      <p className="text-lg">
        Thank you for choosing <span className="text-brand">RevStream</span>. We look forward to enhancing your booking experience and supporting your journey to success.
      </p>
    </div>
    </>
  );
};

export default AboutUs;
