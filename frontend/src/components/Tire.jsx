import React from "react";
import "../styles/Tire.css";

function Tire({ tire, onDelete }) {
    const formattedDate = new Date(tire.created_at).toLocaleDateString("en-US");

    return <div className="tire-container">
        <p className="tire-brand">{tire.brand}</p>
        <p className="tire-pattern">{tire.pattern}</p>
        <p className="tire-date">{formattedDate}</p>
        <button className="delete-button" onClick={() => onDelete(tire.id)}>
            Delete
        </button>
    </div>
}

export default Tire;