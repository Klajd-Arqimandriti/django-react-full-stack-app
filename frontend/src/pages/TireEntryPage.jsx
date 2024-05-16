// TireEntryPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

import "../styles/TireEntryPage.css"


const TireEntryPage = () => {
    const navigate = useNavigate();

    const handleAddStock = () => {
        navigate('/add-stock');
    };

    const handleAddNewTire = () => {
        navigate('/add-new-tire');
    };

    const handleHotelTire = () => {
        navigate('/add-tire-hotel')
    }

    return (
        <div className="tire-entry-options">
            <button onClick={handleAddStock}>Add Stock</button>
            <button onClick={handleAddNewTire}>Add New Tire</button>
            <button onClick={handleHotelTire}>Add Hotel Tire</button>
        </div>
    );
};

export default TireEntryPage;
