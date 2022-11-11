
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from './pages/MenuPage';
import NavbarRestaurant from './components/NavbarRestaurant';
import RestaurantImg from './assets/backgrounds/restaurant.png'
import Header from './components/Header';
import TableReservation from './pages/TableReservation';
import OrderPage from './pages/OrderPage';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeHomepage from './pages/EmployeeHomepage';

function App() {
  const [isLogged, setIsLogged] = useState(false)
  const onLogin = () => {
    console.log(`app`)
    setIsLogged(true);
  }
  const getNavbar = () => {
    if (isLogged)
      return null
    else
      return <NavbarRestaurant />

  }
  const getHeader = () => {
    return isLogged ? null : <Header />
  }
  return (
    <Router>
      {getNavbar()}
      <div  style={!isLogged ? {
        backgroundImage: `url(${RestaurantImg})`, backgroundPosition: 'top center',
        minHeight: '87vh', backgroundRepeat: 'repeat'
      } : {backgroundColor:'#00000010'}}>
        <div className="container-fluid p-0">
          {getHeader()}
          <Routes>
            <Route exact path="/"
              element={<Homepage />}>
            </Route>
            <Route path="/menu"
              element={<MenuPage />}>
            </Route>
            <Route path="/reservation"
              element={<TableReservation />}>
            </Route>
            <Route path="/order"
              element={<OrderPage />}>
            </Route>
            <Route path="/login"
              element={
                isLogged ?
                  <Navigate to="/employee" />
                  :
                  <EmployeeLogin onLogin={onLogin} />
              }>
            </Route>
            <Route path="/employee/*"
              element={
                isLogged ?
                  <EmployeeHomepage />
                  :
                  <Navigate to="/login" />
              }>
            </Route>
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
