import axios from 'axios';

// Set your API base URL here
const API_BASE_URL = "http://localhost:5000"; // Replace with your backend URL

export const fetchFiles = async () => {
  const response = await axios.get(`${API_BASE_URL}/files`);
  return response.data;
};

export const approveFile = async (fileId) => {
  const response = await axios.put(`${API_BASE_URL}/files/${fileId}/approve`);
  return response.data;
};

export const reviseFile = async (fileId, comment) => {
  const response = await axios.put(`${API_BASE_URL}/files/${fileId}/revise`, {
    comment,
  });
  return response.data;
};
