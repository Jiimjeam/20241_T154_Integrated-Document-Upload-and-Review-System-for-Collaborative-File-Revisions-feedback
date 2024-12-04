import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Mathematics from './Mathematics';

const CAS = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    if (location.pathname.endsWith('mathematics')) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [location]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">College of Arts and Sciences</h1>
      <p className="text-gray-700 mb-6">Explore the departments under CAS:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <Link to="mathematics" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">Mathematics</h3>
          <p className="text-sm text-gray-600">Department of Mathematics</p>
        </Link>
        <Link to="biology" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">Biology</h3>
          <p className="text-sm text-gray-600">Department of Biology</p>
        </Link>
        <Link to="chemistry" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">Chemistry</h3>
          <p className="text-sm text-gray-600">Department of Chemistry</p>
        </Link>
        <Link to="physics" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">Physics</h3>
          <p className="text-sm text-gray-600">Department of Physics</p>
        </Link>
      </div>

      {/* Render Mathematics Modal */}
      {showModal && <Mathematics show={showModal} handleClose={() => setShowModal(false)} />}

      {/* Render other department components */}
      <Outlet />
    </div>
  );
};

export default CAS;
