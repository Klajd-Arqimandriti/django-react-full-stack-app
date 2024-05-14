// import React from 'react';
import { useState, useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';

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


    const [hotelFilters, setHotelFilters] = useState({
        customer_name: '',
    })

    const hotelTiresURL = `${import.meta.env.VITE_API_URL}/api/hotelTires/`;
    const filterHotelURL = `${import.meta.env.VITE_API_URL}/api/hotelFilter/`;

    useEffect(() => {

        const fetchHotelTires = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await fetch(hotelTiresURL, {
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
        fetchHotelTires();
    }, []);

    const indexOfLastTire = currentPage * tiresPerPage;
    const indexOfFirstTire = indexOfLastTire - tiresPerPage;
    const currentTires = hotelTires.slice(indexOfFirstTire, indexOfLastTire);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(hotelTires.length / tiresPerPage); i++) {
        pageNumbers.push(i);
    }

    // const handleAddTireToHotel = () => {
    //     navigate('/add-tire-to-hotel');
    // }

    return (
        <div className="tires-product-page">
            <div className="tires-product-filters">
                <form onSubmit={(e) => handleFilterSubmit(e, setHotelFilters, setHotelTires(), filterHotelURL)}>

                    {/* Text based filters */}
                    <input type="text" name="customer_name" value={hotelFilters.customer_name} onChange={(e) => handleFilterChange(e, hotelFilters, setHotelFilters)} placeholder="Customer Name" />

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