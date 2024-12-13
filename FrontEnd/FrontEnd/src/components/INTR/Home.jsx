import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { toast } from 'react-toastify';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api'; // Adjust API URL as necessary

const Home = () => {
 
};

export default Home;
