import React from "react";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";

const PRCHWelcomeMessage = ({ username }) => {

    const { user, logout } = useAuthStore();
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="flex items-center space-x-4">
        
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="mt-1 text-sm md:text-base text-white/80">
            We're glad to see you back. Here's what's happening today.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link to='/Program/syllabi' className="bg-white text-indigo-500 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md">
          View Files
        </Link>
        <Link to="/Program/Calendar" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
          Check Calendar
        </Link>
      </div>
    </div>
  );
};

export default PRCHWelcomeMessage;
