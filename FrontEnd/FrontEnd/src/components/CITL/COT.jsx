import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import IT_EMCFiles from './COT/IT_EMCFiles';
import Automotive from './COT/Automotive';
import Electronics from './COT/Electronics';
import Food from './COT/Food';

const COT = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeModal, setActiveModal] = useState('');

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    // Determine which modal to show based on the route
    if (lastPart === 'it_emc') {
      setShowModal(true);
      setActiveModal('IT_EMC');
    } else if (lastPart === 'automotive') {
      setShowModal(true);
      setActiveModal('Automotive');
    } else if (lastPart === 'electronics') {
      setShowModal(true);
      setActiveModal('Electronics');
    } else if (lastPart === 'food-tech') {
      setShowModal(true);
      setActiveModal('Food');
    } else {
      setShowModal(false);
      setActiveModal('');
    }
  }, [location.pathname]);

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveModal('');
    navigate('/CITL/Colleges/cot'); // Navigate back to the COT route when the modal is closed
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">College of Technology</h1>
      <p className="text-gray-700 mb-6">Explore the departments under COT:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <Link to="it_emc" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">BSIT</h3>
          <p className="text-sm text-gray-600">Information Technology</p>
        </Link>
        <Link to="automotive" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">Automotive</h3>
          <p className="text-sm text-gray-600">Automotive Technology</p>
        </Link>
        <Link to="electronics" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">Electronics</h3>
          <p className="text-sm text-gray-600">Electronics Technology</p>
        </Link>
        <Link to="food-tech" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">Food Tech</h3>
          <p className="text-sm text-gray-600">Food Technology</p>
        </Link>
      </div>

      {/* Render modals based on the active modal */}
      {showModal && activeModal === 'IT_EMC' && (
        <IT_EMCFiles show={showModal} handleClose={handleCloseModal} />
      )}
      {showModal && activeModal === 'Automotive' && (
        <Automotive show={showModal} handleClose={handleCloseModal} />
      )}
      {showModal && activeModal === 'Electronics' && (
        <Electronics show={showModal} handleClose={handleCloseModal} />
      )}
      {showModal && activeModal === 'Food' && (
        <Food show={showModal} handleClose={handleCloseModal} />
      )}

      {/* Nested routes for other departments */}
      <Outlet />
    </div>
  );
};

export default COT;
