import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import IT_EMCFiles from './COT/IT_EMCFiles';
import AutomotiveModal from './COT/Automotive';
import ElectronicsModal from './COT/Electronics';
import FoodTechModal from './COT/Food';

const COT = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [activeModal, setActiveModal] = useState('');

  // Detect if the current path is IT and EMC
  const isIT_EMCPath = location.pathname.endsWith('it_emc');
  const isCOTPath = location.pathname === '/cot';

  useEffect(() => {
    if (isIT_EMCPath) {
      setShowModal(true);
      setActiveModal('IT_EMC');
    }  else {
      setShowModal(false);
      setActiveModal('');
    }
  }, [isIT_EMCPath, isCOTPath]);

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveModal('');
  };

  const openModal = (modalName) => {
    setShowModal(true);
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveModal('');
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">College of Technology</h1>
      <p className="text-gray-700 mb-6">Explore the departments under COT:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* IT EMC (Using Link as before) */}
        <Link to="it_emc" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">BSIT</h3>
          <p className="text-sm text-gray-600">Information Technology</p>
        </Link>

        {/* Automotive - Opens Modal */}
        <button
          onClick={() => openModal('Automotive')}
          className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200"
        >
          <h3 className="text-lg font-semibold">Automotive</h3>
          <p className="text-sm text-gray-600">Automotive Technology</p>
        </button>

        {/* Electronics - Opens Modal */}
        <button
          onClick={() => openModal('Electronics')}
          className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200"
        >
          <h3 className="text-lg font-semibold">Electronics</h3>
          <p className="text-sm text-gray-600">Electronics Technology</p>
        </button>

        {/* Food Tech - Opens Modal */}
        <button
          onClick={() => openModal('FoodTech')}
          className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200"
        >
          <h3 className="text-lg font-semibold">Food Tech</h3>
          <p className="text-sm text-gray-600">Food Technology</p>
        </button>
      </div>

      {/* Render modals */}
      {showModal && activeModal === 'Automotive' && (
        <AutomotiveModal show={showModal} handleClose={closeModal} />
      )}
      {showModal && activeModal === 'Electronics' && (
        <ElectronicsModal show={showModal} handleClose={closeModal} />
      )}
      {showModal && activeModal === 'FoodTech' && (
        <FoodTechModal show={showModal} handleClose={closeModal} />
      )}
      {showModal && activeModal === 'IT_EMC' && (
        <IT_EMCFiles show={showModal} handleClose={closeModal} />
      )}

      {/* Nested routes for other departments */}
      <Outlet />
    </div>
  );
};

export default COT;
