// import React from 'react';
// import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import api from "../api";

import { EU, US, DE, CN, SK } from 'country-flag-icons/react/3x2'
import '../styles/TireProduct.css';


function TireProduct( tire ) {

    const location = useLocation();
    const pathname = location.pathname;

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [showAddStockModal, setShowAddStockModal] = useState(false);
    const [showSellAmountExceedsReservedAmountModal, setShowSellAmountExceedsReservedAmountModal] = useState(false);
    const [showSellAmountExceedsStockAmountModal, setShowSellAmountExceedsStockAmountModal] = useState(false);
    const [showUnReserveModal, setShowUnReserveModal] = useState(false);
    const [reserveQuantity, setReserveQuantity] = useState(1);
    const [unReserveQuantity, setUnReserveQuantity] = useState(1);

    const [sellQuantity, setSellQuantity] = useState(1);
    const [addStockQuantity, setAddStockQuantity] = useState(1);

    const [customerName, setCustomerName] = useState('');
    const [contactPhone, setContactPhone] = useState('');


    const tireServedInAddStock = () => {
        return pathname === '/add-stock';
    }

    const tireServedInSellTires = () => {
        return pathname === '/tire-exit';
    };

    const tireServedInReserveATire = () => {
        return pathname === '/tire-reserve';
    };

    const tireServedInReservedTires = () => {
        return pathname === '/reserved-tires';
    };

    const toggleInfoModal = () => {
        setShowInfoModal(!showInfoModal);
    };

    const toggleUnReserveModal = () => {
      setShowUnReserveModal(!showUnReserveModal);
    };

    const toggleReserveModal = () => {
      setShowReserveModal(!showReserveModal);
    };

    const toggleSellModal = () => {
        setShowSellModal(!showSellModal);
    };

    const toggleAddStockModal = () => {
      setShowAddStockModal(!showAddStockModal);
    };

    const toggleShowSellAmountExceedsReservedAmountModal = () => {
        setShowSellAmountExceedsReservedAmountModal(!showSellAmountExceedsReservedAmountModal);
    };

    const toggleShowSellAmountExceedsStockAmountModal = () => {
        setShowSellAmountExceedsStockAmountModal(!showSellAmountExceedsStockAmountModal);
    };

    const countryData = {
        "European Union": <EU title="European Union" className="flag-svg"/>,
        "United States": <US title="United States" className="flag-svg"/>,
        "Germany": <DE title="Germany" className="flag-svg"/>,
        "China": <CN title="China" className="flag-svg"/>,
        "Slovakia": <SK title="Slovakia" className="flag-svg"/>
    };

    // function getCookie(name) {
    //     let cookieValue = null;
    //     if (document.cookie && document.cookie !== '') {
    //         const cookies = document.cookie.split(';');
    //         for (let i = 0; i < cookies.length; i++) {
    //             const cookie = cookies[i].trim();
    //             if (cookie.startsWith(name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
    // }

    // const csrftoken = getCookie('csrftoken'); // Implement getCookie function to retrieve the CSRF token from cookies

    const sendTireToReserve = (tireId, reservedQuantity, customerName, contactPhone) => {
        let url = `/api/reserveTire/${tireId}/`;
        api.post(url, {
            reservedQuantity,
            customerName,
            contactPhone
        })
        .then(response => {
            if (response.status === 200) {
                console.log(`Tire with ID ${tireId} sent to reserve`);
            } else {
                console.error('Failed to send tire to reserve');
                console.log(response);
                console.log(`Response method: ${response.statusText}`);
            }
            console.log(url);
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Error sending tire to reserve:', error);
        });
    };

    const unReserveTire = (tireId) => {
        let url = `/api/unReserveTire/${tireId}/`;
        api.post(url)
        .then(response => {
            if (response.status === 200) {
                console.log(`Tire with ID ${tireId} successfully un-reserved`);
            } else {
                console.error('Failed to unreserve tire');
                console.log(response);
                console.log(`Response method: ${response.statusText}`);
            }
            console.log(url);
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Error unreserving tire:', error);
        });
    };

    const openStockPanel = () => {
        setShowAddStockModal(true);
    }

    const reserveTire = () => {
        console.log(`Reserving ${reserveQuantity} tires`);
        setShowReserveModal(true);
    };

    // To add custom exception here (cannot reserve more than max amount of tire)
    const increaseUnReserveQuantity = () => {
        setUnReserveQuantity(prevQuantity => prevQuantity + 1);
    };

    // To add custom exception here (cannot decrease into less than 1 tire)
    const decreaseUnReserveQuantity = () => {
        if (unReserveQuantity > 1) {
            setUnReserveQuantity(prevQuantity => prevQuantity - 1);
        } else {
            console.log(`Error. ${unReserveQuantity} is less than 1`);
        }
    };

    // To add custom exception here (cannot reserve more than max amount of tire)
    const increaseReserveQuantity = () => {
      setReserveQuantity(prevQuantity => prevQuantity + 1);
    };

    // To add custom exception here (cannot decrease into less than 1 tire)
    const decreaseReserveQuantity = () => {
      if (reserveQuantity > 1) {
        setReserveQuantity(prevQuantity => prevQuantity - 1);
      } else {
          console.log(`Error. ${reserveQuantity} is less than 1`);
      }
    };


    const sendTireToSell = (tireId, sellQuantity, customerName, contactPhone) => {
        let url = `/api/sellTire/${tireId}/`;
        const token = localStorage.getItem("access");
        api.post(url, {
            sellQuantity,
            customerName,
            contactPhone
        })
        .then(response => {
            if (response.status === 200) {
                console.log(`Tire with ID ${tireId} sold ${sellQuantity} pieces`);
            } else if (response.status === 400) {
                response.json().then(data => {
                    if (data.message === 'Invalid amount. Sell quantity exceeds stock quantity.') {
                        toggleShowSellAmountExceedsStockAmountModal();
                    }
                    if (data.message === 'Invalid amount. Sell quantity exceeds reserved amount.') {
                        toggleShowSellAmountExceedsReservedAmountModal();
                    }
                });
            }
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Error selling tire:', error);
        });
    };

    const sellTire = () => {
        setShowSellModal(true);
    };

    // To add custom exception here (cannot sell more than max amount of tire)
    const increaseSellQuantity = () => {
        setSellQuantity(prevQuantity => prevQuantity + 1);
    };

    // To add custom exception here (cannot decrease into less than 1 tire)
    const decreaseSellQuantity = () => {
        if (sellQuantity > 1) {
            setSellQuantity(prevQuantity => prevQuantity - 1);
        } else {
            console.log(`Error. Sell quantity: ${sellQuantity} is less than 1`);
        }
    };

    const increaseStockQuantity = () => {
        setAddStockQuantity(prevStockQuantity => prevStockQuantity + 1);
    };

    const decreaseStockQuantity = () => {
        if (addStockQuantity > 1) {
            setAddStockQuantity(prevStockQuantity => prevStockQuantity - 1)
        } else {
            console.log(`Error. Add stock quantity: ${addStockQuantity} is less than 1`);
        }

    };

    const addStockToTire = (tireId, stockQuantity) => {
        let url = `/api/addTireStock/${tireId}/`;
        const token = localStorage.getItem("access");
        api.patch(url, {
            stockQuantity
        })
        .then(response => {
            if (response.status === 200) {
                console.log(`Tire with ID ${tireId} increased stock by ${stockQuantity} pieces`);
                // Update the UI or state accordingly
                // For example, remove the tire from the search results
            } else {
                console.error(`Failed to add stock to tire: ${tireId}`);
                console.log(response);
                console.log(`Response method: ${response.statusText}`);
            }
            console.log(url);
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Error adding stock to tire:', error);
        });
    
        console.log(`Adding ${stockQuantity} of stock to tire with ID: ${tireId}`);
    };

    // Assuming 'image' and 'stock' fields are part of your tire object.
    // Update these if your model has different fields for them.
    return (
        <div className={`tire-product ${tire.tire.stock === 0 ? 'out-of-stock' : ''} ${tire.tire.stock < tire.tire.min_stock ? 'below-min-stock' : ''}`}>
            <img src='/transparent-tire.png' alt="Tire" />
            {tire.tire.stock === 0 &&
                <img
                    src="/out-of-stock.png"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '150%', zIndex: 1 }}
                    alt="Out of Stock Image"
                />
            }

            {tire.tire.stock < tire.tire.min_stock &&
                <img
                    src="/low-stock.png"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '150%', zIndex: 1 }}
                    alt="Out of Stock Image"
                />
            }
            <div className="tire-info">
                <div style={{ textAlign: 'right'}}>
                    <h3 style={{ color: 'white'}}>{tire.tire.pattern}</h3>
                    <p>Brand: {tire.tire.brand}</p>
                    <p>Season: {tire.tire.season}</p>
                    <p>Car Type: {tire.tire.car_type}</p>
                    <p>Width-Ratio: {`${Number(tire.tire.width)}/${Number(tire.tire.ratio)} ${tire.tire.rim}`}</p>
                    <p>Code: {tire.tire.code}</p>
                    <p>Price: € {tire.tire.price}</p>
                    {!tireServedInReservedTires() && <p>Stock: {tire.tire.stock}</p>}

                    {tireServedInReservedTires() &&
                        <>
                            <p>Reserved Amount: {tire.tire.reserved_amount}</p>
                            <p>Customer Name: {tire.tire.customer_name}</p>
                            <p>Phone Number: {tire.tire.contact_phone}</p>
                        </>
                    }
                    <p>{tire.tire.location}</p>
                </div>

                <p className="more-details" onClick={toggleInfoModal}>&#128712; Check more details</p>

                {tireServedInAddStock() && (
                    <div className='action-buttons'>
                        <button onClick={openStockPanel}>Add Stock</button>
                    </div>
                )}


                {tireServedInSellTires() && (
                    <div className="action-buttons">

                        <button
                            className={`${tire.tire.stock === 0 ? 'greyed-out-button' : ''}`}
                            onClick={sellTire}
                            disabled={tire.tire.stock === 0}
                        >
                            Sell Tire</button>
                    </div>
                )}

                {tireServedInReserveATire() && (
                    <div>
                        <button
                            className={`${tire.tire.stock === 0 ? 'greyed-out-button' : ''}`}
                            onClick={reserveTire}
                            disabled={tire.tire.stock === 0}
                        >
                            Reserve Tire</button>
                    </div>
                )}

                {tireServedInReservedTires() && (
                    <div>
                        <button
                            className={`${tire.tire.stock === 0 ? 'greyed-out-button' : ''}`}
                            onClick={() => unReserveTire(tire.tire.id)}
                            disabled={tire.tire.stock === 0}
                        >
                            Un-Reserve Tire</button>

                        <button onClick={sellTire}>Sell Reserved Tire</button>
                    </div>
                )}

            </div>
            {showInfoModal && (
                <div className="modal">
                    <div className="modal-content">
                        {/* Add additional details here */}
                        <button className="close-btn" onClick={toggleInfoModal}>Close</button>
                        <p>Zip Code: {tire.tire.zip_code}</p>
                        <p>Country: {tire.tire.country}</p>
                        <p>Minimum Stock: {tire.tire.min_stock}</p>
                        <p>Origin: {tire.tire.origin} - {countryData[tire.tire.origin]}</p>
                    </div>
                </div>
            )}

            {showReserveModal ? (
                <div className="modal">
                    <div className="modal-content">
                        {/* Add reserve tire content here */}
                        <button className="close-btn" onClick={toggleReserveModal}>Close</button>
                        <div className="customer-info">
                            <label htmlFor="customerName">Customer Name:</label>
                            <input type="text" id="customerName" name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

                            <label htmlFor="contactPhone">Contact Phone:</label>
                            <input type="text" id="contactPhone" name="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                        </div>

                        <div className="secondary-action-buttons">
                            {tireServedInReserveATire() && (
                                <>
                                    <div className='reservation-buttons'>
                                        <button className='plus-btn' onClick={increaseReserveQuantity}>+</button>
                                        <button className={'reserve-btn'} onClick={() => sendTireToReserve(tire.tire.id, reserveQuantity, customerName, contactPhone)} disabled={tire.tire.stock === 0}>Reserve</button>
                                        <button className='minus-btn' onClick={decreaseReserveQuantity}>-</button>
                                    </div>

                                    <p>Reserved quantity: {reserveQuantity}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}

            {showUnReserveModal ? (
                <div className="modal">
                    <div className="modal-content">
                        {/* Add reserve tire content here */}
                        <button className="close-btn" onClick={toggleUnReserveModal}>Close</button>

                        <div className="secondary-action-buttons">
                            {tireServedInReservedTires() && (
                                <>
                                    <div className='unreservation-buttons'>
                                        <button className='plus-btn' onClick={increaseUnReserveQuantity}>+</button>
                                        <button className={'reserve-btn'} onClick={() => sendTireToReserve(tire.tire.id, unReserveQuantity, customerName, contactPhone)} disabled={tire.tire.stock === 0}>Reserve</button>
                                        <button className='minus-btn' onClick={decreaseUnReserveQuantity}>-</button>
                                    </div>

                                    <p>Quantity to Unreserve: {reserveQuantity}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}

            {showSellModal && (
            <div className="modal">
                <div className="modal-content">
                    {/* Add sell tire content here */}
                    <button className="close-btn" onClick={toggleSellModal}>Close</button>
                    <div className="customer-info">
                        <label htmlFor="customerName">Customer Name:</label>
                        <input type="text" id="customerName" name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

                        <label htmlFor="contactPhone">Contact Phone:</label>
                        <input type="text" id="contactPhone" name="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                    </div>

                    <div className="secondary-action-buttons">
                        {tireServedInReserveATire() && (
                            <>
                                <div className='reservation-buttons'>
                                    <button className='plus-btn' onClick={increaseReserveQuantity}>+</button>
                                    <button className='reserve-btn' onClick={() => sendTireToReserve(tire.tire.id, reserveQuantity, customerName, contactPhone)} disabled={tire.tire.reserved_amount === 0}>Reserve</button>
                                    <button className='minus-btn' onClick={decreaseReserveQuantity}>-</button>
                                </div>
                                <p>Reserved quantity: {reserveQuantity}</p>
                            </>
                        )}
                    </div>


                    <div className="secondary-action-buttons">
                        {tireServedInSellTires() && (
                            <>
                                <div>
                                    <button className='plus-btn' onClick={increaseSellQuantity}>+</button>
                                    <button className='sell-btn' onClick={() => sendTireToSell(tire.tire.id, sellQuantity, customerName, contactPhone)} disabled={tire.tire.stock === 0}>Sell</button>
                                    <button className='minus-btn' onClick={decreaseSellQuantity}>-</button>
                                </div>
                                <p>Sell quantity: {sellQuantity}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}

            {showAddStockModal && (
                <div className="modal">
                    <div className="modal-content">
                        {/* Add sell tire content here */}
                        <button className="close-btn" onClick={toggleAddStockModal}>Close</button>
                        <p>Add stock quantity: {addStockQuantity}</p>
                        <div className="secondary-action-buttons">
                            <button className='plus-btn' onClick={increaseStockQuantity}>+</button>
                            <button className='add-stock-btn' onClick={() => addStockToTire(tire.tire.id, addStockQuantity)}>Add Stock</button>
                            <button className='minus-btn' onClick={decreaseStockQuantity}>-</button>
                        </div>
                    </div>
                </div>
            )}

            {showSellAmountExceedsStockAmountModal && (
                <div className="fullscreen-modal">
                    <div className="modal-content">
                        <button className="fullscreen-close-btn" onClick={toggleShowSellAmountExceedsStockAmountModal}>Close</button>
                        <h1 className='modal-h3'>Sell amount exceeds stock amount.</h1>
                    </div>
                </div>
            )}

            {showSellAmountExceedsReservedAmountModal && (
                <div className="fullscreen-modal">
                    <div className="modal-content">
                        <button className="fullscreen-close-btn" onClick={toggleShowSellAmountExceedsReservedAmountModal}>Close</button>
                        <h1 className='modal-h3'>Sell amount exceeds reserved amount.</h1>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TireProduct;
