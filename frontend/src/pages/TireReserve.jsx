import React, { useEffect, useState } from 'react';
import '../styles/TireReserve.css';
import '../styles/TireProduct.css';

import api from "../api";

import { handleFilterChange } from "../filterUtils";
import { handleFilterSubmit } from "../filterUtils";
import TireProduct from "./TireProduct";


const TireReserve = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
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

    // const outOfStockStyle = reservedTire.stock <= 0 ? 'out-of-stock' : '';
    // const nearOutOfStock = 0 <= reservedTire.stock <= 0.2 * reservedTire.stock ? 'near-out-of-stock': '';
    // const nearMinimumStockStyle = 0 <= reservedTire.stock <= 0.3 * reservedTire.min_stock ? 'near-minimum-stock' : '';

    const getOutOfStockStyle = (tire) => tire.stock <= 0 ? 'out-of-stock' : '';
    const getNearOutOfStockStyle = (tire) => tire.stock <= 0.2 * tire.stock ? 'near-out-of-stock': '';
    const getNearMinimumStockStyle = (tire) => tire.stock <= 0.3 * tire.min_stock ? 'near-minimum-stock' : '';

    useEffect(() => {        
        fetchTires();
    }, []);

    const fetchTires = async () => {
        try {
            console.log(`Tires URL: ${tiresURL}`);
            const token = localStorage.getItem('access');
            
            console.log(`API: ${api}`);
            const response = await api.get('/api/tires/', {
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
        <div className={"tires-reserve-page"}>
            <div className="tires-product-filters">
                <form onSubmit={(e) => handleFilterSubmit(e, filters, setTires, filterURL)}>

                    {/* Text based filters */}
                    <input type="text" name="rim" value={filters.rim} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Rim" />
                    <input type="text" name="code" value={filters.code} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Code" />
                    <input type="text" name="brand" value={filters.brand} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Brand" />
                    <input type="text" name="pattern" value={filters.pattern} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Pattern" />
                    <input type="text" name="tire_size" value={filters.tire_size} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Tire Size" />
                    <input type="text" name="tire_size_1" value={filters.tire_size_1} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Tire Size 1" />

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

                {tires.length === 0 && <h1>No Tires Found</h1>}
            </div>

            <div className='tires-reserve-container'>

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

export default TireReserve;


{/*    <div className='search-results'>*/}
{/*        {searchResults.map(tire => (*/}
{/*            <div key={tire.id} className='tire-product'>*/}
{/*                <img src='/transparent-tire.png' alt="Tire" />*/}
{/*                <div className="tire-info">*/}
{/*                    <h3>Brand: {tire.brand}</h3>*/}
{/*                    <p>Season: {tire.season}</p>*/}
{/*                    <p>Car Type: {tire.car_type}</p>*/}
{/*                    <p>Size: {`${tire.width}/${tire.ratio}R${tire.rim}`}</p>*/}
{/*                    <p>Speed Index: {tire.speed_index}</p>*/}
{/*                    <p>Country: {tire.country}</p>*/}
{/*                    <p>Price: {tire.price}</p>*/}
{/*                    <p>Stock: {tire.stock}</p>*/}
{/*                    <p className="more-details">&#128712; Check more details</p>*/}
{/*                    <div className="action-buttons">*/}
{/*                        <button onClick={() => sendTireToReserve(tire.id)}>Reserve Tire</button>*/}
{/*                        /!* Add other action buttons here *!/*/}
{/*                    </div>*/}
{/*                </div>*/}
{/*            </div>*/}
{/*        ))}*/}