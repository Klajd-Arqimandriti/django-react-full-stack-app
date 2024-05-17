// import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/InteractiveSheet.css';

import { handleInteractiveSheetFilterChange } from "../filterUtils";
import { handleFilterSubmit } from "../filterUtils";
import { downloadExcel, downloadPDF } from "../utils";

function InteractiveSheet( isEditable ) {

    const [originalTires, setOriginalTires] = useState([]);
    const [tires, setTires] = useState([]);
    const [changedInputs, setChangedInputs] = useState({});
    const [selectedColumns, setSelectedColumns] = useState({});
    const [columnVisibility, setColumnVisibility] = useState({});
    const [changedInputsArray, setChangedInputsArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [tiresPerPage] = useState(20);

    // const [pendingChanges, setPendingChanges] = useState({});
    // const [confirmingChange, setConfirmingChange] = useState(false);
    // const [filters, setFilters] = useState({});

    const filterURL = "/api/filter/";

    const handleInputChange = (e, rowIndex, columnName) => {
        const {value} = e.target;
        const newChangedInputs = {
            ...changedInputs,
            [`${rowIndex}-${columnName}`]: value !== tires[rowIndex][columnName]
        };
        setChangedInputs(newChangedInputs);

        const newChangedInputsArray = [...changedInputsArray]

        const tuple = {rowIndex, columnName};

        // Add a class to the input field based on whether its value has changed
        const input = e.target;
        if (value !== originalTires[rowIndex][columnName]) {
            input.classList.add('changed');
            newChangedInputsArray.push(tuple);
        } else {
            input.classList.remove('changed');
            const index = newChangedInputsArray.findIndex(item => item.rowIndex === rowIndex && item.columnName === columnName);
            if (index !== -1) {
                newChangedInputsArray.splice(index, 1);
            }
        }
        setChangedInputsArray(newChangedInputsArray);

        console.log(`Changed inputs: ${newChangedInputsArray}`);

        //Update value
        const newTires = [...tires];
        newTires[rowIndex] = {...newTires[rowIndex], [columnName]: value};
        setTires(newTires);
    };

    const tableHeaders = [
        {header: "Code", key: "code", inputType: "text", permanent: true},
        {header: "Brand", key: "brand", inputType: "text", permanent: true},
        {header: "Price (€)", key: "price", inputType: "number", permanent: true},
        {header: "Stock", key: "stock", inputType: "number", permanent: true},
        {header: "Pattern", key: "pattern", inputType: "text"},
        {header: "Tire Size", key: "tiresize", inputType: "text"},
        {header: "Tire Size 1", key: "tiresize1", inputType: "text"}, // To be selective
        {header: "Season", key: "season", inputType: "text"}, // To be selective
        {header: "Car Type", key: "car_type", inputType: "text"}, // To be selective
        {header: "Position", key: "position", inputType: "text"}, // To be selective
        {header: "Width", key: "width", inputType: "number"}, // To be selective
        {header: "Ratio", key: "ratio", inputType: "number"}, // To be selective
        {header: "Rim", key: "rim", inputType: "number"}, // To be selective
        {header: "Speed Index", key: "speed_index", inputType: "text"}, // To be selective
        {header: "ZIP Code", key: "zip_code", inputType: "text"}, // To be selective
        {header: "Country", key: "country", inputType: "text"}, // To be selective
        {header: "Min. Stock", key: "min_stock", inputType: "number"}, // To be selective
        {header: "Location", key: "location", inputType: "number"},
        {header: "Manufacturing Date", key: "manufacturing_date", inputType: "number"}, // To be selective
        {header: "Origin", key: "origin", inputType: "text"}, // To be selective
        {header: "Reserved Amount", key: "reserved_amount", inputType: "number"}, // To be selective
    ];

    const handleColumnVisibilityChange = (key) => {
        const updatedVisibility = {...columnVisibility, [key]: !columnVisibility[key]};
        setColumnVisibility(updatedVisibility);
    };

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    useEffect(() => {
        const fetchTires = async (pageNumber) => {
            try {
                const filterParams = new URLSearchParams(selectedColumns).toString();
                const token = localStorage.getItem('access');
                const response = await fetch(`/api/tires/?page=${pageNumber}&limit=${tiresPerPage}&${filterParams}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }

                const fetchedTires = await response.json();
                setTires(fetchedTires);
                setOriginalTires(fetchedTires);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTires();
    }, [selectedColumns, tiresPerPage]);

    // const handleFilterChange = (e, filterName) => {
    //     const newFilters = {...filters, [filterName]: e.target.value};
    //     setFilters(newFilters);
    // };

    const getFilteredTires = () => {
        return tires.filter(tire => {
            return Object.entries(selectedColumns).every(([key, value]) => {
                if (Object.prototype.hasOwnProperty.call(tire, key) && tire[key] != null) {
                    return tire[key].toString().toLowerCase().includes(value.toLowerCase());
                } else {
                    return value === '';
                }
            });
        });
    };


    const downloadExcel = async () => {
        const response = await fetch("/api/download_excel/", {
            method: 'POST',
            headers: {
                'Content-Type': ' application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({tires: getFilteredTires()}),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'tires_data.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const downloadPDF = async () => {
        const response = await fetch("/api/download_pdf/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ /* Add any data needed for PDF generation */}),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'file.pdf'); // Set the desired file name
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // Create a new array of table headers with permanent columns followed by optional columns that are currently visible
    const visibleTableHeaders = tableHeaders.filter(({key, permanent}) => permanent || columnVisibility[key]);

    const toggleChangedModal = () => {
        setShowConfirmChangesModal(!showConfirmChangesModal);
    };

    const confirmChanges = async () => {
        try {
            for (const {rowIndex, columnName} of changedInputsArray) {
                const value = tires[rowIndex][columnName];
                const tireId = originalTires[rowIndex].id;

                const response = await fetch(`/api/patchTires/${tireId}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken,
                    },
                    body: JSON.stringify({[columnName]: value}),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update tire with ID ${tireId}`);
                }
            }

            setChangedInputsArray([]);
            toggleChangedModal();
            window.location.reload();
        } catch (error) {
            console.error('Error confirming changes:', error);
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
        <div className="centerStyle">

            <div className="buttonsArea">
                <button className="excel-button" onClick={downloadExcel}>Download Excel</button>
                <button className="pdf-button" onClick={downloadPDF} disabled>Download PDF</button>
                {isEditable && <button className="confirm-changes-button" onClick={toggleChangedModal}>Confirm Changes</button>}
            </div>

            {showConfirmChangesModal && (
                <div className="modal">
                    <div className="interactive-sheet-modal-content">
                        <button className="close-btn" onClick={toggleChangedModal}>Close</button>
                        <button className="confirm-changes-btn" onClick={confirmChanges}>Confirm Changes</button>

                        {changedInputsArray.length > 0 ? (
                            <ul className="list-container">
                                {changedInputsArray.map(({rowIndex, columnName}) => (
                                    <li key={`${rowIndex}-${columnName}`}>
                                        Change made for column &apos;{columnName}&apos; at row: {rowIndex}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <h3>No changes made</h3>
                        )}
                    </div>
                </div>
            )}

            <div className="columnSelector">
                <h2>Column Selector:</h2>
                <select
                    value=""
                    onChange={(e) => handleColumnVisibilityChange(e.target.value)}
                >
                    <option value="">Select Column</option>
                    {tableHeaders.map(({header, key, permanent}) => (
                        !permanent && (
                            <option key={key} value={key}>
                                {header}
                            </option>
                        )
                    ))}
                </select>
                <button className="apply-filters-button"  type="submit" onClick={(e) => handleFilterSubmit(e, selectedColumns, setTires, filterURL)}>Apply Filters</button>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table>
                        <thead>
                        <tr>
                            {tableHeaders.map(({header, key, permanent}) => (
                                (permanent || columnVisibility[key]) && (
                                    <th key={key}>
                                        <input
                                            type="text"
                                            placeholder={`Filter ${header}`}
                                            value={selectedColumns[key]}
                                            onChange={(e) => handleInteractiveSheetFilterChange(e, key, selectedColumns, setSelectedColumns)}
                                        />
                                    </th>
                                )
                            ))}
                        </tr>
                        <tr>
                            {visibleTableHeaders.map(({header, key}) => (
                                <th key={key}>{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {currentTires.map((tire, rowIndex) => (
                            <tr key={tire.id}>
                                {visibleTableHeaders.map(({key}) => (
                                    <td key={key}>
                                        {isEditable ? (
                                            <>
                                                <input
                                                    type={tableHeaders.find(header => header.key === key).inputType}
                                                    value={key === 'price' ? Number(tire[key]).toFixed(0) : tire[key] || ''}
                                                    onChange={(e) => handleInputChange(e, rowIndex, key)}
                                                />
                                            </>
                                        ) : (
                                            <input
                                                type={tableHeaders.find(header => header.key === key).inputType}
                                                value={key === 'price' ? Number(tire[key]).toFixed(0) : tire[key] || ''}
                                                readOnly={true}
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {currentTires.length === 0 && (
                            <tr>
                                <td colSpan={visibleTableHeaders.length} style={{textAlign: 'center'}}>No data found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <ul className="pagination">
                        {pageNumbers.map(number => (
                            <li key={number} className={number === currentPage ? 'active' : ''}>
                                <button className="paginationButton"
                                        onClick={() => setCurrentPage(number)}>{number}</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

InteractiveSheet.propTypes = {
    isEditable: PropTypes.bool,
};

export default InteractiveSheet;