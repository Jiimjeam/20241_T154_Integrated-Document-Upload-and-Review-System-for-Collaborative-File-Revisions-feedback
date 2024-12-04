import React from 'react';
import { Link } from 'react-router-dom';

const PendingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full max-w-full bg-dark dark:bg-gray-900">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-lg w-full transform transition-all duration-500 ease-in-out hover:scale-105">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Account Pending
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Your account is awaiting admin approval. Please wait for confirmation.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          You will be notified once your account has been approved.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go back to Login
        </Link>
      </div>
    </div>
  );
};

export default PendingPage;
