import React, { useState, useEffect } from 'react';
import LoginNavbar from 'components/login-navbar/LoginNavbar';

const Merchandise = () => {
  const [selectedMerch, setSelectedMerch] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [customOrder, setCustomOrder] = useState('');
  
  const merchItems = [
    { id: 1, name: 'T-Shirt', price: '$20', options: ['S', 'M', 'L', 'XL'], image: 'img/tshirt.jpg' },
    { id: 2, name: 'Jacket', price: '$50', options: ['S', 'M', 'L'], image: 'img/jacket.jpg' },
    { id: 3, name: 'Cap', price: '$15', options: ['One Size'], image: 'img/cap.jpg' },
  ];

  const handleSelectMerch = (item) => {
    setSelectedMerch(item);
    setSelectedSize('');  // Reset size for each new selection
  };

  const handleCloseModal = () => {
    setSelectedMerch(null);
    setSelectedSize('');
    setCustomOrder('');
  };

  const handleBuy = () => {
    alert(`Purchased ${selectedMerch.name} with size: ${selectedSize} and custom order: ${customOrder}`);
    handleCloseModal();
  };

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
    <LoginNavbar />
    <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white">
      {merchItems.map((item) => (
        <div key={item.id} className="bg-white shadow-lg p-4 rounded-lg hover:shadow-xl cursor-pointer" onClick={() => handleSelectMerch(item)}>
          <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg" />
          <h3 className="text-lg font-semibold text-black mt-4">{item.name}</h3>
          <p className="text-gray-700">{item.price}</p>
        </div>
      ))}
      <div className="bg-white shadow-lg p-4 rounded-lg hover:shadow-xl cursor-pointer flex justify-center items-center" onClick={() => alert('Add your own merch functionality coming soon!')}>
        <h3 className="text-lg font-semibold text-center text-black">Customize</h3>
      </div>

      {selectedMerch && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-black text-lg font-bold">X</button>
            <img src={selectedMerch.image} alt={selectedMerch.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-xl font-bold text-black">{selectedMerch.name}</h2>
            <p className="text-gray-700">{selectedMerch.price}</p>

            <div className="mt-4">
              <span className="text-gray-700">Select Size</span>
              <div className="flex gap-2 mt-2">
                {selectedMerch.options.map((option) => (
                  <button
                    key={option}
                    className={`p-2 rounded ${selectedSize === option ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setSelectedSize(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleBuy} className="mt-4 bg-black text-white p-2 rounded w-full">Buy</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Merchandise;
