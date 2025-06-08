import React, { useEffect, useState } from 'react';
import { fetchPortfolioItems, addPortfolioItem } from '../../services/api';
import './Portfolio.css';

const Portfolio = ({ isAdmin }) => {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        const loadPortfolioItems = async () => {
            const items = await fetchPortfolioItems();
            setPortfolioItems(items);
        };
        loadPortfolioItems();
    }, []);

    const handleAddItem = async () => {
        if (newItem) {
            await addPortfolioItem(newItem);
            setPortfolioItems([...portfolioItems, newItem]);
            setNewItem('');
        }
    };

    return (
        <div className="portfolio">
            <h1>Portfolio</h1>
            <ul>
                {portfolioItems.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            {isAdmin && (
                <div>
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add new portfolio item"
                    />
                    <button onClick={handleAddItem}>Add Item</button>
                </div>
            )}
        </div>
    );
};

export default Portfolio;