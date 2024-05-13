// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import { Button } from "@mui/material";

import '../styles/Sidebar.css';

const Sidebar = ( { isLoggedIn, adminIsLoggedIn }) => {
    return (
        <div className="sidebar">
            <h1>Protire Menu</h1>
            <ul>
                <li><Link to="/tires">Tire Gallery</Link></li>
                {/* <li><Button variant="contained">Tire Gallery</Button></li> */}
                <li><Link to="/warehouse">Warehouse</Link></li>
                {adminIsLoggedIn && <li><Link to="/edit-warehouse">Edit Warehouse</Link></li>}
                <li><Link to="/tire-entry">Tire Entry</Link></li>
                <li><Link to="/tire-exit">Tire Exit</Link></li>
                <li><Link to="/tire-reserve">Reserve a Tire</Link></li>
                <li><Link to="/reserved-tires">Reserved Tires</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/tire-hotel">Tire Hotel</Link></li>

                {isLoggedIn &&
                    <>
                        <button className="logout-button">
                            <Link to="/logout" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>Logout</Link>
                        </button>

                        {adminIsLoggedIn ? (
                            <h2>Logged in as admin user</h2>
                        ) : (
                            <h2>Logged in as general user</h2>
                        )}
                    </>
                }
            </ul>
        </div>
    );
};

export default Sidebar;

// Sidebar.propTypes = {
//     isLoggedIn: PropTypes.bool.isRequired,
//     adminIsLoggedIn: PropTypes.bool.isRequired,
// };