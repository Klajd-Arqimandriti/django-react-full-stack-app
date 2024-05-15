// import React from 'react';
import { useState, useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';

import api from '../api';

import { handleFilterChange } from "../filterUtils";
import { handleFilterSubmit } from "../filterUtils";

import '../styles/TireHotel.css';
import '../styles/Tires.css';
import TireProduct from "./TireProduct";

const TireHotel = () => {
    // const navigate = useNavigate();
    const [hotelTires, setHotelTires] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tiresPerPage] = useState(20);


    const [filters, setFilters] = useState({
        tire_size_1: '',
        tire_size: '',
        brand: '',
        pattern: '',
        code: '',
        location: '',
        customer_name: '',
    });

    const hotelTiresURL = `/api/hotelTires/`;
    const filterHotelURL = `/api/hotelFilter/`;

    useEffect(() => {
        fetchHotelTires();
    }, []);
    
    const fetchHotelTires = async () => {
        try {
            const token = localStorage.getItem("access");
            const response = await api.get(hotelTiresURL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const fetchedHotelTires = await response.json();
            setHotelTires(fetchedHotelTires);
            // setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const indexOfLastTire = currentPage * tiresPerPage;
    const indexOfFirstTire = indexOfLastTire - tiresPerPage;
    const currentTires = hotelTires.slice(indexOfFirstTire, indexOfLastTire);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(hotelTires.length / tiresPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="tires-product-page">
            <div className="tires-product-filters">
                <form onSubmit={(e) => handleFilterSubmit(e, setHotelFilters, setHotelTires(), filterHotelURL)}>

                    {/* Text based filters */}
                    <input type="text" name="rim" value={filters.rim} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Rim" />
                    <input type="text" name="code" value={filters.code} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Code" />
                    <input type="text" name="brand" value={filters.brand} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Brand" />
                    <input type="text" name="pattern" value={filters.pattern} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Pattern" />
                    <input type="text" name="tire_size" value={filters.tire_size} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Tire Size" />
                    <input type="text" name="tire_size_1" value={filters.tire_size_1} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Tire Size 1" />
                    <input type="text" name="customer_name" value={filters.customer_name} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Customer Name" />

                </form>
                    {hotelTires.length === 0 && <h1>No Hotel tires Found</h1>}
            </div>

            {/*<div className="tire-hotel-entry-options">*/}
            {/*    <button onClick={handleAddTireToHotel}>Add Hotel Tire</button>*/}
            {/*</div>*/}


            <div className="tires-gallery">
                {currentTires.map(tire => (
                    <TireProduct key={tire.id} tire={tire} />
                ))}
            </div>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={number === currentPage ? 'active' : ''}>
                        <button className="paginationButton" onClick={() => setCurrentPage(number)}>{number}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TireHotel;