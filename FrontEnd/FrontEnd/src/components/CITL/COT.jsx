import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import IT_EMCFiles from './IT_EMCFiles';

const COT = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  // Detect if the current path is IT and EMC
  const isIT_EMCPath = location.pathname.endsWith('it_emc');

  // Open modal when navigating to /cot/it_emc
  React.useEffect(() => {
    if (isIT_EMCPath) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isIT_EMCPath]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">College of Technology</h1>
      <p className="text-gray-700 mb-6">Explore the departments under COT:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <Link to="it_emc" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">IT and EMC</h3>
          <p className="text-sm text-gray-600">Information Technology and EMC</p>
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

      {/* Render IT_EMCFiles Modal */}
      {showModal && <IT_EMCFiles show={showModal} handleClose={handleCloseModal} />}

      {/* Nested routes for other departments */}
      <Outlet />
    </div>
  );
};

export default COT;
