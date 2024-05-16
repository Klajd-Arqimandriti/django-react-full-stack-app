import { useState, useEffect } from 'react';
import api from '../api';

import '../styles/TireEntry.css';


function TireEntry() {
    const [tireData, setTireData] = useState({});
    const [renderFields, setRenderFields] = useState([]);

    const fieldsURL = "/api/fields/";
    const createTireURL = "/api/createTire/";

    useEffect(() => {
        fetchFields();
    }, [fieldsURL]);

    const fetchFields = async () => {
        try {
            const token = localStorage.getItem('access');
            const response = await api.get(fieldsURL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.status === 200) {
                throw new Error('Something went wrong!');
            }

            const fetchedFields = await response.data;

            const mappedFields = fetchedFields.map(field => ({
                name: field.name,
                placeholder: field.placeholder,
                type: field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text',
                className: field.type === 'date' ? 'date-input' : ''
            }));

            setRenderFields(mappedFields);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'number' && (isNaN(parseFloat(value)) || parseFloat(value) <= 0)) {
            return;
        }

        setTireData({ ...tireData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.get(createTireURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tireData),
            });

            if (response.ok) {
                console.log('Tire added successfully');
                setTireData({});
            } else {
                console.error('Failed to add tire: ', response.statusText);
            }
        } catch (error) {
            console.error('Error adding tire:', error);
        }
    };

    return (
        <div className='form-container'>
            <div className='form-box'>
                <form onSubmit={handleSubmit}>
                    {renderFields.map((field, index) => (
                        <div key={`${field.name}-${index}`}>
                            {field.name === 'season' &&
                                <select name={field.name} onChange={handleChange}>
                                    <optgroup label="Season">
                                        <option value="summer">SUMMER</option>
                                        <option value="all season">ALL SEASON</option>
                                        <option value="winter">WINTER</option>
                                    </optgroup>
                                </select>
                            }

                            {field.name === 'car_type' &&
                                <select name={field.name} onChange={handleChange}>
                                    <optgroup label="Car Type">
                                        <option value="passenger">PASSENGER</option>
                                        <option value="light track">LIGHT TRACK</option>
                                        <option value="4x4">4x4</option>
                                    </optgroup>
                                </select>
                            }

                            {field.name === 'location' &&
                                <select name={field.name} onChange={handleChange}>
                                    <optgroup label="Location">
                                        <option value="kamez">KAMEZ</option>
                                        <option value="protire">PROTIRE</option>
                                        <option value="zallherr">ZALLHERR</option>
                                    </optgroup>
                                </select>
                            }

                            {field.name !== 'season' && field.name !== 'car_type' && field.name !== 'location' && field.type === 'number' &&
                                <input type={field.type} min="0" name={field.name} placeholder={field.placeholder} onChange={handleChange} />
                            }

                            {field.name !== 'season' && field.name !== 'car_type' && field.name !== 'location' && field.type !== 'number' &&
                                <input type={field.type} name={field.name} placeholder={field.placeholder} onChange={handleChange} />
                            }
                        </div>
                    ))}
                    <button type="submit">Add Tire</button>
                </form>
            </div>
        </div>
    );
};

export default TireEntry;