import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Settings.css";

const SettingsSENF = () => {
    const [college, setCollege] = useState(""); // College state
    const [department, setDepartment] = useState(""); // Department state
    const [message, setMessage] = useState(""); // Success or error message
    const [isError, setIsError] = useState(false); // Error state for styling
    const [collegeDepartments, setCollegeDepartments] = useState({}); // To store dynamic departments

    // Fetch the department mapping from backend or static (you already have a static mapping here)
    useEffect(() => {
        // If you're fetching from the backend, replace this with your actual API call
        // For now, I will keep the static values but you can replace it with API call.
        setCollegeDepartments({
            COT: ['Bachelor of Science in Information Technology & Bachelor of Science in EMC', 'BSAT', 'BSET'],
            CON: ["Nursing", "Midwifery"],
            CAS: ["Biology", "Mathematics", "Physics"],
        });
    }, []); // Only run once when the component mounts

    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);

        // Validate if both college and department are selected
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
            
            // Handle known error case (already updated, etc.)
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
        <div className="settings-container">
            <h2 className="settings-title">Update Your Settings</h2>
            <form onSubmit={handleSubmit} className="settings-form">
                {/* College Selection */}
                <div className="form-group">
                    <label htmlFor="college">College:</label>
                    <select
                        id="college"
                        className="form-control"
                        value={college}
                        onChange={(e) => {
                            setCollege(e.target.value);
                            setDepartment(""); // Reset department when college changes
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

                {/* Department Selection */}
                {college && collegeDepartments[college] && (
                    <div className="form-group">
                        <label htmlFor="department">Department:</label>
                        <select
                            id="department"
                            className="form-control"
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

                <button type="submit" className="btn btn-primary">
                    Update Settings
                </button>
            </form>

            {/* Message Display */}
            {message && (
                <p
                    className={`settings-message ${isError ? "error" : "success"}`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default SettingsSENF;
