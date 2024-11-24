import React from 'react';
import { Link } from 'react-router-dom';

const COT = () => {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">College of Technology</h1>
      <p className="text-gray-700 mb-6">Explore the departments under COT:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <Link to="/cot/it_emc" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">IT and EMC</h3>
          <p className="text-sm text-gray-600">Information Technology and EMC</p>
        </Link>
        <Link to="/cot/automotive" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">Automotive</h3>
          <p className="text-sm text-gray-600">Automotive Technology</p>
        </Link>
        <Link to="/cot/electronics" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">Electronics</h3>
          <p className="text-sm text-gray-600">Electronics Technology</p>
        </Link>
        <Link to="/cot/food-tech" className="p-4 border rounded-lg bg-blue-100 shadow-md hover:bg-blue-200">
          <h3 className="text-lg font-semibold">Food Tech</h3>
          <p className="text-sm text-gray-600">Food Technology</p>
        </Link>
      </div>
    </div>
  );
};

export default COT;
