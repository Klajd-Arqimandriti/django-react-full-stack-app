import { useState, useEffect } from 'react';
import api from '../api';

import '../styles/HotelTireEntry.css';


function HotelTireEntry() {
    const [hotelTireData, setHotelTireData] = useState({});
    const [renderHotelFields, setRenderHotelFields] = useState([]);

    const hotelFieldsURL = "/api/hotel/fields/";
    const createHotelTireURL = "/api/createHotelTire/";

    useEffect(() => {
        fetchFields();
    }, [hotelFieldsURL]);

    const fetchFields = async () => {
        try {
            const token = localStorage.getItem('access');
            const response = await api.get(hotelFieldsURL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.status === 200) {
                throw new Error('Something went wrong!');
            }

            const fetchedHotelFields = await response.data;

            const mappedHotelFields = fetchedHotelFields.map(hotelField => ({
                name: hotelField.name,
                placeholder: hotelField.placeholder,
                type: hotelField.type === 'date' ? 'date' : hotelField.type === 'number' ? 'number' : 'text',
                className: hotelField.type === 'date' ? 'date-input' : ''
            }));

            setRenderHotelFields(mappedHotelFields);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHotelTireData({ ...hotelTireData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("access");
            const response = await api.post(createHotelTireURL, hotelTireData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(hotelTireData),
            });

            if (response.status === 201) {
                console.log('Hotel Tire added successfully');
                setHotelTireData({});
            } else {
                console.error('Failed to add hotel tire: ', response.statusText);
            }
        } catch (error) {
            console.error('Error adding hotel tire:', error);
        }
    };

    return (
        <div className='form-container'>
            <div className='form-box'>
                <form onSubmit={handleSubmit}>
                    {renderHotelFields.map((hotelField, index) => (
                        <div key={`${hotelField.name}-${index}`}>
                            {hotelField.name === 'season' &&
                                <select name={hotelField.name} onChange={handleChange}>
                                    <optgroup label="Season">
                                        <option value="summer">SUMMER</option>
                                        <option value="all season">ALL SEASON</option>
                                        <option value="winter">WINTER</option>
                                    </optgroup>
                                </select>
                            }

                            {hotelField.name === 'car_type' &&
                                <select name={hotelField.name} onChange={handleChange}>
                                    <optgroup label="Car Type">
                                        <option value="passenger">PASSENGER</option>
                                        <option value="light track">LIGHT TRACK</option>
                                        <option value="4x4">4x4</option>
                                    </optgroup>
                                </select>
                            }

                            {hotelField.name === 'location' &&
                                <select name={hotelField.name} onChange={handleChange}>
                                    <optgroup label="Location">
                                        <option value="kamez">KAMEZ</option>
                                        <option value="protire">PROTIRE</option>
                                        <option value="zallherr">ZALLHERR</option>
                                    </optgroup>
                                </select>
                            }


                            {hotelField.name !== 'season' && hotelField.name !== 'car_type' && hotelField.name !== 'location' && hotelField.type === 'number' &&
                                <input type={hotelField.type} min="0" name={hotelField.name} placeholder={hotelField.placeholder} onChange={handleChange} />
                            }

                            {hotelField.name !== 'season' && hotelField.name !== 'car_type' && hotelField.name !== 'location' && hotelField.type !== 'number' &&
                                <input type={hotelField.type} name={hotelField.name} placeholder={hotelField.placeholder} onChange={handleChange} />
                            }
                        </div>
                    ))}

                    <button type="submit">Add Hotel Tire</button>
                </form>
            </div>
        </div>
    );
};

export default HotelTireEntry;