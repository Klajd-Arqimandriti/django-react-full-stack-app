// import React from 'react';
import { useState, useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';

import api from '../api';

import { handleFilterChange } from "../filterUtils";
import { handleFilterSubmit } from "../filterUtils";

import '../styles/TireHotel.css';
import '../styles/Tires.css';

import TireProduct from "./TireProduct";
import HotelTireProduct from "./HotelTireProduct";


const TireHotel = () => {
    // const navigate = useNavigate();
    const [hotelTires, setHotelTires] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hotelTiresPerPage] = useState(20);


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
    }, [hotelTiresURL]);
    
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

            if (!response.status === 200) {
                throw new Error('Something went wrong!');
            }

            const fetchedHotelTires = await response.data;
            setHotelTires(fetchedHotelTires);
        } catch (error) {
            console.log(error);
        }
    };

    const indexOfLastHotelTire = currentPage * hotelTiresPerPage;
    const indexOfFirsHoteltTire = indexOfLastHotelTire - hotelTiresPerPage;
    const currentHotelTires = hotelTires.slice(indexOfFirsHoteltTire, indexOfLastHotelTire);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(hotelTires.length / hotelTiresPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="tires-product-page">
                <div className="tires-product-filters">
                    <form onSubmit={(e) => handleFilterSubmit(e, filters, setReservedTires, filterURL)}>

                        {/* Text based filters */}
                        <input type="text" name="location" value={filters.location} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Location" />
                        <input type="text" name="customer_name" value={filters.customer_name} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Customer Name" />

                        {/* Add dropdown menus for additional filters */}
                        <select name="season" value={filters.season} onChange={(e) => handleFilterChange(e, filters, setFilters)}>
                            <optgroup label="Season">
                                <option value="summer">SUMMER</option>
                                <option value="all season">ALL SEASON</option>
                                <option value="winter">WINTER</option>

                                <option value="all terrain">ALL TERRAIN</option>
                                <option value="semi slick">SEMI SLICK</option>
                                <option value="all terrain">ALL TERRAIN</option>
                            </optgroup>
                        </select>

                        <select name="carType" value={filters.car_type} onChange={(e) => handleFilterChange(e, filters, setFilters)}>
                            <optgroup label="Car Type">
                                <option value="passenger">PASSENGER</option>
                                <option value="light track">LIGHT TRACK</option>
                                <option value="4x4">4x4</option>
                            </optgroup>
                        </select>

                        <select name="location" value={filters.location} onChange={(e) => handleFilterChange(e, filters, setFilters)}>
                            <optgroup label='Location'>
                                <option value="kamez">KAMEZ</option>
                                <option value="protire">PROTIRE</option>
                                <option value="zallherr">ZALLHERR</option>
                            </optgroup>

                        </select>
                        <button type="submit">Apply Filters</button>
                    </form>
                    {hotelTires.length === 0 && <h1>No Hotel tires Found</h1>}
            </div>

            {/*<div className="tire-hotel-entry-options">*/}
            {/*    <button onClick={handleAddTireToHotel}>Add Hotel Tire</button>*/}
            {/*</div>*/}


            <div className="tires-gallery">
                {currentHotelTires.map(hotelTire => (
                    <HotelTireProduct key={hotelTire.id} hotelTire={hotelTire} />
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