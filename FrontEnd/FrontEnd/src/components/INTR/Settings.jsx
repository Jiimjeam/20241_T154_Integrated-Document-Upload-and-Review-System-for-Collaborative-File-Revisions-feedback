import React, { useState } from "react";
import axios from "axios";
import './Settings.css';

const Settings = () => {
    const [college, setCollege] = useState("");
    const [department, setDepartment] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false); // To differentiate between success and error messages

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages
        setIsError(false);

        try {
            const response = await axios.put(
                "http://localhost:5000/api/auth/update-settings",
                { college, department },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
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
                // Custom error message for already updated case
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
                <div className="form-group">
                    <label htmlFor="college">College:</label>
                    <select
                        id="college"
                        className="form-control"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select College
                        </option>
                        <option value="COT">College of Technology (COT)</option>
                        <option value="CON">College of Nursing (CON)</option>
                        <option value="CAS">College of Arts and Sciences (CAS)</option>
                    </select>
                </div>

                {college === "COT" && (
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
                            <option value="Bachelor of Science in Information Technology & Bachelor of Science in EMC">
                                Bachelor of Science in Information Technology & Bachelor of Science in EMC
                            </option>
                            <option value="Bachelor of Science in Food Technology">
                                Bachelor of Science in Food Technology
                            </option>
                        </select>
                    </div>
                )}

                <button type="submit" className="btn btn-primary">
                    Update Settings
                </button>
            </form>

            {message && (
                <p
                    className={`settings-message ${
                        isError ? "error" : "success"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default Settings;
