import React from 'react';
import { useState, useEffect} from 'react';
import TireProduct from './TireProduct';

import { handleFilterChange } from "../filterUtils";
import { handleFilterSubmit } from "../filterUtils";

import api from "../api";

import '../styles/Tires.css';

function Tires() {
    const [tires, setTires] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tiresPerPage] = useState(20);

    const [filters, setFilters] = useState({
        tire_size_1: '',
        tire_size: '',
        brand: '',
        pattern: '',
        code: '',
        location: '',
    });

    const tiresURL = "/api/tires/";
    const filterURL = "/api/filter/";

    useEffect(() => {        
        fetchTires();
    }, [tiresURL]);

    const fetchTires = async () => {
        try {
            const token = localStorage.getItem('access');
            console.log(`Tires Token: ${token}`);
            const response = await api.get(tiresURL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.status === 200) {
                throw new Error('Something went wrong!');
            }
            console.log(`Response: ${response}`);
            const fetchedTires = response.data;
            setTires(fetchedTires);
            console.log(`Tires: ${fetchedTires}`);
        } catch (error) {
            console.log(error);
        }
    };

    const indexOfLastTire = currentPage * tiresPerPage;
    const indexOfFirstTire = indexOfLastTire - tiresPerPage;
    const currentTires = tires.slice(indexOfFirstTire, indexOfLastTire);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tires.length / tiresPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="tires-product-page">
            <div className="tires-product-filters">
                <form onSubmit={(e) => handleFilterSubmit(e, filters, setTires, filterURL)}>

                    {/* Text based filters */}
                    <input type="text" name="rim" value={filters.rim} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Rim" />
                    <input type="text" name="code" value={filters.code} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Code" />
                    <input type="text" name="brand" value={filters.brand} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Brand" />
                    <input type="text" name="pattern" value={filters.pattern} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Pattern" />
                    <input type="text" name="tire_size" value={filters.tire_size} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Tire Size" />
                    <input type="text" name="tire_size_1" value={filters.tire_size_1} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Tire Size 1" />

                    {/* Dropdown menu based filters */}
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

                {tires.length === 0 && <h1>No Tires Found</h1>}
            </div>

            <div className="tires-gallery">
                {currentTires && currentTires.map( (tire) => {
                    return <TireProduct key={ tire.id } tire={ tire } />;
                })}
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

export default Tires;