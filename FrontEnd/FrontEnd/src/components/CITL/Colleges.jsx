import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Colleges = () => {
  const location = useLocation();

  // Check if the current route is a specific college's route
  const isCollegeRoute = location.pathname !== "/CITL/Colleges";

  return (
    <div className="p-6 text-center">
      {!isCollegeRoute && ( // Show the list of colleges only on the main "/CITL/Colleges" route
        <>
          <h1 className="text-2xl font-bold mb-6">Our Colleges</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="cot" className="p-4 border rounded-lg bg-green-100 shadow-md text-center hover:bg-green-200">
              <h3 className="text-lg font-semibold">COT</h3>
              <p className="text-sm text-gray-600">College of Technology</p>
            </Link>
            <Link to="cas" className="p-4 border rounded-lg bg-green-100 shadow-md text-center hover:bg-green-200">
              <h3 className="text-lg font-semibold">CAS</h3>
              <p className="text-sm text-gray-600">College of Arts and Sciences</p>
            </Link>
            <Link to="cob" className="p-4 border rounded-lg bg-green-100 shadow-md text-center hover:bg-green-200">
              <h3 className="text-lg font-semibold">COB</h3>
              <p className="text-sm text-gray-600">College of Business</p>
            </Link>
            <Link to="con" className="p-4 border rounded-lg bg-green-100 shadow-md text-center hover:bg-green-200">
              <h3 className="text-lg font-semibold">CON</h3>
              <p className="text-sm text-gray-600">College of Nursing</p>
            </Link>
            <Link to="com" className="p-4 border rounded-lg bg-green-100 shadow-md text-center hover:bg-green-200">
              <h3 className="text-lg font-semibold">COM</h3>
              <p className="text-sm text-gray-600">College of Medicine</p>
            </Link>
            
            <Link to="cpag" className="p-4 border rounded-lg bg-green-100 shadow-md text-center hover:bg-green-200">
              <h3 className="text-lg font-semibold">CPAG</h3>
              <p className="text-sm text-gray-600">College of Public Administration and Governance</p>
            </Link>
            <Link to="coe" className="p-4 border rounded-lg bg-green-100 shadow-md text-center hover:bg-green-200">
              <h3 className="text-lg font-semibold">COE</h3>
              <p className="text-sm text-gray-600">College of Engineering</p>
            </Link>
          </div>
        </>
      )}

      {/* Render the content of the selected college */}
      <Outlet />
    </div>
  );
};

export default Colleges;
