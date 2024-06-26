import react from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './pages/Sidebar';
import Home from './pages/Home';
import Tires from './pages/Tires';
import TireEntryPage from './pages/TireEntryPage';
import TireEntry from './pages/TireEntry';
import HotelTireEntry from './pages/HotelTireEntry';
import AddStock from './pages/AddStock';
import TireExit from './pages/TireExit';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Warehouse from './pages/Warehouse';
import TireReserve from './pages/TireReserve';
import ReservedTires from './pages/ReservedTires';
import TireHotel from './pages/TireHotel';
import Dashboard from './pages/Dashboard';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />
}


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/tires" element={<Tires />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/tire-entry" element={<TireEntryPage />} />
        <Route path="/add-stock" element={<AddStock />} />
        <Route path="/add-new-tire" element={<TireEntry />} />
        <Route path="/add-tire-hotel" element={<HotelTireEntry />} />
        
        
        <Route path="/tire-exit" element={<TireExit />} />
        <Route path="/tire-reserve" element={<TireReserve />} />
        <Route path="/reserved-tires" element={<ReservedTires />} />
        <Route path="/tire-hotel" element={<TireHotel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Sidebar isLoggedIn={isLoggedIn} />
            </ProtectedRoute>
          }
          >
            
          <Route path="/" element={<Home />} />
          

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
