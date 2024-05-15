import {useEffect, useState} from 'react';
import { handleFilterChange } from "./filterUtils";
import { handleFilterSubmit } from "./filterUtils";

import '../styles/AddStock.css';
import TireProduct from './TireProduct';

const AddStock = () => {

    const [tires, setTires] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tiresPerPage] = useState(20);

    const tiresURL = '/api/tires/';
    const filterURL = '/api/filter/';

    const [filters, setFilters] = useState({
        brand: '',
        rim: '',
        code: '',
        pattern: '',
        tire_size: '',
        car_type: '',
        location: '',
        width: '',
        ratio: ''
    });

    useEffect(() => {

        const fetchTires = async () => {
            try {
                const response = await api.get(tiresURL);
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }

                const fetchedTires = await response.json();
                setTires(fetchedTires);
            } catch (error) {
                console.log(error);
            }
        };
        fetchTires();
    }, []);

    const indexOfLastTire = currentPage * tiresPerPage;
    const indexOfFirstTire = indexOfLastTire - tiresPerPage;
    const currentTires = tires.slice(indexOfFirstTire, indexOfLastTire);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tires.length / tiresPerPage); i++) {
        pageNumbers.push(i);
    }

    // Rest of your component for searching and adding stock...
    return (
        <div>

            <div className="tires-product-filters">
                <form onSubmit={(e) => handleFilterSubmit(e, filters, setTires, filterURL)}>

                    {/* Text based filters */}

                    <input type="text" name="rim" value={filters.rim} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Rim" />
                    <input type="text" name="code" value={filters.code} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Code" />
                    <input type="text" name="brand" value={filters.brand} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Brand" />
                    <input type="text" name="pattern" value={filters.pattern} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Pattern" />
                    <input type="text" name="width" value={filters.width} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Width" />
                    <input type="text" name="ratio" value={filters.ratio} onChange={(e) => handleFilterChange(e, filters, setFilters)} placeholder="Ratio" />

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

export default AddStock;
