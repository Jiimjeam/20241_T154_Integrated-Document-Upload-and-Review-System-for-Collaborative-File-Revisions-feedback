import React, { useState, useEffect } from "react";
import axios from "axios";

const SettingsSENF = () => {
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [collegeDepartments, setCollegeDepartments] = useState({});

  useEffect(() => {
    setCollegeDepartments({
      COT: ["BSIT", "BSAT", "BSET"],
      CON: ["Nursing", "Midwifery"],
      CAS: ["Biology", "Mathematics", "Physics"],
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!college || !department) {
      setMessage("Please select both college and department.");
      setIsError(true);
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/update-settings",
        { college, department },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("College and department successfully updated!");
    } catch (error) {
      console.error("Error updating settings:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred";
      if (
        error.response?.status === 400 &&
        errorMessage.includes("already updated")
      ) {
        setMessage("College and department are already updated.");
      } else {
        setMessage(errorMessage);
      }
      setIsError(true);
    }
  };

  return (
    <div className="w-[1000px] mx-auto p-8 bg-white rounded-lg shadow-lg">
  <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
    Set College & Department
  </h2>
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label htmlFor="college" className="block text-gray-700 font-medium mb-2">
        College:
      </label>
      <select
        id="college"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={college}
        onChange={(e) => {
          setCollege(e.target.value);
          setDepartment("");
        }}
        required
      >
        <option value="" disabled>
          Select College
        </option>
        {Object.keys(collegeDepartments).map((collegeKey) => (
          <option key={collegeKey} value={collegeKey}>
            {collegeKey}
          </option>
        ))}
      </select>
    </div>

    {college && collegeDepartments[college] && (
      <div>
        <label
          htmlFor="department"
          className="block text-gray-700 font-medium mb-2"
        >
          Department:
        </label>
        <select
          id="department"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Department
          </option>
          {collegeDepartments[college].map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
    )}

    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Update
    </button>
  </form>

  {message && (
    <p
      className={`mt-6 p-4 rounded-lg text-center font-medium ${
        isError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
      }`}
    >
      {message}
    </p>
  )}
</div>
  );
};

export default SettingsSENF;
