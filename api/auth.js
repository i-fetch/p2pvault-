// src/api/auth.js
import axios from 'axios';

const API_URL =process.env.REACT_APP_API_URL;

// Signup API request
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data; // Success response
  } catch (error) {
    throw error.response.data; // Error response
  }
};

// Login API request
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data; // Success response
  } catch (error) {
    throw error.response.data; // Error response
  }
};
