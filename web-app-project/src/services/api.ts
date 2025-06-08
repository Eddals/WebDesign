import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

export const fetchPortfolioItems = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/portfolio`);
        return response.data;
    } catch (error) {
        console.error('Error fetching portfolio items:', error);
        throw error;
    }
};

export const addPortfolioItem = async (item) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/portfolio`, item);
        return response.data;
    } catch (error) {
        console.error('Error adding portfolio item:', error);
        throw error;
    }
};