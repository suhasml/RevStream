import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink = ({ to, label }) => (
  <Link
    to={to}
    className="block text-white hover:text-blue-400 transition-colors duration-300"
  >
    {label}
  </Link>
);

const GlobalFooter = () => {
  return (
    <footer className="bg-black text-white mt-6">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Company Info</h4>
            <FooterLink to="/about-us" label="About Us" />
            <FooterLink to="/contact" label="Contact" />
            <FooterLink to="/privacy-policy" label="Privacy Policy" />
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Support</h4>
            <FooterLink to="/faqs" label="FAQs" />
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Newsletter</h4>
            <p>Stay updated with our latest trends</p>
            <form>
              <input
                type="email"
                placeholder="Enter email"
                className="p-2 rounded text-black" // Ensures input text is readable
              />
              <button className="ml-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="text-center mt-10">
          <p>Designed by 3-Musketeers</p>
          <p>&copy; {new Date().getFullYear()} Lyf Properties. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
