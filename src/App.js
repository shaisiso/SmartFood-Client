
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef } from "react";
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from './pages/MenuPage';
import NavbarRestaurant from './components/NavbarRestaurant';
import RestaurantImg from './assets/backgrounds/restaurant.png'
import WoodImg from './assets/backgrounds/dark_wood.jpg'
import Header from './components/Header';
import TableReservation from './pages/TableReservation';
import OrderPage from './pages/OrderPage';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeHomepage from './pages/EmployeeHomepage';
import NotFound404 from './pages/NotFound404';

function App() {
  const [isLogged, setIsLogged] = useState(false)
  const [userDetails, setUserDetails] = useState({ userPhone: '', accessToken: '', refreshToken: '' })

  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setIsLogged(JSON.parse(window.localStorage.getItem("isLogged")) || false)
      setUserDetails({
        userPhone: window.localStorage.getItem("phoneNumber") || "",
        accessToken: window.localStorage.getItem("accessToken") || "",
        refreshToken: window.localStorage.getItem("refreshToken") || ""
      })
    }
  },[]);
  const handleLogin = (phoneNumber, tokens) => {
    window.localStorage.setItem("isLogged", true);
    window.localStorage.setItem("accessToken", tokens.accessToken);
    window.localStorage.setItem("refreshToken", tokens.refreshToken);
    window.localStorage.setItem("phoneNumber", phoneNumber);
    setIsLogged(true)
    setUserDetails({
      userPhone: phoneNumber,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    })
  }
  const handleLogout = () => {
    localStorage.clear();

    setIsLogged(false);
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
      <div style={!isLogged ?
        {
          backgroundImage: `url(${RestaurantImg})`, backgroundPosition: 'top center',
          minHeight: '87vh', backgroundRepeat: 'repeat'
        } : { backgroundImage: `url(${WoodImg})` }}>
        <div className="container-fluid p-0">
          {getHeader()}
          <Routes>
            <Route exact path="/"
              element={isLogged ?
                <Navigate to="/employee" />
                :
                <Homepage />}>
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
                  <EmployeeLogin handleLogin={handleLogin} />
              }>
            </Route>
            <Route path="/employee/*"
              element={
                isLogged ?
                  <EmployeeHomepage handleLogout={handleLogout} />
                  :
                  <Navigate to="/login" />
              } />
            {isLogged ?
              <Route path="*" exact={true} element={<EmployeeHomepage handleLogout={handleLogout} userDetails={userDetails} />} />
              :
              <Route path="*" exact={true} element={<NotFound404 />} />
            }
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
