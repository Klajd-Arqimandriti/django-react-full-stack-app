import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import api from "../api";
import '../styles/HotelTireProduct.css';

function HotelTireProduct( hotelTire ) {

    const removeHotelTire = (hotelTireId) => {
        let url = `/api/removeHotelTire/${hotelTireId}/`;
        api.post(url)
        .then(response => {
            if (response.status === 200) {
                console.log(`Hotel Tire with ID ${hotelTireId} successfully removed from hotel`);
            } else {
                console.log(`Failed to remove hotel tire with ID: ${hotelTireId} | Response status code: ${response.status}`);
            }
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Error removing hotel tire:', error);
        });
    }

    return (
        <div className='hotel-tire-product'>
            <img src='/transparent-tire.png' alt="Tire" />

            <div className='hotel-tire-info'>
                <div style={{ textAlign: 'right'}}>
                    <h3 style={{ color: 'white'}}>{hotelTire.hotelTire.pattern}</h3>
                    <p>Brand: {hotelTire.hotelTire.brand}</p>
                    <p>Customer Name: {hotelTire.hotelTire.customer_name}</p>
                    <p>Contact Phone: {hotelTire.hotelTire.contact_phone}</p>
                    <p>Amount: {hotelTire.hotelTire.amount}</p>
                    <p>Location: {hotelTire.hotelTire.location}</p>
                </div>
            </div>

            <div className="action-buttons">
                <button onClick={() => removeHotelTire(hotelTire.hotelTire.id)}>Remove Hotel Tire</button>
            </div>
        </div>
    )
}

export default HotelTireProduct;
