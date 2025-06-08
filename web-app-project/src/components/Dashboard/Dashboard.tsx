import React from 'react';
import './Dashboard.css';
import Portfolio from '../Portfolio/Portfolio';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <Portfolio />
            {/* Additional statistics or metrics can be added here */}
        </div>
    );
};

export default Dashboard;